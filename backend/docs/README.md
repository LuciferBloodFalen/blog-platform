# API Documentation

This directory contains comprehensive documentation for the Blog Platform API.

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `API.md` | **Main API Documentation** - Complete overview, authentication, endpoints |
| `auth.md` | **Authentication APIs** - User registration, login, logout details |
| `posts.md` | **Posts APIs** - Blog post management operations |
| `comments.md` | **Comments APIs** - Post commenting functionality |
| `likes.md` | **Likes APIs** - Like/unlike operations |
| `categories.md` | **Categories APIs** - Post category management |
| `tags.md` | **Tags APIs** - Post tagging system |

## 🚀 Quick Start

### Interactive Documentation (Recommended)

The best way to explore our API is through the **interactive Swagger UI**:

```
http://localhost:8000/api/docs/
```

**Features:**
- 🔍 Real-time API exploration
- 🧪 Test endpoints directly in browser
- 📋 Request/response examples
- 🔐 Built-in authentication testing

### API Schema

Get the OpenAPI 3.0 specification:

```
http://localhost:8000/api/schema/
```

### API Root

Basic API information:

```
http://localhost:8000/api/
```

## 🛠 Setup for Development

1. **Start the backend server:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Access documentation:**
   - Swagger UI: http://localhost:8000/api/docs/
   - API Schema: http://localhost:8000/api/schema/
   - API Root: http://localhost:8000/api/

3. **Test authentication:**
   - Register a test user via Swagger UI
   - Copy the JWT token from response
   - Use "Authorize" button to test protected endpoints

## 📖 Documentation Structure

### For Developers
- Start with `API.md` for overview and authentication
- Use **Swagger UI** for interactive testing
- Refer to specific endpoint docs for detailed examples

### For Frontend Integration
- Use `API.md` for endpoint URLs and data formats
- Check `auth.md` for JWT token handling
- Review error handling patterns

### For QA Testing
- Use **Swagger UI** for manual testing
- Export Postman collection from OpenAPI schema
- Follow test examples in endpoint documentation

## 🔧 Updating Documentation

### Automatic Updates
- **Swagger documentation** is auto-generated from view docstrings and decorators
- **OpenAPI schema** reflects code changes automatically

### Manual Updates
- Update markdown files when adding new features
- Keep examples current with API changes
- Update version information in changelogs

### Documentation Standards
- Use clear, concise descriptions
- Include practical examples
- Follow OpenAPI best practices
- Maintain consistent formatting

## 📊 Documentation Tools

- **drf-spectacular**: OpenAPI 3.0 schema generation
- **Swagger UI**: Interactive API documentation
- **Markdown**: Static documentation files
- **Django REST Framework**: API framework with built-in documentation features

## 🔗 External Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [drf-spectacular Documentation](https://drf-spectacular.readthedocs.io/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

---

*For technical support, please refer to the main project documentation or create an issue in the repository.*