# Tags APIs

This document outlines the tag management endpoints available in the blog platform.

Base URL: `/api/tags/`

## 1. List Tags

**Endpoint:** `GET /api/tags/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Retrieve a list of all tags available in the system.

### Request Format
No request body required.

### Response Format

**Success (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Django",
        "slug": "django"
    },
    {
        "id": 2,
        "name": "Python",
        "slug": "python"
    },
    {
        "id": 3,
        "name": "REST API",
        "slug": "rest-api"
    }
]
```

## 2. Create Tag

**Endpoint:** `POST /api/tags/`

**Authentication Required:** Yes (Bearer Token)

**Description:** Create a new tag. Only authenticated users can create tags.

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
    "name": "React",
    "slug": "react"
}
```

### Response Format

**Success (201 Created):**
```json
{
    "id": 4,
    "name": "React",
    "slug": "react"
}
```

**Error (400 Bad Request):**
```json
{
    "name": ["This field is required."],
    "slug": ["Tag with this slug already exists."]
}
```

## Authentication Headers

For endpoints requiring authentication, include the JWT access token in the Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## Field Descriptions

- **id**: Unique tag identifier (auto-generated)
- **name**: The display name of the tag (max 50 characters, unique)
- **slug**: URL-friendly version of the tag name (unique, used in URLs)

## Validation Rules

- **name**: Required, maximum 50 characters, must be unique
- **slug**: Required, must be unique, URL-friendly format (lowercase letters, numbers, hyphens)

## Usage Notes

- Tags are used to categorize and label blog posts
- Posts can have multiple tags (many-to-many relationship)
- The slug field can be used for filtering posts by tag
- Both name and slug must be unique across all tags
- Tags cannot be updated or deleted through the API (only list and create operations are supported)

## Access Control

- **List Tags**: Requires authentication
- **Create Tag**: Requires authentication
- All authenticated users can perform both operations

## Relationship with Posts

- Tags have a many-to-many relationship with posts
- A single post can have multiple tags
- A single tag can be associated with multiple posts
- Tags are referenced by their ID when creating or updating posts