# Blog Platform API Documentation

A RESTful API for a full-featured blogging platform with user authentication, posts, comments, likes, categories, and tags.

## 🚀 Quick Links

- **Interactive API Docs (Swagger UI):** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **OpenAPI Schema:** [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)
- **API Root:** [http://localhost:8000/api/](http://localhost:8000/api/)

---

## Table of Contents

- [Overview](#overview)
- [Interactive Documentation](#interactive-documentation)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Posts](#posts)
  - [Comments](#comments)
  - [Likes](#likes)
  - [Categories](#categories)
  - [Tags](#tags)
- [Query Parameters](#query-parameters)
- [Pagination](#pagination)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Changelog](#changelog)

---

## Overview

| Property       | Value                          |
|----------------|--------------------------------|
| Base URL       | `http://localhost:8000/api`    |
| Content-Type   | `application/json`             |
| Authentication | JWT Bearer Token               |
| API Version    | `1.0.0`                        |
| OpenAPI Spec   | `3.0.2`                        |

---

## Interactive Documentation

### Swagger UI (Recommended)

For the best API exploration experience, use our **interactive Swagger UI**:

```
GET http://localhost:8000/api/docs/
```

**Features:**
- 🔍 Explore all endpoints with real-time documentation
- 🧪 Test API endpoints directly in your browser
- 📝 View request/response schemas and examples
- 🔐 Authenticate and test protected endpoints
- 📚 Download OpenAPI specification

### OpenAPI Schema

Get the machine-readable API specification:

```
GET http://localhost:8000/api/schema/
```

**Formats:** JSON (default), YAML

---

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### Authorization Header

```
Authorization: Bearer <access_token>
```

### Token Lifecycle

| Token   | Purpose                        | Expiration |
|---------|--------------------------------|------------|
| Access  | Authenticate API requests      | Short-lived |
| Refresh | Obtain new access tokens       | Long-lived  |

---

## Endpoints

### Auth

#### Register

Creates a new user account.

```
POST /auth/register/
```

**Authentication:** None

**Request Body:**

| Field    | Type   | Required | Description            |
|----------|--------|----------|------------------------|
| username | string | Yes      | Unique username        |
| email    | string | Yes      | Valid email address    |
| password | string | Yes      | Must pass validation   |

**Example Request:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Example Response:** `201 Created`

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "is_author": false,
  "created_at": "2026-02-14T10:00:00Z"
}
```

---

#### Login

Authenticates a user and returns JWT tokens.

```
POST /auth/login/
```

**Authentication:** None

**Request Body:**

| Field    | Type   | Required | Description         |
|----------|--------|----------|---------------------|
| email    | string | Yes      | User's email        |
| password | string | Yes      | User's password     |

**Example Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Example Response:** `200 OK`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "is_author": false
  }
}
```

---

#### Logout

Blacklists the refresh token to invalidate the session.

```
POST /auth/logout/
```

**Authentication:** Required

**Request Body:**

| Field   | Type   | Required | Description          |
|---------|--------|----------|----------------------|
| refresh | string | Yes      | Valid refresh token  |

**Example Request:**

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response:** `200 OK`

```json
{
  "detail": "Successfully logged out."
}
```

---

#### Refresh Token

Obtains a new access token using a valid refresh token.

```
POST /auth/refresh/
```

**Authentication:** None

**Request Body:**

| Field   | Type   | Required | Description          |
|---------|--------|----------|----------------------|
| refresh | string | Yes      | Valid refresh token  |

**Example Request:**

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response:** `200 OK`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Get Profile

Returns the authenticated user's profile information.

```
GET /auth/profile/
```

**Authentication:** Required

**Example Response:** `200 OK`

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "is_author": false,
  "created_at": "2026-02-14T10:00:00Z"
}
```

---

### Posts

#### List Posts

Returns a paginated list of published posts.

```
GET /posts/
```

**Authentication:** None

**Query Parameters:** See [Query Parameters](#query-parameters)

**Example Response:** `200 OK`

```json
{
  "count": 25,
  "next": "http://localhost:8000/api/posts/?page=2",
  "previous": null,
  "results": [
    {
      "title": "Getting Started with Django",
      "slug": "getting-started-with-django",
      "content": "Django is a high-level Python web framework...",
      "author": "johndoe",
      "category": 1,
      "tags": [1, 2],
      "is_published": true,
      "created_at": "2026-02-14T10:00:00Z",
      "updated_at": "2026-02-14T10:00:00Z",
      "likes_count": 42
    }
  ]
}
```

---

#### Create Post

Creates a new blog post.

```
POST /posts/
```

**Authentication:** Required

**Request Body:**

| Field        | Type    | Required | Description                    |
|--------------|---------|----------|--------------------------------|
| title        | string  | Yes      | Post title (max 255 chars)     |
| slug         | string  | Yes      | URL-friendly identifier        |
| content      | string  | Yes      | Post body content              |
| category     | integer | No       | Category ID                    |
| tags         | array   | No       | Array of tag IDs               |
| is_published | boolean | No       | Publish status (default: false)|

**Example Request:**

```json
{
  "title": "Getting Started with Django",
  "slug": "getting-started-with-django",
  "content": "Django is a high-level Python web framework...",
  "category": 1,
  "tags": [1, 2],
  "is_published": true
}
```

**Example Response:** `201 Created`

```json
{
  "title": "Getting Started with Django",
  "slug": "getting-started-with-django",
  "content": "Django is a high-level Python web framework...",
  "author": "johndoe",
  "category": 1,
  "tags": [1, 2],
  "is_published": true,
  "created_at": "2026-02-14T10:00:00Z",
  "updated_at": "2026-02-14T10:00:00Z",
  "likes_count": 0
}
```

---

#### Get Post

Retrieves a single post by slug.

```
GET /posts/{slug}/
```

**Authentication:** None (public posts) / Required (own drafts)

**Path Parameters:**

| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| slug      | string | Unique post identifier   |

**Access Control:**

| User Type       | Access                          |
|-----------------|--------------------------------|
| Unauthenticated | Published posts only           |
| Author          | Own published posts and drafts |
| Other users     | Published posts only           |

**Example Response:** `200 OK`

```json
{
  "title": "Getting Started with Django",
  "slug": "getting-started-with-django",
  "content": "Django is a high-level Python web framework...",
  "author": "johndoe",
  "category": 1,
  "tags": [1, 2],
  "is_published": true,
  "created_at": "2026-02-14T10:00:00Z",
  "updated_at": "2026-02-14T10:00:00Z"
}
```

---

#### Update Post

Updates an existing post. Only the author can update their posts.

```
PUT /posts/{slug}/
PATCH /posts/{slug}/
```

**Authentication:** Required (Author only)

**Request Body:**

| Field        | Type    | Required | Description                |
|--------------|---------|----------|----------------------------|
| title        | string  | No       | Post title                 |
| content      | string  | No       | Post body content          |
| category     | integer | No       | Category ID                |
| tags         | array   | No       | Array of tag IDs           |
| is_published | boolean | No       | Publish status             |

> **Note:** The `slug` field is immutable and cannot be updated.

**Example Response:** `200 OK`

---

#### Delete Post

Permanently deletes a post. Only the author can delete their posts.

```
DELETE /posts/{slug}/
```

**Authentication:** Required (Author only)

**Example Response:** `204 No Content`

---

### Comments

#### List Comments

Returns all comments for a specific post.

```
GET /posts/{slug}/comments/
```

**Authentication:** None

**Example Response:** `200 OK`

```json
[
  {
    "id": 1,
    "user": "johndoe",
    "content": "Great article! Very helpful.",
    "created_at": "2026-02-14T11:30:00Z"
  }
]
```

---

#### Create Comment

Adds a comment to a post.

```
POST /posts/{slug}/comments/
```

**Authentication:** Required

**Request Body:**

| Field   | Type   | Required | Description       |
|---------|--------|----------|-------------------|
| content | string | Yes      | Comment text      |

**Example Request:**

```json
{
  "content": "Great article! Very helpful."
}
```

**Example Response:** `201 Created`

```json
{
  "id": 1,
  "user": "johndoe",
  "content": "Great article! Very helpful.",
  "created_at": "2026-02-14T11:30:00Z"
}
```

---

#### Delete Comment

Deletes a comment. Only the comment author can delete it.

```
DELETE /posts/comments/{id}/
```

**Authentication:** Required (Comment author only)

**Path Parameters:**

| Parameter | Type    | Description         |
|-----------|---------|---------------------|
| id        | integer | Comment ID          |

**Example Response:** `204 No Content`

---

### Likes

#### Like Post

Adds a like to a post. Duplicate likes are ignored.

```
POST /posts/{slug}/like/
```

**Authentication:** Required

**Example Response:** `200 OK`

```json
{
  "message": "Post liked"
}
```

---

#### Unlike Post

Removes a like from a post.

```
POST /posts/{slug}/unlike/
```

**Authentication:** Required

**Example Response:** `200 OK`

```json
{
  "message": "Post unliked"
}
```

---

### Categories

#### List Categories

Returns all categories.

```
GET /categories/
```

**Authentication:** Required

**Example Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Technology",
    "slug": "technology"
  },
  {
    "id": 2,
    "name": "Lifestyle",
    "slug": "lifestyle"
  }
]
```

---

#### Create Category

Creates a new category.

```
POST /categories/
```

**Authentication:** Required

**Request Body:**

| Field | Type   | Required | Description             |
|-------|--------|----------|-------------------------|
| name  | string | Yes      | Category name (unique)  |
| slug  | string | Yes      | URL slug (unique)       |

**Example Request:**

```json
{
  "name": "Technology",
  "slug": "technology"
}
```

**Example Response:** `201 Created`

```json
{
  "id": 1,
  "name": "Technology",
  "slug": "technology"
}
```

---

### Tags

#### List Tags

Returns all tags.

```
GET /tags/
```

**Authentication:** Required

**Example Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Python",
    "slug": "python"
  },
  {
    "id": 2,
    "name": "Django",
    "slug": "django"
  }
]
```

---

#### Create Tag

Creates a new tag.

```
POST /tags/
```

**Authentication:** Required

**Request Body:**

| Field | Type   | Required | Description        |
|-------|--------|----------|--------------------|
| name  | string | Yes      | Tag name (unique)  |
| slug  | string | Yes      | URL slug (unique)  |

**Example Request:**

```json
{
  "name": "Python",
  "slug": "python"
}
```

**Example Response:** `201 Created`

```json
{
  "id": 1,
  "name": "Python",
  "slug": "python"
}
```

---

## Query Parameters

The Posts endpoint supports filtering, searching, and ordering.

### Filtering

| Parameter       | Type   | Description                    |
|-----------------|--------|--------------------------------|
| category__slug  | string | Filter by category slug        |

**Example:**
```
GET /posts/?category__slug=technology
```

### Search

| Parameter | Type   | Description                         |
|-----------|--------|-------------------------------------|
| search    | string | Search in title and content fields  |

**Example:**
```
GET /posts/?search=django
```

### Ordering

| Parameter | Type   | Description                              |
|-----------|--------|------------------------------------------|
| ordering  | string | Sort by field (prefix with `-` for desc) |

**Supported Fields:** `created_at`

**Example:**
```
GET /posts/?ordering=-created_at
GET /posts/?ordering=created_at
```

---

## Pagination

List endpoints return paginated responses.

### Response Format

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/posts/?page=2",
  "previous": null,
  "results": []
}
```

### Parameters

| Parameter  | Type    | Default | Description              |
|------------|---------|---------|--------------------------|
| page       | integer | 1       | Page number              |
| page_size  | integer | 10      | Results per page         |

**Example:**
```
GET /posts/?page=2&page_size=20
```

---

## Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format.

### Status Codes

| Code | Status              | Description                              |
|------|---------------------|------------------------------------------|
| 200  | OK                  | Request succeeded                        |
| 201  | Created             | Resource created successfully            |
| 204  | No Content          | Request succeeded (no response body)     |
| 400  | Bad Request         | Invalid request data                     |
| 401  | Unauthorized        | Authentication required                  |
| 403  | Forbidden           | Insufficient permissions                 |
| 404  | Not Found           | Resource not found                       |
| 500  | Internal Server Error | Server-side error                      |

### Error Response Format

**Validation Error (400):**

```json
{
  "title": ["This field is required."],
  "email": ["Enter a valid email address."]
}
```

**Authentication Error (401):**

```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Permission Error (403):**

```json
{
  "detail": "You do not have permission to perform this action."
}
```

**Not Found Error (404):**

```json
{
  "detail": "Not found."
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production deployments.

**Recommended Production Limits:**
- Authentication endpoints: 5 requests/minute
- Read operations: 100 requests/minute  
- Write operations: 20 requests/minute

---

## Best Practices

### Security
- Always use HTTPS in production
- Store JWT tokens securely (httpOnly cookies recommended)
- Implement proper error handling to avoid information leakage
- Validate and sanitize all input data

### Performance
- Use pagination for large datasets
- Implement caching where appropriate
- Use filter and search parameters efficiently
- Consider implementing GraphQL for complex queries

### API Usage
- Include proper error handling in your client applications
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Follow RESTful conventions
- Handle token expiration gracefully

---

## Testing the API

### Using Swagger UI
1. Navigate to [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
2. Click \"Authorize\" and enter your JWT token
3. Explore and test endpoints interactively

### Using curl

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"username\": \"testuser\",
    \"email\": \"test@example.com\",
    \"password\": \"TestPass123!\"
  }'
```

**Get posts with authentication:**
```bash
curl -X GET http://localhost:8000/api/posts/ \\
  -H \"Authorization: Bearer YOUR_ACCESS_TOKEN\"
```

### Postman Collection
Import our Postman collection for easy testing:
- Download OpenAPI spec: [http://localhost:8000/api/schema/](http://localhost:8000/api/schema/)
- Import into Postman as OpenAPI 3.0 specification

---

## Additional Resources

- **Django REST Framework:** [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
- **JWT Authentication:** [https://django-rest-framework-simplejwt.readthedocs.io/](https://django-rest-framework-simplejwt.readthedocs.io/)
- **OpenAPI Specification:** [https://swagger.io/specification/](https://swagger.io/specification/)
- **drf-spectacular:** [https://drf-spectacular.readthedocs.io/](https://drf-spectacular.readthedocs.io/)

---

## Support

For issues and questions:
- **GitHub Issues:** Create an issue in the project repository
- **Documentation:** Check the `/docs` directory for detailed endpoint documentation
- **Swagger UI:** Use interactive documentation for real-time testing

---

## Changelog

| Version | Date       | Description                                    |
|---------|------------|------------------------------------------------|
| 1.0.0   | 2026-02-19 | Initial release with full API documentation   |
|         |            | - Interactive Swagger UI documentation        |
|         |            | - Complete authentication system              |
|         |            | - Blog posts CRUD operations                  |
|         |            | - Comments and likes functionality            |
|         |            | - Categories and tags management              |

---

*This documentation is automatically generated and maintained. Last updated: February 19, 2026*
