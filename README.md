# Blog Platform

A modern full-stack blog platform built with **Next.js** (frontend) and **Django REST Framework** (backend).

## Features

- 🔐 **JWT Authentication** with automatic token refresh
- ⚡ **Next.js 16** with TypeScript and App Router
- 🎨 **Tailwind CSS** for modern UI styling
- 🐍 **Django REST Framework** for robust backend API
- 📱 **Responsive Design** for all screen sizes
- 🔒 **Protected Routes** and role-based access
- 🧪 **Built-in Testing Interface** for authentication flow

## Quick Start

### 1. Setup (First Time)
```bash
# Clone and setup the project
./scripts/setup.sh
```
This will:
- Install Python and Node.js dependencies
- Create virtual environments
- Set up environment files
- Run initial database migrations

### 2. Run the Project
```bash
# Start both frontend and backend servers
./scripts/run-project.sh
```

Or run servers individually:
```bash
# Backend only (Django API server)
./scripts/run-backend.sh

# Frontend only (Next.js dev server)  
./scripts/run-frontend.sh
```

### 3. Access the Application

**Frontend (Next.js):**
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Dashboard: http://localhost:3000/dashboard
- Auth Test: http://localhost:3000/auth-test

**Backend (Django API):**
- API Root: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/
- API Documentation: http://localhost:8000/api/docs/

## NPM Scripts

You can also use npm scripts from the root directory:

```bash
npm run setup        # Run initial setup
npm run dev          # Start both servers
npm run dev:backend  # Start backend only
npm run dev:frontend # Start frontend only
npm run build        # Build frontend for production
npm run lint         # Lint frontend code
npm run format       # Format code with Prettier
```

## Project Structure

```
blog-platform/
├── backend/          # Django REST API
│   ├── apps/        # Django applications
│   ├── config/      # Django settings
│   ├── manage.py    # Django management
│   └── requirements.txt
├── frontend/         # Next.js application  
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── package.json
├── setup.sh         # Initial setup script
├── run-project.sh   # Run both servers
├── run-backend.sh   # Run backend only
├── run-frontend.sh  # Run frontend only
└── package.json     # Root npm scripts
```

## Development

### Prerequisites
- **Node.js 18+**
- **Python 3.8+**
- **pip** (Python package manager)

### Environment Configuration

**Backend** (`backend/.env`):
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Testing Authentication

Visit http://localhost:3000/auth-test for a comprehensive testing interface that lets you:
- Test login/register functionality
- Verify token refresh mechanism
- Check protected route access
- Monitor authentication state

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors

### Backend  
- **Django** - Python web framework
- **Django REST Framework** - API functionality
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL/SQLite** - Database support

## Scripts Overview

| Script | Purpose |
|--------|---------|
| `./scripts/setup.sh` | Install dependencies and setup environment |
| `./scripts/run-project.sh` | Start both frontend and backend concurrently |
| `./scripts/run-backend.sh` | Start Django development server only |
| `./scripts/run-frontend.sh` | Start Next.js development server only |

## Getting Help

If you encounter issues:

1. **Check logs**: `tail -f backend.log frontend.log`
2. **Verify setup**: Re-run `./scripts/setup.sh`
3. **Check ports**: Ensure 3000 and 8000 are available
4. **Environment**: Verify `.env` files exist and are configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run lint` and `npm run build`
5. Submit a pull request