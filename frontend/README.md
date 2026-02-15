# Blog Platform Frontend

A modern Next.js frontend for the blog platform, built with TypeScript, Tailwind CSS, and comprehensive API integration.

## Features

- ⚡ **Next.js 16** with App Router and TypeScript
- 🎨 **Tailwind CSS** for styling
- 🔌 **Axios** for HTTP requests with interceptors
- 🔍 **ESLint + Prettier** for code quality
- 🔐 **Authentication** with JWT tokens
- 🏗️ **Modular API services** for backend integration
- 📱 **Responsive design** ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Running backend API (Django REST framework)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api-example/        # API usage examples
│   └── ...
├── components/             # Reusable UI components
├── config/                 # Configuration files
│   └── api.ts             # API constants and endpoints
├── hooks/                  # Custom React hooks
│   └── useAuth.tsx        # Authentication hook
├── lib/                    # Utility libraries
│   └── api-client.ts      # Axios configuration
├── services/               # API service classes
│   ├── auth.service.ts    # Authentication API
│   ├── posts.service.ts   # Posts API
│   ├── categories.service.ts # Categories API
│   ├── tags.service.ts    # Tags API
│   └── index.ts           # Service exports
├── types/                  # TypeScript type definitions
│   └── api.ts             # API response types
└── ...
```

## API Integration

### Services Architecture

The frontend uses a service-based architecture for API communication:

- **AuthService**: User authentication and profile management
- **PostsService**: Blog posts CRUD operations
- **CategoriesService**: Categories management
- **TagsService**: Tags management

### Usage Examples

#### Authentication

```typescript
import { AuthService } from '@/services';

// Login
const response = await AuthService.login({
  username: 'user@example.com',
  password: 'password123',
});

// Register
const response = await AuthService.register({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password123',
});
```

#### Fetching Posts

```typescript
import { PostsService } from '@/services';

// Get all posts with pagination
const posts = await PostsService.getAllPosts({
  page: 1,
  page_size: 10,
  search: 'keyword',
});

// Get single post by ID
const post = await PostsService.getPostById(123);
```

#### Using the Auth Hook

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}!</p>
      ) : (
        <button onClick={() => login(credentials)}>Login</button>
      )}
    </div>
  );
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Environment Variables

| Variable              | Description          | Default                     |
| --------------------- | -------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL     | `http://localhost:3000`     |
| `NODE_ENV`            | Environment mode     | `development`               |

## API Endpoints

The frontend communicates with these backend endpoints:

- `POST /auth/login/` - User login
- `POST /auth/register/` - User registration
- `GET /posts/` - List posts
- `GET /posts/{id}/` - Get post details
- `POST /posts/` - Create post
- `GET /categories/` - List categories
- `GET /tags/` - List tags

## Development

### Code Style

This project uses ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Type Safety

All API responses are typed with TypeScript interfaces. See `src/types/api.ts` for available types.

### Error Handling

The API client includes automatic error handling:

- Token refresh on 401 errors
- Request/response interceptors
- Centralized error logging

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Setup

For production deployment, update your environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
NODE_ENV=production
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [TypeScript](https://www.typescriptlang.org/docs/)
