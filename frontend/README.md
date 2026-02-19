# Frontend

Next.js App Router frontend for the blog platform.

## Requirements

- Node.js 18+

## Setup

```bash
npm install
cp .env.example .env.local
```

Configure `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Run

```bash
npm run dev
```

Open http://localhost:3000

## Docker

From the repo root:

```bash
docker compose up --build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Structure

```
src/
├── app/         # Routes
├── components/  # UI components
├── hooks/       # Custom hooks
├── lib/         # Clients/utilities
├── services/    # API services
└── types/       # TypeScript types
```
