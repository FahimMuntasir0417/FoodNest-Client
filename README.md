# FoodNest Client

FoodNest Client is a modern food ordering web application frontend built with Next.js, TypeScript, Tailwind CSS, and reusable UI components. It allows users to browse meals, view food providers, place orders, manage profiles, and interact with a clean responsive interface.

## Links

- Live demo: add your deployed frontend URL
- Backend/API: `https://foodnest-server.onrender.com`

## Features

- Meal browsing and meal detail pages
- Provider listing and provider dashboard flows
- Customer cart and order management
- Admin dashboards for users, meals, categories, and orders
- Better Auth based authentication
- Role-aware dashboard access for customer, provider, and admin users
- Reusable shadcn/Radix UI components
- Centralized API client and environment configuration

## Tech Stack

- Next.js 16
- React 18
- TypeScript
- Tailwind CSS 4
- Radix UI and shadcn-style components
- Better Auth
- Zod
- React Hook Form
- Vitest and React Testing Library
- Playwright

## Folder Structure

```txt
src/
  app/                Route files and layouts
  components/
    ui/               Reusable UI primitives
    shared/           App-level reusable states and helpers
  config/             Environment and site configuration
  features/           Feature-based components, services, schemas, and types
  lib/                API, auth, and utility helpers
  services/           Compatibility exports while services migrate to features
  types/              Shared TypeScript types
```

## Environment Variables

Copy `.env.example` to `.env` and update values as needed.

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_AUTH_URL=

BACKEND_URL=
API_URL=
AUTH_URL=
FRONTEND_URL=
```

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Build

```bash
pnpm build
```

## Quality Checks

```bash
pnpm type-check
pnpm lint
pnpm format:check
pnpm test -- --run
```

## End-to-End Tests

```bash
pnpm test:e2e
```

## Deployment

The app is ready for Vercel deployment. Configure the same environment variables in the Vercel project settings, then deploy from the `main` branch.

## Screenshots

Add screenshots to the `screenshots/` directory.

## Future Improvements

- Complete migration of all services into `src/features`
- Add Playwright coverage for login and ordering flows
- Add stronger typed API response contracts
- Add image upload support for providers and meals
- Add analytics and performance monitoring

## GitHub Topics

`nextjs` `typescript` `tailwindcss` `food-ordering` `react` `frontend` `restaurant-app` `vercel`

## Author

Add your name, portfolio, and contact links.
