# Comments APIs

This document outlines the comment management endpoints available in the blog platform.

Base URL: `/api/posts/`

## 1. List Post Comments

**Endpoint:** `GET /api/posts/{slug}/comments/`

**Authentication Required:** No

**Description:** Retrieve all comments for a specific blog post, ordered by creation date (newest first).

### URL Parameters
- `slug` (string, required): The slug of the post to retrieve comments for

### Request Format
No request body required.

### Request Example
```
GET /api/posts/getting-started-with-django/comments/
```

### Response Format

**Success (200 OK):**
```json
[
    {
        "id": 3,
        "user": "jane_doe",
        "content": "Great article! Very helpful for beginners.",
        "created_at": "2026-02-14T15:30:00Z"
    },
    {
        "id": 1,
        "user": "john_smith",
        "content": "Thanks for sharing this. Looking forward to more Django content.",
        "created_at": "2026-02-14T14:20:00Z"
    }
]
```

## 2. Create Comment

**Endpoint:** `POST /api/posts/{slug}/comments/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Add a new comment to a specific blog post. Only authenticated users can create comments.

### URL Parameters
- `slug` (string, required): The slug of the post to comment on

### Request Format
```json
{
    "content": "string"
}
```

### Request Example
```json
{
    "content": "This is a very informative post. Thank you for sharing!"
}
```

### Response Format

**Success (201 Created):**
```json
{
    "id": 4,
    "user": "current_user",
    "content": "This is a very informative post. Thank you for sharing!",
    "created_at": "2026-02-14T16:45:00Z"
}
```

**Error (400 Bad Request):**
```json
{
    "content": ["This field is required."]
}
```

**Error (404 Not Found):**
```json
{
    "detail": "Not found."
}
```

## 3. Delete Comment

**Endpoint:** `DELETE /api/posts/comments/{id}/`

**Authentication Required:** Yes (Bearer Token - Comment author only)

**Description:** Delete a specific comment. Only the author of the comment can delete it.

### URL Parameters
- `id` (integer, required): The ID of the comment to delete

### Request Format
No request body required.

### Request Example
```
DELETE /api/posts/comments/4/
```

### Response Format

**Success (204 No Content):**
No response body.

**Error (403 Forbidden):**
```json
{
    "detail": "Not allowed"
}
```

**Error (404 Not Found):**
```json
{
    "detail": "Not found."
}
```

## Authentication Headers

For endpoints requiring authentication, include the JWT access token in the Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Field Descriptions

- **id**: Unique comment identifier (auto-generated)
- **user**: Username of the comment author (read-only, automatically set to current user)
- **content**: The comment text content (required)
- **created_at**: Timestamp when the comment was created (read-only)

## Validation Rules

- **content**: Required field, cannot be empty

## Access Control

- **List Comments**: Anyone can view comments on published posts
- **Create Comment**: Only authenticated users can create comments
- **Delete Comment**: Only the comment author can delete their own comments

## Usage Notes

- Comments are associated with specific posts through the post slug
- Comments are automatically ordered by creation date (newest first)
- The `user` field is automatically set to the authenticated user when creating a comment
- Only the comment author can delete their own comments
- Comments cannot be updated through the API (only create and delete operations are supported)

## Relationship with Posts

- Comments belong to a specific post (foreign key relationship)
- Comments are retrieved through the post's slug in the URL
- A post can have multiple comments
- Comments are automatically deleted when the associated post is deleted