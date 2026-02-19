# Blog Platform

A full-stack blog platform with a Next.js frontend and a Django REST API backend.

## Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** Django 6, Django REST Framework, JWT
- **Database:** PostgreSQL

## Requirements

- Node.js 18+
- Python 3.8+
- PostgreSQL 14+

## Quick Start

### 1. Configure environment

**Backend** (`backend/.env`):

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=blog_db
POSTGRES_USER=blog_user
POSTGRES_PASSWORD=blog_password
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Install dependencies

```bash
# Backend
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 3. Run migrations

```bash
cd ../backend
./venv/bin/python manage.py migrate
```

### 4. Run the project

```bash
./run-project.sh
```

## Docker

Build and run the full stack with Docker:

```bash
docker compose up --build
```

### Docker environment

Create `backend/.env` (or copy from `backend/.env.example`) and set these for Docker:

```env
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=blog_db
POSTGRES_USER=blog_user
POSTGRES_PASSWORD=blog_password
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

### 5. Access the app

- Frontend: http://localhost:3000
- Backend API root: http://localhost:8000/
- API docs: http://localhost:8000/api/docs/

## Useful Commands

```bash
# Backend only
cd backend
./venv/bin/python manage.py runserver 0.0.0.0:8000

# Frontend only
cd frontend
npm run dev
```

## Project Layout

```
blog-platform/
├── backend/
├── frontend/
└── run-project.sh
```