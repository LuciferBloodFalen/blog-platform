from rest_framework import serializers

from .models import Category, Comment, Post, Tag


class PostSerializer(serializers.ModelSerializer):
    """Serializer for listing and creating blog posts."""

    title = serializers.CharField(
        max_length=255, help_text="The title of the blog post (max 255 characters)."
    )
    slug = serializers.SlugField(
        read_only=True,
        help_text="URL-friendly identifier for the post. Auto-generated from title.",
    )
    content = serializers.CharField(help_text="The main body content of the blog post.")
    author = serializers.ReadOnlyField(
        source="author.username", help_text="Username of the post author (read-only)."
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
        help_text="ID of the category this post belongs to.",
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
        help_text="List of tag IDs associated with this post.",
    )
    is_published = serializers.BooleanField(
        default=False,
        help_text="Whether the post is publicly visible. Defaults to false (draft).",
    )
    likes_count = serializers.IntegerField(
        source="likes.count",
        read_only=True,
        help_text="Total number of likes on this post (read-only).",
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
        read_only_fields = ("created_at", "updated_at", "slug")
        extra_kwargs = {
            "created_at": {
                "help_text": "Timestamp when the post was created (read-only)."
            },
            "updated_at": {
                "help_text": "Timestamp when the post was last updated (read-only)."
            },
        }


class PostDetailSerializer(serializers.ModelSerializer):
    """Serializer for retrieving and updating a single post."""

    title = serializers.CharField(
        max_length=255, help_text="The title of the blog post (max 255 characters)."
    )
    slug = serializers.ReadOnlyField(
        help_text="URL-friendly identifier. Cannot be changed after creation."
    )
    content = serializers.CharField(help_text="The main body content of the blog post.")
    author = serializers.ReadOnlyField(
        source="author.username", help_text="Username of the post author (read-only)."
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
        help_text="ID of the category this post belongs to.",
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
        help_text="List of tag IDs associated with this post.",
    )
    is_published = serializers.BooleanField(
        default=False, help_text="Whether the post is publicly visible."
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
        ]
        read_only_fields = ("created_at", "updated_at")
        extra_kwargs = {
            "created_at": {
                "help_text": "Timestamp when the post was created (read-only)."
            },
            "updated_at": {
                "help_text": "Timestamp when the post was last updated (read-only)."
            },
        }


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for blog post categories."""

    name = serializers.CharField(
        max_length=100,
        help_text="Display name of the category (max 100 characters, must be unique).",
    )
    slug = serializers.SlugField(
        help_text="URL-friendly identifier for the category (must be unique)."
    )

    class Meta:
        model = Category
        fields = ["id", "name", "slug"]
        extra_kwargs = {
            "id": {"help_text": "Unique identifier for the category."},
        }


class TagSerializer(serializers.ModelSerializer):
    """Serializer for blog post tags."""

    name = serializers.CharField(
        max_length=50,
        help_text="Display name of the tag (max 50 characters, must be unique).",
    )
    slug = serializers.SlugField(
        help_text="URL-friendly identifier for the tag (must be unique)."
    )

    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]
        extra_kwargs = {
            "id": {"help_text": "Unique identifier for the tag."},
        }


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for post comments."""

    user = serializers.StringRelatedField(
        read_only=True, help_text="Username of the comment author (read-only)."
    )
    content = serializers.CharField(help_text="The text content of the comment.")

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at"]
        extra_kwargs = {
            "id": {"help_text": "Unique identifier for the comment."},
            "created_at": {
                "help_text": "Timestamp when the comment was created (read-only)."
            },
        }
