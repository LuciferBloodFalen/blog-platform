from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Comment, Like, Post, Tag

User = get_user_model()


class PostAPITestCase(APITestCase):
    """Test cases for Post APIs"""

    def setUp(self):
        # Create test users
        self.user1 = User.objects.create_user(
            username="author1", email="author1@test.com", password="testpass123"
        )
        self.user2 = User.objects.create_user(
            username="author2", email="author2@test.com", password="testpass123"
        )

        # Create test category and tags
        self.category = Category.objects.create(name="Technology", slug="technology")
        self.tag1 = Tag.objects.create(name="Python", slug="python")
        self.tag2 = Tag.objects.create(name="Django", slug="django")

        # Create test posts
        self.published_post = Post.objects.create(
            title="Published Post",
            slug="published-post",
            content="This is a published post",
            author=self.user1,
            category=self.category,
            is_published=True,
        )
        self.published_post.tags.add(self.tag1)

        self.unpublished_post = Post.objects.create(
            title="Unpublished Post",
            slug="unpublished-post",
            content="This is an unpublished post",
            author=self.user1,
            is_published=False,
        )

        self.user2_post = Post.objects.create(
            title="User2 Post",
            slug="user2-post",
            content="Post by user2",
            author=self.user2,
            is_published=True,
        )

    def test_list_posts_unauthenticated(self):
        """Unauthenticated users should only see published posts"""
        url = reverse("post-list-create")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)  # Only published posts

        post_titles = [post["title"] for post in response.data["results"]]
        self.assertIn("Published Post", post_titles)
        self.assertIn("User2 Post", post_titles)
        self.assertNotIn("Unpublished Post", post_titles)

    def test_list_posts_authenticated(self):
        """Authenticated users should see all published posts"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-list-create")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)  # Only published posts

    def test_list_posts_with_filters(self):
        """Test filtering posts by category"""
        url = reverse("post-list-create")
        response = self.client.get(url, {"category__slug": "technology"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], "Published Post")

    def test_list_posts_with_search(self):
        """Test searching posts by title and content"""
        url = reverse("post-list-create")
        response = self.client.get(url, {"search": "published"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], "Published Post")

    def test_list_posts_ordering(self):
        """Test ordering posts by created_at"""
        url = reverse("post-list-create")
        response = self.client.get(url, {"ordering": "created_at"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return posts in ascending order of creation

    def test_create_post_unauthenticated(self):
        """Unauthenticated users cannot create posts"""
        url = reverse("post-list-create")
        data = {
            "title": "New Post",
            "slug": "new-post",
            "content": "New post content",
            "is_published": True,
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_post_authenticated(self):
        """Authenticated users can create posts"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-list-create")
        data = {
            "title": "New Post",
            "slug": "new-post",
            "content": "New post content",
            "category": self.category.id,
            "tags": [self.tag1.id, self.tag2.id],
            "is_published": True,
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Post")
        self.assertEqual(response.data["author"], self.user1.username)

    def test_create_post_invalid_data(self):
        """Test creating post with invalid data"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-list-create")
        data = {
            "title": "",  # Empty title should fail
            "content": "New post content",
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_published_post_unauthenticated(self):
        """Unauthenticated users can view published posts"""
        url = reverse("post-detail", kwargs={"slug": self.published_post.slug})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Published Post")

    def test_retrieve_unpublished_post_unauthenticated(self):
        """Unauthenticated users cannot view unpublished posts"""
        url = reverse("post-detail", kwargs={"slug": self.unpublished_post.slug})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_unpublished_post_by_author(self):
        """Authors can view their own unpublished posts"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-detail", kwargs={"slug": self.unpublished_post.slug})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Unpublished Post")

    def test_retrieve_unpublished_post_by_other_user(self):
        """Other users cannot view unpublished posts"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("post-detail", kwargs={"slug": self.unpublished_post.slug})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_by_author(self):
        """Authors can update their own posts"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-detail", kwargs={"slug": self.published_post.slug})
        data = {
            "title": "Updated Post Title",
            "content": "Updated content",
            "is_published": True,
        }
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Post Title")

    def test_update_post_by_other_user(self):
        """Other users cannot update posts"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("post-detail", kwargs={"slug": self.published_post.slug})
        data = {"title": "Hacked Title"}
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_post_unauthenticated(self):
        """Unauthenticated users cannot update posts"""
        url = reverse("post-detail", kwargs={"slug": self.published_post.slug})
        data = {"title": "Hacked Title"}
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_post_by_author(self):
        """Authors can delete their own posts"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-detail", kwargs={"slug": self.published_post.slug})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(slug=self.published_post.slug).exists())

    def test_delete_post_by_other_user(self):
        """Other users cannot delete posts"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("post-detail", kwargs={"slug": self.published_post.slug})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_nonexistent_post(self):
        """Test retrieving a non-existent post"""
        url = reverse("post-detail", kwargs={"slug": "nonexistent-slug"})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CommentAPITestCase(APITestCase):
    """Test cases for Comment APIs"""

    def setUp(self):
        self.user1 = User.objects.create_user(
            username="commenter1", email="commenter1@test.com", password="testpass123"
        )
        self.user2 = User.objects.create_user(
            username="commenter2", email="commenter2@test.com", password="testpass123"
        )

        self.post = Post.objects.create(
            title="Test Post",
            slug="test-post",
            content="Test content",
            author=self.user1,
            is_published=True,
        )

        self.comment = Comment.objects.create(
            post=self.post, user=self.user1, content="Test comment"
        )

    def test_list_comments_unauthenticated(self):
        """Unauthenticated users can view comments"""
        url = reverse("post-comments", kwargs={"slug": self.post.slug})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["content"], "Test comment")

    def test_list_comments_authenticated(self):
        """Authenticated users can view comments"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-comments", kwargs={"slug": self.post.slug})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_comment_unauthenticated(self):
        """Unauthenticated users cannot create comments"""
        url = reverse("post-comments", kwargs={"slug": self.post.slug})
        data = {"content": "New comment"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_comment_authenticated(self):
        """Authenticated users can create comments"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("post-comments", kwargs={"slug": self.post.slug})
        data = {"content": "New comment by user2"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["content"], "New comment by user2")
        self.assertEqual(Comment.objects.count(), 2)

    def test_create_comment_invalid_data(self):
        """Test creating comment with invalid data"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-comments", kwargs={"slug": self.post.slug})
        data = {"content": ""}  # Empty content should fail
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_comment_nonexistent_post(self):
        """Test creating comment for non-existent post"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-comments", kwargs={"slug": "nonexistent-slug"})
        data = {"content": "New comment"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_comment_by_owner(self):
        """Comment owners can delete their comments"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("comment-delete", kwargs={"id": self.comment.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())

    def test_delete_comment_by_other_user(self):
        """Other users cannot delete comments"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("comment-delete", kwargs={"id": self.comment.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_comment_unauthenticated(self):
        """Unauthenticated users cannot delete comments"""
        url = reverse("comment-delete", kwargs={"id": self.comment.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_nonexistent_comment(self):
        """Test deleting non-existent comment"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("comment-delete", kwargs={"id": 99999})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class LikeAPITestCase(APITestCase):
    """Test cases for Like/Unlike APIs"""

    def setUp(self):
        self.user1 = User.objects.create_user(
            username="liker1", email="liker1@test.com", password="testpass123"
        )
        self.user2 = User.objects.create_user(
            username="liker2", email="liker2@test.com", password="testpass123"
        )

        self.post = Post.objects.create(
            title="Test Post",
            slug="test-post",
            content="Test content",
            author=self.user1,
            is_published=True,
        )

    def test_like_post_authenticated(self):
        """Authenticated users can like posts"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("post-like", kwargs={"slug": self.post.slug})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Post liked")
        self.assertTrue(Like.objects.filter(post=self.post, user=self.user2).exists())

    def test_like_post_unauthenticated(self):
        """Unauthenticated users cannot like posts"""
        url = reverse("post-like", kwargs={"slug": self.post.slug})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_like_post_multiple_times(self):
        """Liking the same post multiple times should not create duplicates"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("post-like", kwargs={"slug": self.post.slug})

        # First like
        response1 = self.client.post(url)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        # Second like (should not create duplicate)
        response2 = self.client.post(url)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        # Should still have only one like
        self.assertEqual(
            Like.objects.filter(post=self.post, user=self.user2).count(), 1
        )

    def test_like_nonexistent_post(self):
        """Test liking a non-existent post"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-like", kwargs={"slug": "nonexistent-slug"})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unlike_post_authenticated(self):
        """Authenticated users can unlike posts"""
        # First create a like
        Like.objects.create(post=self.post, user=self.user2)

        self.client.force_authenticate(user=self.user2)
        url = reverse("post-unlike", kwargs={"slug": self.post.slug})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Post unliked")
        self.assertFalse(Like.objects.filter(post=self.post, user=self.user2).exists())

    def test_unlike_post_unauthenticated(self):
        """Unauthenticated users cannot unlike posts"""
        url = reverse("post-unlike", kwargs={"slug": self.post.slug})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_post_without_like(self):
        """Unliking a post without prior like should still work"""
        self.client.force_authenticate(user=self.user2)
        url = reverse("post-unlike", kwargs={"slug": self.post.slug})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Post unliked")

    def test_unlike_nonexistent_post(self):
        """Test unliking a non-existent post"""
        self.client.force_authenticate(user=self.user1)
        url = reverse("post-unlike", kwargs={"slug": "nonexistent-slug"})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CategoryAPITestCase(APITestCase):
    """Test cases for Category APIs"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@test.com", password="testpass123"
        )

        self.category = Category.objects.create(name="Technology", slug="technology")

    def test_list_categories_unauthenticated(self):
        """Unauthenticated users cannot list categories"""
        url = "/api/categories/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_categories_authenticated(self):
        """Authenticated users can list categories"""
        self.client.force_authenticate(user=self.user)
        url = "/api/categories/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response is paginated or direct list
        if "results" in response.data:
            self.assertEqual(len(response.data["results"]), 1)
            self.assertEqual(response.data["results"][0]["name"], "Technology")
        else:
            self.assertEqual(len(response.data), 1)
            self.assertEqual(response.data[0]["name"], "Technology")

    def test_create_category_unauthenticated(self):
        """Unauthenticated users cannot create categories"""
        url = "/api/categories/"
        data = {"name": "Science", "slug": "science"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_category_authenticated(self):
        """Authenticated users can create categories"""
        self.client.force_authenticate(user=self.user)
        url = "/api/categories/"
        initial_count = Category.objects.count()
        data = {"name": "Science", "slug": "science"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Science")
        self.assertEqual(Category.objects.count(), initial_count + 1)

    def test_create_category_duplicate_name(self):
        """Cannot create category with duplicate name"""
        self.client.force_authenticate(user=self.user)
        url = "/api/categories/"
        data = {"name": "Technology", "slug": "tech-2"}  # Same name, different slug
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_category_duplicate_slug(self):
        """Cannot create category with duplicate slug"""
        self.client.force_authenticate(user=self.user)
        url = "/api/categories/"
        data = {"name": "Tech 2", "slug": "technology"}  # Different name, same slug
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_category_invalid_data(self):
        """Test creating category with invalid data"""
        self.client.force_authenticate(user=self.user)
        url = "/api/categories/"
        data = {"name": "", "slug": "empty-name"}  # Empty name should fail
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TagAPITestCase(APITestCase):
    """Test cases for Tag APIs"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@test.com", password="testpass123"
        )

        self.tag = Tag.objects.create(name="Python", slug="python")

    def test_list_tags_unauthenticated(self):
        """Unauthenticated users cannot list tags"""
        url = "/api/tags/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_tags_authenticated(self):
        """Authenticated users can list tags"""
        self.client.force_authenticate(user=self.user)
        url = "/api/tags/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response is paginated or direct list
        if "results" in response.data:
            self.assertEqual(len(response.data["results"]), 1)
            self.assertEqual(response.data["results"][0]["name"], "Python")
        else:
            self.assertEqual(len(response.data), 1)
            self.assertEqual(response.data[0]["name"], "Python")

    def test_create_tag_unauthenticated(self):
        """Unauthenticated users cannot create tags"""
        url = "/api/tags/"
        data = {"name": "Django", "slug": "django"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_tag_authenticated(self):
        """Authenticated users can create tags"""
        self.client.force_authenticate(user=self.user)
        url = "/api/tags/"
        initial_count = Tag.objects.count()
        data = {"name": "Django", "slug": "django"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Django")
        self.assertEqual(Tag.objects.count(), initial_count + 1)

    def test_create_tag_duplicate_name(self):
        """Cannot create tag with duplicate name"""
        self.client.force_authenticate(user=self.user)
        url = "/api/tags/"
        data = {"name": "Python", "slug": "python-2"}  # Same name, different slug
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tag_duplicate_slug(self):
        """Cannot create tag with duplicate slug"""
        self.client.force_authenticate(user=self.user)
        url = "/api/tags/"
        data = {"name": "Python 2", "slug": "python"}  # Different name, same slug
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_tag_invalid_data(self):
        """Test creating tag with invalid data"""
        self.client.force_authenticate(user=self.user)
        url = "/api/tags/"
        data = {"name": "", "slug": "empty-name"}  # Empty name should fail
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ModelTestCase(TestCase):
    """Test cases for model methods and constraints"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@test.com", password="testpass123"
        )

        self.category = Category.objects.create(name="Technology", slug="technology")

        self.tag = Tag.objects.create(name="Python", slug="python")

        self.post = Post.objects.create(
            title="Test Post",
            slug="test-post",
            content="Test content",
            author=self.user,
            category=self.category,
            is_published=True,
        )

    def test_category_str_method(self):
        """Test Category __str__ method"""
        self.assertEqual(str(self.category), "Technology")

    def test_tag_str_method(self):
        """Test Tag __str__ method"""
        self.assertEqual(str(self.tag), "Python")

    def test_post_str_method(self):
        """Test Post __str__ method"""
        self.assertEqual(str(self.post), "Test Post")

    def test_comment_str_method(self):
        """Test Comment __str__ method"""
        comment = Comment.objects.create(
            post=self.post, user=self.user, content="Test comment"
        )
        expected_str = f"Comment by {self.user}"
        self.assertEqual(str(comment), expected_str)

    def test_like_str_method(self):
        """Test Like __str__ method"""
        like = Like.objects.create(post=self.post, user=self.user)
        expected_str = f"{self.user} likes {self.post}"
        self.assertEqual(str(like), expected_str)

    def test_like_unique_constraint(self):
        """Test that a user can only like a post once"""
        # Create first like
        Like.objects.create(post=self.post, user=self.user)

        # Try to create duplicate like - should raise IntegrityError
        from django.db import IntegrityError

        with self.assertRaises(IntegrityError):
            Like.objects.create(post=self.post, user=self.user)

    def test_post_with_tags(self):
        """Test adding tags to posts"""
        tag2 = Tag.objects.create(name="Django", slug="django")
        self.post.tags.add(self.tag, tag2)

        self.assertEqual(self.post.tags.count(), 2)
        self.assertIn(self.tag, self.post.tags.all())
        self.assertIn(tag2, self.post.tags.all())
