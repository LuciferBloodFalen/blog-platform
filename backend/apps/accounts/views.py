from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    """
    User Registration

    Create a new user account with username, email, and password.
    Returns JWT tokens and user data on successful registration.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="auth_register",
        tags=["Authentication"],
        summary="Register new user",
        description="Create a new user account and receive authentication tokens",
        request=RegisterSerializer,
        responses={
            201: OpenApiResponse(
                description="User created successfully",
                examples=[
                    OpenApiExample(
                        "Registration Success",
                        value={
                            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "user": {
                                "id": 1,
                                "username": "johndoe",
                                "email": "john@example.com",
                                "is_author": False,
                                "created_at": "2026-02-19T10:00:00Z",
                            },
                        },
                    )
                ],
            ),
            400: OpenApiResponse(description="Invalid data provided"),
        },
        examples=[
            OpenApiExample(
                "Registration Request",
                value={
                    "username": "johndoe",
                    "email": "john@example.com",
                    "password": "SecurePassword123!",
                },
            )
        ],
    )
    def post(self, request):
        """Register a new user and return JWT tokens.

        Returns:
            Access token, refresh token, and user details on success.
        """
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_author": user.is_author,
                    "created_at": user.created_at,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    """
    User Authentication

    Authenticate user credentials and return JWT tokens for API access.
    """

    permission_classes = [AllowAny]

    @extend_schema(
        operation_id="auth_login",
        tags=["Authentication"],
        summary="User login",
        description="Authenticate with username/email and password to receive JWT tokens",
        request=LoginSerializer,
        responses={
            200: OpenApiResponse(
                description="Login successful",
                examples=[
                    OpenApiExample(
                        "Login Success",
                        value={
                            "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                            "user": {
                                "id": 1,
                                "username": "johndoe",
                                "email": "john@example.com",
                                "is_author": False,
                            },
                        },
                    )
                ],
            ),
            400: OpenApiResponse(description="Invalid credentials"),
        },
        examples=[
            OpenApiExample(
                "Login Request",
                value={"username": "johndoe", "password": "SecurePassword123!"},
            ),
            OpenApiExample(
                "Login with Email",
                value={"email": "john@example.com", "password": "SecurePassword123!"},
            ),
        ],
    )
    def post(self, request):
        """Authenticate user and return JWT tokens.

        Returns:
            Access token, refresh token, and user details on success.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    """
    User Logout

    Invalidate the current session by blacklisting the refresh token.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="auth_logout",
        tags=["Authentication"],
        summary="User logout",
        description="Blacklist the refresh token to invalidate the session",
        request=LogoutSerializer,
        responses={
            200: OpenApiResponse(
                description="Logout successful",
                examples=[
                    OpenApiExample(
                        "Logout Success", value={"message": "Successfully logged out"}
                    )
                ],
            ),
            400: OpenApiResponse(description="Invalid refresh token"),
        },
        examples=[
            OpenApiExample(
                "Logout Request",
                value={"refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."},
            )
        ],
    )
    def post(self, request):
        """Logout user by blacklisting their refresh token.

        Returns:
            Success message on successful logout.
        """
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK,
        )


class ProfileAPIView(APIView):
    """API view for retrieving the authenticated user's profile.

    GET: Returns the current user's profile information.
         Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the authenticated user's profile.

        Returns:
            User profile data including id, username, email, and metadata.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
