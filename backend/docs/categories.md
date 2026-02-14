# Categories APIs

This document outlines the category management endpoints available in the blog platform.

Base URL: `/api/categories/`

## 1. List Categories

**Endpoint:** `GET /api/categories/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Retrieve a list of all categories available in the system.

### Request Format
No request body required.

### Response Format

**Success (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Technology",
        "slug": "technology"
    },
    {
        "id": 2,
        "name": "Programming",
        "slug": "programming"
    },
    {
        "id": 3,
        "name": "Web Development",
        "slug": "web-development"
    }
]
```

## 2. Create Category

**Endpoint:** `POST /api/categories/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Create a new category. Only authenticated users can create categories.

### Request Format
```json
{
    "name": "string",
    "slug": "string"
}
```

### Request Example
```json
{
    "name": "Machine Learning",
    "slug": "machine-learning"
}
```

### Response Format

**Success (201 Created):**
```json
{
    "id": 4,
    "name": "Machine Learning",
    "slug": "machine-learning"
}
```

**Error (400 Bad Request):**
```json
{
    "name": ["This field is required."],
    "slug": ["Category with this slug already exists."]
}
```

## Authentication Headers

For endpoints requiring authentication, include the JWT access token in the Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Field Descriptions

- **id**: Unique category identifier (auto-generated)
- **name**: The display name of the category (max 100 characters, unique)
- **slug**: URL-friendly version of the category name (unique, used in URLs)

## Validation Rules

- **name**: Required, maximum 100 characters, must be unique
- **slug**: Required, must be unique, URL-friendly format (lowercase letters, numbers, hyphens)

## Usage Notes

- Categories are used to organize blog posts
- The slug field is used in post filtering (`/api/posts/?category__slug=technology`)
- Both name and slug must be unique across all categories
- Categories cannot be updated or deleted through the API (only list and create operations are supported)

## Access Control

- **List Categories**: Requires authentication
- **Create Category**: Requires authentication
- All authenticated users can perform both operations