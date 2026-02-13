from django.db.models import Q
from rest_framework import generics, permissions

from .models import Post
from .permissions import IsAuthorOrReadOnly
from .serializers import PostDetailSerializer, PostSerializer


class PostListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return (
            Post.objects.filter(is_published=True)
            .select_related("author", "category")
            .prefetch_related("tags")
            .order_by("-created_at")
        )

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostDetailSerializer
    lookup_field = "slug"
    permission_classes = [IsAuthorOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return (
                Post.objects.filter(Q(is_published=True) | Q(author=user))
                .select_related("author", "category")
                .prefetch_related("tags")
                .order_by("-created_at")
            )

        return Post.objects.filter(is_published=True)
