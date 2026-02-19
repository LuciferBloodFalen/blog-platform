# Backend

Django REST API for the blog platform.

## Requirements

- Python 3.8+
- PostgreSQL 14+

## Setup

```bash
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
cp .env.example .env
```

Configure `backend/.env`:

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

## Database

```bash
./venv/bin/python manage.py migrate
```

## Run

```bash
./venv/bin/python manage.py runserver 0.0.0.0:8000
```

## Docker

From the repo root:

```bash
docker compose up --build
```

## Endpoints

- API root: http://localhost:8000/
- Docs: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/
