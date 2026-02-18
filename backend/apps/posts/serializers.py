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
    categories = serializers.SerializerMethodField(
        help_text="List of categories for this post."
    )
    tags = serializers.SerializerMethodField(
        help_text="List of tags associated with this post."
    )
    tags_input = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
        write_only=True,
        help_text="List of tag IDs to associate with this post (write-only).",
    )
    is_published = serializers.BooleanField(
        default=False,
        help_text="Whether the post is publicly visible. Defaults to false (draft).",
    )
    status = serializers.SerializerMethodField(
        help_text="Post status: draft, published, or archived."
    )
    likes_count = serializers.IntegerField(
        source="likes.count",
        read_only=True,
        help_text="Total number of likes on this post (read-only).",
    )
    comments_count = serializers.IntegerField(
        source="comments.count",
        read_only=True,
        help_text="Total number of comments on this post (read-only).",
    )

    def get_categories(self, obj):
        """Return category as a list for frontend compatibility."""
        if obj.category:
            return [
                {
                    "id": obj.category.id,
                    "name": obj.category.name,
                    "slug": obj.category.slug,
                }
            ]
        return []

    def get_tags(self, obj):
        """Return tags with full data for frontend."""
        return [
            {"id": tag.id, "name": tag.name, "slug": tag.slug} for tag in obj.tags.all()
        ]

    def get_status(self, obj):
        """Return status based on is_published field."""
        return "published" if obj.is_published else "draft"

    def create(self, validated_data):
        """Handle tags during creation."""
        tags_data = validated_data.pop("tags_input", [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tags_data)
        return post

    def update(self, instance, validated_data):
        """Handle tags during update."""
        tags_data = validated_data.pop("tags_input", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags_data is not None:
            instance.tags.set(tags_data)

        return instance

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "author",
            "category",
            "categories",
            "tags",
            "tags_input",
            "is_published",
            "status",
            "created_at",
            "updated_at",
            "likes_count",
            "comments_count",
        ]
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "slug",
            "categories",
            "status",
            "tags",
            "likes_count",
            "comments_count",
        )
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
    categories = serializers.SerializerMethodField(
        help_text="List of categories for this post."
    )
    tags = serializers.SerializerMethodField(
        help_text="List of tags associated with this post."
    )
    tags_input = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
        write_only=True,
        help_text="List of tag IDs to associate with this post (write-only).",
    )
    is_published = serializers.BooleanField(
        default=False, help_text="Whether the post is publicly visible."
    )
    status = serializers.SerializerMethodField(
        help_text="Post status: draft, published, or archived."
    )
    likes_count = serializers.IntegerField(
        source="likes.count",
        read_only=True,
        help_text="Total number of likes on this post (read-only).",
    )
    comments_count = serializers.IntegerField(
        source="comments.count",
        read_only=True,
        help_text="Total number of comments on this post (read-only).",
    )
    comments = serializers.SerializerMethodField(
        help_text="List of comments for this post, ordered by creation date (newest first)."
    )

    def get_categories(self, obj):
        """Return category as a list for frontend compatibility."""
        if obj.category:
            return [
                {
                    "id": obj.category.id,
                    "name": obj.category.name,
                    "slug": obj.category.slug,
                }
            ]
        return []

    def get_tags(self, obj):
        """Return tags with full data for frontend."""
        return [
            {"id": tag.id, "name": tag.name, "slug": tag.slug} for tag in obj.tags.all()
        ]

    def get_status(self, obj):
        """Return status based on is_published field."""
        return "published" if obj.is_published else "draft"

    def get_comments(self, obj):
        """Return comments for this post, ordered by newest first."""
        comments = obj.comments.all().order_by("-created_at")
        return CommentSerializer(comments, many=True).data

    def update(self, instance, validated_data):
        """Handle tags during update."""
        tags_data = validated_data.pop("tags_input", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags_data is not None:
            instance.tags.set(tags_data)

        return instance

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "author",
            "category",
            "categories",
            "tags",
            "tags_input",
            "is_published",
            "status",
            "likes_count",
            "comments_count",
            "comments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "categories",
            "status",
            "tags",
            "likes_count",
            "comments_count",
            "comments",
        )
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
