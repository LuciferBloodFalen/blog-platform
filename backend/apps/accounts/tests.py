from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserModelTest(TestCase):
    """Test the User model"""

    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }

    def test_create_user(self):
        """Test creating a new user"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, self.user_data["username"])
        self.assertEqual(user.email, self.user_data["email"])
        self.assertFalse(user.is_author)  # Default value
        self.assertTrue(user.check_password(self.user_data["password"]))
        self.assertTrue(user.is_active)

    def test_user_str_representation(self):
        """Test the string representation of user"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), self.user_data["username"])

    def test_user_created_at_field(self):
        """Test that created_at is set automatically"""
        user = User.objects.create_user(**self.user_data)
        self.assertIsNotNone(user.created_at)


class RegisterViewTest(APITestCase):
    """Test user registration"""

    def setUp(self):
        self.register_url = reverse("register")
        self.valid_user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }

    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.valid_user_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

        user = User.objects.get()
        self.assertEqual(user.username, self.valid_user_data["username"])
        self.assertEqual(user.email, self.valid_user_data["email"])
        self.assertFalse(user.is_author)  # Default value
        self.assertTrue(user.check_password(self.valid_user_data["password"]))

        # Check response data
        self.assertIn("id", response.data)
        self.assertEqual(response.data["username"], self.valid_user_data["username"])
        self.assertEqual(response.data["email"], self.valid_user_data["email"])
        self.assertNotIn("password", response.data)

    def test_register_duplicate_email(self):
        """Test registration with duplicate email"""
        User.objects.create_user(**self.valid_user_data)

        new_user_data = self.valid_user_data.copy()
        new_user_data["username"] = "newuser"

        response = self.client.post(self.register_url, new_user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertIn("email", response.data)

    def test_register_case_insensitive_email(self):
        """Test registration with different case email"""
        User.objects.create_user(**self.valid_user_data)

        new_user_data = self.valid_user_data.copy()
        new_user_data["username"] = "newuser"
        new_user_data["email"] = "TEST@EXAMPLE.COM"

        response = self.client.post(self.register_url, new_user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_register_missing_username(self):
        """Test registration without username"""
        user_data = self.valid_user_data.copy()
        del user_data["username"]

        response = self.client.post(self.register_url, user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertIn("username", response.data)

    def test_register_missing_email(self):
        """Test registration without email"""
        user_data = self.valid_user_data.copy()
        del user_data["email"]

        response = self.client.post(self.register_url, user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertIn("email", response.data)

    def test_register_missing_password(self):
        """Test registration without password"""
        user_data = self.valid_user_data.copy()
        del user_data["password"]

        response = self.client.post(self.register_url, user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertIn("password", response.data)

    def test_register_invalid_email_format(self):
        """Test registration with invalid email format"""
        user_data = self.valid_user_data.copy()
        user_data["email"] = "invalid-email"

        response = self.client.post(self.register_url, user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertIn("email", response.data)

    def test_register_weak_password(self):
        """Test registration with weak password"""
        user_data = self.valid_user_data.copy()
        user_data["password"] = "123"  # Too short

        response = self.client.post(self.register_url, user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertIn("password", response.data)

    def test_register_common_password(self):
        """Test registration with common password"""
        user_data = self.valid_user_data.copy()
        user_data["password"] = "password"  # Too common

        response = self.client.post(self.register_url, user_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_register_empty_request(self):
        """Test registration with empty request"""
        response = self.client.post(self.register_url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)


class LoginAPIViewTest(APITestCase):
    """Test user login"""

    def setUp(self):
        self.login_url = reverse("login")
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_login_success(self):
        """Test successful login"""
        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"],
        }

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)

        # Check user data in response
        user_data = response.data["user"]
        self.assertEqual(user_data["id"], self.user.id)
        self.assertEqual(user_data["username"], self.user.username)
        self.assertEqual(user_data["email"], self.user.email)
        self.assertEqual(user_data["is_author"], self.user.is_author)

    def test_login_case_insensitive_email(self):
        """Test login with different case email"""
        login_data = {
            "email": self.user_data["email"].upper(),
            "password": self.user_data["password"],
        }

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_login_invalid_email(self):
        """Test login with non-existent email"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": self.user_data["password"],
        }

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_login_wrong_password(self):
        """Test login with wrong password"""
        login_data = {"email": self.user_data["email"], "password": "wrongpassword"}

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_login_inactive_user(self):
        """Test login with inactive user"""
        self.user.is_active = False
        self.user.save()

        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"],
        }

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_login_missing_email(self):
        """Test login without email"""
        login_data = {"password": self.user_data["password"]}

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_login_missing_password(self):
        """Test login without password"""
        login_data = {"email": self.user_data["email"]}

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_login_empty_request(self):
        """Test login with empty request"""
        response = self.client.post(self.login_url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_invalid_email_format(self):
        """Test login with invalid email format"""
        login_data = {"email": "invalid-email", "password": self.user_data["password"]}

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)


class LogoutAPIViewTest(APITestCase):
    """Test user logout"""

    def setUp(self):
        self.logout_url = reverse("logout")
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }
        self.user = User.objects.create_user(**self.user_data)
        self.refresh_token = RefreshToken.for_user(self.user)
        self.access_token = self.refresh_token.access_token

    def test_logout_success(self):
        """Test successful logout"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        logout_data = {"refresh": str(self.refresh_token)}
        response = self.client.post(self.logout_url, logout_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["detail"], "Successfully logged out.")

    def test_logout_unauthenticated(self):
        """Test logout without authentication"""
        logout_data = {"refresh": str(self.refresh_token)}
        response = self.client.post(self.logout_url, logout_data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_invalid_token(self):
        """Test logout with invalid refresh token"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        logout_data = {"refresh": "invalid_token"}
        response = self.client.post(self.logout_url, logout_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # The error is returned as a simple list, not in non_field_errors
        self.assertTrue(isinstance(response.data, list))
        self.assertIn("Invalid or expired token", str(response.data))

    def test_logout_missing_refresh_token(self):
        """Test logout without refresh token"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        response = self.client.post(self.logout_url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("refresh", response.data)

    def test_logout_already_blacklisted_token(self):
        """Test logout with already blacklisted token"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        # Blacklist the token first
        self.refresh_token.blacklist()

        logout_data = {"refresh": str(self.refresh_token)}
        response = self.client.post(self.logout_url, logout_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # The error is returned as a simple list, not in non_field_errors
        self.assertTrue(isinstance(response.data, list))
        self.assertIn("Invalid or expired token", str(response.data))

    def test_logout_expired_access_token(self):
        """Test logout with expired access token"""
        # Create a token and then manually expire it
        from datetime import timedelta

        from django.utils import timezone
        from rest_framework_simplejwt.tokens import AccessToken

        # Create an access token with past expiration
        access = AccessToken.for_user(self.user)
        access.payload["exp"] = int((timezone.now() - timedelta(hours=1)).timestamp())

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(access)}")

        logout_data = {"refresh": str(self.refresh_token)}
        response = self.client.post(self.logout_url, logout_data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileAPIViewTest(APITestCase):
    """Test user profile retrieval"""

    def setUp(self):
        self.profile_url = reverse("profile")
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "is_author": True,
        }
        self.user = User.objects.create_user(**self.user_data)
        self.refresh_token = RefreshToken.for_user(self.user)
        self.access_token = self.refresh_token.access_token

    def test_profile_success(self):
        """Test successful profile retrieval"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["username"], self.user.username)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["is_author"], self.user.is_author)
        self.assertIn("created_at", response.data)

    def test_profile_unauthenticated(self):
        """Test profile retrieval without authentication"""
        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_invalid_token(self):
        """Test profile retrieval with invalid token"""
        self.client.credentials(HTTP_AUTHORIZATION="Bearer invalid_token")

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_expired_token(self):
        """Test profile retrieval with expired token"""
        from datetime import timedelta

        from django.utils import timezone
        from rest_framework_simplejwt.tokens import AccessToken

        # Create an access token with past expiration
        access = AccessToken.for_user(self.user)
        access.payload["exp"] = int((timezone.now() - timedelta(hours=1)).timestamp())

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(access)}")

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_inactive_user(self):
        """Test profile retrieval with inactive user"""
        self.user.is_active = False
        self.user.save()

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenRefreshViewTest(APITestCase):
    """Test token refresh functionality"""

    def setUp(self):
        self.refresh_url = reverse("token_refresh")
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }
        self.user = User.objects.create_user(**self.user_data)
        self.refresh_token = RefreshToken.for_user(self.user)

    def test_token_refresh_success(self):
        """Test successful token refresh"""
        refresh_data = {"refresh": str(self.refresh_token)}
        response = self.client.post(self.refresh_url, refresh_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_token_refresh_invalid_token(self):
        """Test token refresh with invalid token"""
        refresh_data = {"refresh": "invalid_token"}
        response = self.client.post(self.refresh_url, refresh_data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh_missing_token(self):
        """Test token refresh without token"""
        response = self.client.post(self.refresh_url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("refresh", response.data)

    def test_token_refresh_blacklisted_token(self):
        """Test token refresh with blacklisted token"""
        self.refresh_token.blacklist()

        refresh_data = {"refresh": str(self.refresh_token)}
        response = self.client.post(self.refresh_url, refresh_data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh_expired_token(self):
        """Test token refresh with expired token"""
        from datetime import timedelta

        from django.utils import timezone

        # Create a refresh token with past expiration
        expired_token = RefreshToken.for_user(self.user)
        expired_token.payload["exp"] = int(
            (timezone.now() - timedelta(hours=1)).timestamp()
        )

        refresh_data = {"refresh": str(expired_token)}
        response = self.client.post(self.refresh_url, refresh_data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthenticationIntegrationTest(APITestCase):
    """Integration tests for the complete authentication flow"""

    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.logout_url = reverse("logout")
        self.profile_url = reverse("profile")
        self.refresh_url = reverse("token_refresh")

        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }

    def test_complete_authentication_flow(self):
        """Test complete registration -> login -> profile -> logout flow"""
        # 1. Register user
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 2. Login
        login_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"],
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_token = response.data["access"]
        refresh_token = response.data["refresh"]

        # 3. Get profile
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user_data["email"])

        # 4. Refresh token
        refresh_data = {"refresh": refresh_token}
        response = self.client.post(self.refresh_url, refresh_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

        # 5. Logout
        logout_data = {"refresh": refresh_token}
        response = self.client.post(self.logout_url, logout_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 6. Try to use the refresh token again (should fail)
        response = self.client.post(self.refresh_url, refresh_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
