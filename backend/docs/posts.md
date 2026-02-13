# Posts APIs

This document outlines the posts endpoints available in the blog platform.

Base URL: `/api/posts/`

## 1. List Posts

**Endpoint:** `GET /api/posts/`

**Authentication Required:** No

**Description:** Retrieve a list of all published posts. Posts are returned in descending order by creation date.

### Request Format
No request body required.

### Response Format

**Success (200 OK):**
```json
[
    {
        "title": "My First Blog Post",
        "slug": "my-first-blog-post",
        "content": "This is the content of my first blog post...",
        "author": "john_doe",
        "category": 1,
        "tags": [1, 2],
        "is_published": true,
        "created_at": "2026-02-12T10:30:00Z",
        "updated_at": "2026-02-12T10:30:00Z"
    }
]
```

## 2. Create Post

**Endpoint:** `POST /api/posts/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Create a new blog post. The authenticated user becomes the author of the post.

### Request Format
```json
{
    "title": "string",
    "slug": "string",
    "content": "string",
    "category": 1,
    "tags": [1, 2],
    "is_published": false
}
```

### Response Format

**Success (201 Created):**
```json
{
    "title": "My New Blog Post",
    "slug": "my-new-blog-post",
    "content": "This is the content of my new blog post...",
    "author": "john_doe",
    "category": 1,
    "tags": [1, 2],
    "is_published": false,
    "created_at": "2026-02-13T14:25:00Z",
    "updated_at": "2026-02-13T14:25:00Z"
}
```

## 3. Retrieve Post

**Endpoint:** `GET /api/posts/{slug}/`

**Authentication Required:** No (for published posts)

**Description:** Retrieve a specific post by its slug. Unpublished posts can only be viewed by their authors.

### Request Format
No request body required.

### Response Format

**Success (200 OK):**
```json
{
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "content": "This is the content of my first blog post...",
    "author": "john_doe",
    "category": 1,
    "tags": [1, 2],
    "is_published": true,
    "created_at": "2026-02-12T10:30:00Z",
    "updated_at": "2026-02-12T10:30:00Z"
}
```

## 4. Update Post

**Endpoint:** `PUT /api/posts/{slug}/`

**Authentication Required:** Yes (Bearer Token) - Must be the post author

**Description:** Update all fields of an existing post. Only the post author can update their posts.

### Request Format
```json
{
    "title": "string",
    "content": "string",
    "category": 1,
    "tags": [1, 2],
    "is_published": true
}
```

### Response Format

**Success (200 OK):**
```json
{
    "title": "Updated Blog Post Title",
    "slug": "my-first-blog-post",
    "content": "This is the updated content...",
    "author": "john_doe",
    "category": 2,
    "tags": [1, 3],
    "is_published": true,
    "created_at": "2026-02-12T10:30:00Z",
    "updated_at": "2026-02-13T15:45:00Z"
}
```

## 5. Partial Update Post

**Endpoint:** `PATCH /api/posts/{slug}/`

**Authentication Required:** Yes (Bearer Token) - Must be the post author

**Description:** Partially update specific fields of an existing post. Only the post author can update their posts.

### Request Format
```json
{
    "title": "New Title Only",
    "is_published": true
}
```

### Response Format

**Success (200 OK):**
```json
{
    "title": "New Title Only",
    "slug": "my-first-blog-post",
    "content": "Original content remains...",
    "author": "john_doe",
    "category": 1,
    "tags": [1, 2],
    "is_published": true,
    "created_at": "2026-02-12T10:30:00Z",
    "updated_at": "2026-02-13T16:10:00Z"
}
```

## 6. Delete Post

**Endpoint:** `DELETE /api/posts/{slug}/`

**Authentication Required:** Yes (Bearer Token) - Must be the post author

**Description:** Delete an existing post. Only the post author can delete their posts.

### Request Format
No request body required.

### Response Format

**Success (204 No Content):**
No response body.

## Authentication Headers

For endpoints requiring authentication, include the JWT access token in the Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Field Descriptions

- **title**: The post title (max 255 characters)
- **slug**: URL-friendly version of the title (unique, auto-generated or manual)
- **content**: The main content/body of the post (supports rich text)
- **author**: Username of the post author (read-only, automatically set)
- **category**: ID of the associated category (optional, can be null)
- **tags**: Array of tag IDs associated with the post (optional)
- **is_published**: Boolean indicating if the post is publicly visible
- **created_at**: Timestamp when the post was created (read-only)
- **updated_at**: Timestamp when the post was last modified (read-only)

## Access Control

- **Public Access**: Anyone can view published posts (is_published=True)
- **Author Access**: Authors can view their unpublished posts and perform all operations on their own posts
- **Authenticated Users**: Can create new posts
- **Anonymous Users**: Can only view published posts

## Query Parameters

The list posts endpoint supports optional query parameters:

- **Search**: Filter posts by title or content (implementation dependent)
- **Category**: Filter posts by category ID
- **Tags**: Filter posts by tag IDs
- **Author**: Filter posts by author username

*Note: Specific query parameter implementation may vary based on backend filtering configuration.*