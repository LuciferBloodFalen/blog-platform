from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    username = serializers.CharField(
        max_length=150,
        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
    )
    email = serializers.EmailField(
        required=True, help_text="Required. A valid email address. Must be unique."
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        help_text="Required. Must meet password strength requirements.",
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "is_author",
            "created_at",
        ]
        read_only_fields = ["id", "is_author", "created_at"]
        extra_kwargs = {
            "id": {"help_text": "Unique identifier for the user."},
            "is_author": {
                "help_text": "Whether the user has author privileges (read-only)."
            },
            "created_at": {
                "help_text": "Timestamp when the account was created (read-only)."
            },
        }

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login authentication."""

    email = serializers.EmailField(
        help_text="The email address associated with the account."
    )
    password = serializers.CharField(
        write_only=True,
        help_text="The account password. Will not be returned in responses.",
    )

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")

        user = authenticate(username=user.username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_author": user.is_author,
            },
        }


class LogoutSerializer(serializers.Serializer):
    """Serializer for user logout."""

    refresh = serializers.CharField(help_text="The refresh token to be blacklisted.")

    def validate(self, attrs):
        self.token = attrs["refresh"]
        return attrs

    def save(self, **kwargs):
        try:
            token = RefreshToken(self.token)
            token.blacklist()
        except Exception:
            raise serializers.ValidationError("Invalid or expired token.")


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile information."""

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "is_author",
            "created_at",
        ]
        extra_kwargs = {
            "id": {"help_text": "Unique identifier for the user."},
            "username": {"help_text": "The user's display name."},
            "email": {"help_text": "The user's email address."},
            "is_author": {"help_text": "Whether the user has author privileges."},
            "created_at": {"help_text": "Timestamp when the account was created."},
        }
