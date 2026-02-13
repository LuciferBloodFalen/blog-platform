from rest_framework import serializers

from .models import Category, Comment, Post, Tag


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    likes_count = serializers.IntegerField(
        source="likes.count",
        read_only=True
    )

    class Meta:
        model = Post
        fields = [
            "title",
            "slug",
            "content",
            "author",
            "category",
            "tags",
            "is_published",
            "created_at",
            "updated_at",
            "likes_count",
        ]
        read_only_fields = ("created_at", "updated_at")


class PostDetailSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    slug = serializers.ReadOnlyField()

    class Meta:
        model = Post
        fields = [
            "title",
            "slug",
            "content",
            "author",
            "category",
            "tags",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ("created_at", "updated_at")


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at"]
