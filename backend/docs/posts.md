# Posts APIs

This document outlines the posts endpoints available in the blog platform.

Base URL: `/api/posts/`

## 1. List Posts

**Endpoint:** `GET /api/posts/`

**Authentication Required:** No

**Description:** Retrieve a paginated list of all published posts with filtering, searching, and ordering capabilities. Posts are returned in descending order by creation date by default.

### Query Parameters
- `category__slug` (string, optional): Filter by category slug (exact match)
- `search` (string, optional): Search in title and content fields
- `ordering` (string, optional): Order by `created_at` (use `-created_at` for descending, default)
- `page` (integer, optional): Page number for pagination

### Request Examples
```
GET /api/posts/
GET /api/posts/?category__slug=technology
GET /api/posts/?search=django&ordering=-created_at
GET /api/posts/?page=2
```

### Response Format

**Success (200 OK):**
```json
{
    "count": 25,
    "next": "http://localhost:8000/api/posts/?page=2",
    "previous": null,
    "results": [
        {
            "title": "My First Blog Post",
            "slug": "my-first-blog-post",
            "content": "This is the content of my first blog post...",
            "author": "john_doe",
            "category": 1,
            "tags": [1, 2],
            "is_published": true,
            "created_at": "2026-02-12T10:30:00Z",
            "updated_at": "2026-02-12T10:30:00Z",
            "likes_count": 5
        }
    ]
}
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
    "updated_at": "2026-02-13T14:25:00Z",
    "likes_count": 0
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
- **slug**: URL-friendly version of the title (unique, read-only after creation)
- **content**: The main content/body of the post (supports rich text)
- **author**: Username of the post author (read-only, automatically set)
- **category**: ID of the associated category (optional, can be null)
- **tags**: Array of tag IDs associated with the post (optional)
- **is_published**: Boolean indicating if the post is publicly visible
- **created_at**: Timestamp when the post was created (read-only)
- **updated_at**: Timestamp when the post was last modified (read-only)
- **likes_count**: Number of likes this post has received (read-only, only in list view)

## Access Control

- **Public Access**: Anyone can view published posts (is_published=True)
- **Author Access**: Authors can view their unpublished posts and perform all operations on their own posts
- **Authenticated Users**: Can create new posts
- **Anonymous Users**: Can only view published posts

## Filtering and Search Features

The list posts endpoint supports the following features:

- **Search**: Use the `search` parameter to search within post title and content
- **Category Filtering**: Use `category__slug` to filter posts by category slug (exact match)
- **Ordering**: Use `ordering` parameter with `created_at` or `-created_at` (default is `-created_at`)
- **Pagination**: Results are paginated with `count`, `next`, and `previous` fields in the response