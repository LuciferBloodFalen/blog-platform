from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Comment, Like, Post, Tag
from .permissions import IsAuthorOrReadOnly
from .serializers import (
    CategorySerializer,
    CommentSerializer,
    PostDetailSerializer,
    PostSerializer,
    TagSerializer,
)


class PostListCreateAPIView(generics.ListCreateAPIView):
    """API view for listing and creating blog posts.

    GET: Returns a paginated list of published posts. Supports filtering
         by category, searching in title/content, and ordering by date.
    POST: Creates a new post. Requires authentication.

    Filtering:
        - category__slug: Filter posts by category slug

    Search Fields:
        - title, content

    Ordering:
        - created_at (default: descending)
    """

    serializer_class = PostSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]

    filterset_fields = {
        "category__slug": ["exact"],
        "tags__slug": ["exact"],
    }

    search_fields = ["title", "content"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Return published posts with optimized related data fetching."""
        return (
            Post.objects.filter(is_published=True)
            .select_related("author", "category")
            .prefetch_related("tags")
        )

    def get_permissions(self):
        """Allow anyone to list posts, but require auth to create."""
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        """Set the authenticated user as the post author on creation."""
        serializer.save(author=self.request.user)


class PostRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    """API view for retrieving, updating, and deleting a single post.

    GET: Retrieve a post by slug. Authors can view their own drafts.
    PUT/PATCH: Update a post. Only the author can modify their posts.
    DELETE: Remove a post. Only the author can delete their posts.

    Note: The slug field is immutable and cannot be updated.
    """

    serializer_class = PostDetailSerializer
    lookup_field = "slug"
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        """Return all posts for individual post retrieval.

        Since access is controlled by knowing the slug, we allow viewing
        any post by slug regardless of published status or author.
        This enables proper viewing of draft posts from the dashboard.
        """
        return (
            Post.objects.all()
            .select_related("author", "category")
            .prefetch_related("tags", "comments")
            .order_by("-created_at")
        )


class CategoryListCreateAPIView(ListCreateAPIView):
    """API view for listing and creating categories.

    GET: Returns all categories.
    POST: Creates a new category. Requires authentication.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class TagListCreateAPIView(ListCreateAPIView):
    """API view for listing and creating tags.

    GET: Returns all tags.
    POST: Creates a new tag. Requires authentication.
    """

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class PostCommentsAPIView(APIView):
    """API view for listing and creating comments on a post.

    GET: Returns all comments for a post, ordered by most recent first.
    POST: Creates a new comment on a post. Requires authentication.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, slug):
        """Retrieve all comments for a specific post.

        Args:
            slug: The unique slug identifier of the post.

        Returns:
            List of comments ordered by creation date (newest first).
        """
        post = get_object_or_404(Post, slug=slug)
        comments = post.comments.all().order_by("-created_at")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, slug):
        """Create a new comment on a post.

        Args:
            slug: The unique slug identifier of the post.

        Returns:
            The created comment data with 201 status on success,
            or validation errors with 400 status on failure.
        """
        post = get_object_or_404(Post, slug=slug)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDeleteAPIView(APIView):
    """API view for deleting a comment.

    DELETE: Removes a comment. Only the comment author can delete it.
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        """Delete a comment by ID.

        Args:
            id: The unique identifier of the comment.

        Returns:
            204 No Content on success, 403 Forbidden if not the author.
        """
        comment = get_object_or_404(Comment, id=id)

        if comment.user != request.user:
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LikePostAPIView(APIView):
    """API view for liking a post.

    POST: Adds a like to a post. Duplicate likes are ignored (idempotent).
          Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        """Like a post.

        Args:
            slug: The unique slug identifier of the post.

        Returns:
            Success message with current like status and count.
        """
        post = get_object_or_404(Post, slug=slug)

        like, created = Like.objects.get_or_create(
            post=post,
            user=request.user,
        )

        # Get current total likes count
        total_likes = post.likes.count()

        return Response(
            {
                "message": "Post liked" if created else "Post already liked",
                "liked": True,
                "likes_count": total_likes,
                "was_created": created,
            }
        )


class UnlikePostAPIView(APIView):
    """API view for unliking a post.

    POST: Removes a like from a post. Requires authentication.
          No error if the post was not previously liked.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        """Remove a like from a post.

        Args:
            slug: The unique slug identifier of the post.

        Returns:
            Success message with current like status and count.
        """
        post = get_object_or_404(Post, slug=slug)

        deleted_count, _ = Like.objects.filter(
            post=post,
            user=request.user,
        ).delete()

        # Get current total likes count
        total_likes = post.likes.count()

        return Response(
            {
                "message": "Post unliked"
                if deleted_count > 0
                else "Post was not liked",
                "liked": False,
                "likes_count": total_likes,
                "was_removed": deleted_count > 0,
            }
        )


class PostLikeStatusAPIView(APIView):
    """API view for checking if user has liked a post.

    GET: Returns current like status and total likes count.
         Authentication optional - returns liked: false for anonymous users.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, slug):
        """Get like status for a post.

        Args:
            slug: The unique slug identifier of the post.

        Returns:
            Current like status and count for the user.
        """
        post = get_object_or_404(Post, slug=slug)

        # Check if user has liked this post
        if request.user.is_authenticated:
            liked = Like.objects.filter(post=post, user=request.user).exists()
        else:
            liked = False

        # Get total likes count
        likes_count = post.likes.count()

        return Response({"liked": liked, "likes_count": likes_count})


class MyPostsListAPIView(generics.ListAPIView):
    """API view for listing the authenticated user's posts.

    GET: Returns a paginated list of posts created by the authenticated user,
         including both published and draft posts.
    """

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "content"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Return posts created by the authenticated user."""
        return (
            Post.objects.filter(author=self.request.user)
            .select_related("author", "category")
            .prefetch_related("tags")
        )
