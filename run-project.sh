#!/usr/bin/env bash

set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PYTHON="$BACKEND_DIR/venv/bin/python"

if [ ! -d "$BACKEND_DIR" ] || [ ! -f "$BACKEND_DIR/manage.py" ]; then
  echo "Backend not found at $BACKEND_DIR"
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ] || [ ! -f "$FRONTEND_DIR/package.json" ]; then
  echo "Frontend not found at $FRONTEND_DIR"
  exit 1
fi

if [ ! -x "$BACKEND_PYTHON" ]; then
  echo "Backend virtualenv Python not found at $BACKEND_PYTHON"
  echo "Create it first, e.g. in backend/: python3 -m venv venv && pip install -r requirements.txt"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed or not in PATH"
  exit 1
fi

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo
  echo "Stopping services..."

  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" >/dev/null 2>&1; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi

  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" >/dev/null 2>&1; then
    kill "$FRONTEND_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup INT TERM EXIT

echo "Starting backend on http://127.0.0.1:8000 ..."
(
  cd "$BACKEND_DIR" || exit 1
  exec "$BACKEND_PYTHON" manage.py runserver 0.0.0.0:8000
) &
BACKEND_PID=$!

echo "Starting frontend on http://127.0.0.1:3000 ..."
(
  cd "$FRONTEND_DIR" || exit 1
  exec npm run dev
) &
FRONTEND_PID=$!

echo ""
echo "Project is starting:"
echo "- Frontend: http://127.0.0.1:3000"
echo "- Backend:  http://127.0.0.1:8000"
echo ""
echo "Press Ctrl+C to stop both services."
echo ""

while true; do
  if ! kill -0 "$BACKEND_PID" >/dev/null 2>&1; then
    echo "Backend process exited."
    exit 1
  fi

  if ! kill -0 "$FRONTEND_PID" >/dev/null 2>&1; then
    echo "Frontend process exited."
    exit 1
  fi

  sleep 1
done
