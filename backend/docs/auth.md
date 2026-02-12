# Authentication APIs

This document outlines the authentication endpoints available in the blog platform.

Base URL: `/api/auth/`

## 1. User Registration

**Endpoint:** `POST /api/auth/register/`

**Authentication Required:** No

**Description:** Create a new user account.

### Request Format
```json
{
    "username": "string",
    "email": "string", 
    "password": "string"
}
```

### Response Format

**Success (201 Created):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_author": false,
    "created_at": "2026-02-12T10:30:00Z"
}
```

**Error (400 Bad Request):**
```json
{
    "email": ["Email already exists."],
    "password": ["This password is too short."]
}
```

## 2. User Login

**Endpoint:** `POST /api/auth/login/`

**Authentication Required:** No

**Description:** Authenticate user and receive JWT tokens.

### Request Format
```json
{
    "email": "string",
    "password": "string"
}
```

### Response Format

**Success (200 OK):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "is_author": false
    }
}
```

**Error (400 Bad Request):**
```json
{
    "non_field_errors": ["Invalid credentials."]
}
```

## 3. User Logout

**Endpoint:** `POST /api/auth/logout/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Logout user by blacklisting the refresh token.

### Request Format
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Response Format

**Success (200 OK):**
```json
{
    "detail": "Successfully logged out."
}
```

**Error (400 Bad Request):**
```json
{
    "non_field_errors": ["Invalid or expired token."]
}
```

## 4. User Profile

**Endpoint:** `GET /api/auth/profile/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Get current user's profile information.

### Request Format
No request body required.

### Response Format

**Success (200 OK):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_author": false,
    "created_at": "2026-02-12T10:30:00Z"
}
```

## Authentication Headers

For endpoints requiring authentication, include the JWT access token in the Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Field Descriptions

- **id**: Unique user identifier
- **username**: User's chosen username
- **email**: User's email address (must be unique)
- **password**: User's password (write-only field)
- **is_author**: Boolean indicating if user has author privileges
- **created_at**: Timestamp when user account was created
- **access**: JWT access token (expires in 5 minutes by default)
- **refresh**: JWT refresh token (used to obtain new access tokens)

## Error Codes

- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid token but insufficient permissions