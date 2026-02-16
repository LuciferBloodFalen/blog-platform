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
    """API view for user registration.

    POST: Creates a new user account with username, email, and password.
          Returns JWT tokens and user data on success.
          No authentication required.
    """

    permission_classes = [AllowAny]

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
    """API view for user authentication.

    POST: Authenticates user credentials and returns JWT tokens.
          No authentication required.
    """

    def post(self, request):
        """Authenticate user and return JWT tokens.

        Returns:
            Access token, refresh token, and user details on success.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    """API view for user logout.

    POST: Blacklists the refresh token to invalidate the session.
          Requires authentication.
    """

    permission_classes = [IsAuthenticated]

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
