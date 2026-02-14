# Likes APIs

This document outlines the post like/unlike endpoints available in the blog platform.

Base URL: `/api/posts/`

## 1. Like Post

**Endpoint:** `POST /api/posts/{slug}/like/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Like a specific blog post. If the user has already liked the post, this endpoint will not create a duplicate like (idempotent operation).

### URL Parameters
- `slug` (string, required): The slug of the post to like

### Request Format
No request body required.

### Request Example
```
POST /api/posts/getting-started-with-django/like/
```

### Response Format

**Success (200 OK):**
```json
{
    "message": "Post liked"
}
```

**Error (404 Not Found):**
```json
{
    "detail": "Not found."
}
```

## 2. Unlike Post

**Endpoint:** `POST /api/posts/{slug}/unlike/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Remove a like from a specific blog post. If the user hasn't liked the post, this operation will complete successfully without error (idempotent operation).

### URL Parameters
- `slug` (string, required): The slug of the post to unlike

### Request Format
No request body required.

### Request Example
```
POST /api/posts/getting-started-with-django/unlike/
```

### Response Format

**Success (200 OK):**
```json
{
    "message": "Post unliked"
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

## Like System Details

### Database Constraints
- Each user can only like a post once (unique constraint on user + post combination)
- Likes are automatically deleted if the associated post or user is deleted

### Like Count
- The total number of likes for a post is available through the `likes_count` field in the post list API
- Like counts are calculated dynamically and included in post serialization

## Access Control

- **Like Post**: Only authenticated users can like posts
- **Unlike Post**: Only authenticated users can unlike posts
- Users can only manage their own likes

## Usage Notes

- Both like and unlike operations are idempotent:
  - Liking an already-liked post will not create duplicate likes
  - Unliking a post that isn't liked will not cause errors
- The system uses a separate Like model to track likes, ensuring data integrity
- Like counts are included in post listings for display purposes

## Relationship with Posts

- Likes have a many-to-one relationship with posts (a post can have many likes)
- Likes have a many-to-one relationship with users (a user can like many posts)
- The combination of user + post is unique (one like per user per post)
- Likes are automatically cleaned up when posts or users are deleted

## Integration with Other APIs

- Post listing (`GET /api/posts/`) includes `likes_count` field
- Like status is not directly exposed in the API but can be inferred by attempting to like/unlike
- Consider implementing a separate endpoint to check if the current user has liked a specific post if needed