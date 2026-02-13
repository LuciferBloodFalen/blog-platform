from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Category, Post
from .permissions import IsAuthorOrReadOnly
from .serializers import CategorySerializer, PostDetailSerializer, PostSerializer


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


class CategoryListCreateAPIView(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
