from rest_framework import serializers

from .models import Category, Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

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
