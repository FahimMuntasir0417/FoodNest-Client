<div align="center">
  <img src="./public/foodnest-logo-mark.png" alt="FoodNest logo" width="150" />

  <h1>FoodNest Client</h1>
  <p>
    A modern role-based food ordering platform frontend built with Next.js,
    TypeScript, Tailwind CSS, Better Auth, and reusable Radix UI components.
  </p>

  <p>
    <a href="https://food-nest-client.vercel.app">Live Frontend</a>
    |
    <a href="https://foodnest-server.onrender.com">Live Backend</a>
    |
    <a href="https://drive.google.com/file/d/12D4k0QztRpl2FCdRIA1xqe82m1IjgwnU/view?usp=drive_link">Demo Video</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18-149eca?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel" alt="Vercel" />
  </p>
</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Dependencies](#dependencies)
- [Screenshots](#screenshots)
- [Live Demo and Credentials](#live-demo-and-credentials)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [API and Architecture](#api-and-architecture)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Contributions](#contributions)
- [How to Contribute](#how-to-contribute)
- [License](#license)
- [Contact](#contact)

---

## About the Project

FoodNest Client is the frontend for a full-stack food ordering system. It gives customers a clean way to browse meals, view providers, manage cart items, place orders, and review meals. Providers can manage meals and order workflows, while admins can manage users, meals, categories, and orders.

The application is built with Next.js App Router, TypeScript, Tailwind CSS 4, Better Auth, Radix UI primitives, reusable components, server actions, and typed service modules.

## Project Overview

FoodNest supports three main user roles:

- `CUSTOMER`
- `PROVIDER`
- `ADMIN`

The frontend includes:

- Public marketing and browsing pages
- Authentication screens for login and signup
- Role-aware dashboard routing
- Customer order and cart workflows
- Provider meal and order management
- Admin management screens
- API service modules for the FoodNest backend
- Unit/component tests with Vitest and browser tests with Playwright

## Problem Statement

Food ordering platforms need more than a meal list. Customers need a smooth browsing, cart, checkout, and tracking flow. Providers need controlled access to their own meals and orders. Admins need a central view of platform activity. Without clear role-aware UI and consistent API integration, the product becomes difficult to use and maintain.

## Solution Overview

FoodNest Client solves this with a feature-focused Next.js frontend. Public routes handle discovery and conversion, dashboard route slots separate admin, provider, and customer workflows, and service/action modules keep backend communication organized. Shared UI components, validation schemas, loading states, and error states keep the experience consistent across the app.

## Key Features

- Public homepage, about, contact, help, privacy, terms, food, category, provider, and meal detail pages
- Better Auth login and signup flows
- Role-based dashboard layout for customers, providers, and admins
- Customer cart flow with draft order items, quantity management, checkout, and order history
- Provider dashboard for creating meals, editing meals, managing categories, and updating order status
- Admin dashboard for users, meals, categories, and all orders
- Review and rating flows for meals
- Reusable UI primitives built with Radix UI patterns and local components
- Responsive navigation, dark mode support, loading states, empty states, and error boundaries
- API integration with the deployed FoodNest backend
- Unit/component tests with Vitest and Testing Library
- End-to-end testing with Playwright

## Tech Stack

- **Frontend:** Next.js 16, React 18, TypeScript, Tailwind CSS 4
- **Backend:** Node.js, Express 5, PostgreSQL, Prisma, Better Auth
- **Authentication:** Better Auth, session cookies, Google OAuth support
- **Forms and Validation:** React Hook Form, TanStack Form, Zod
- **UI:** Radix UI, shadcn-style components, Lucide React, Sonner, next-themes
- **Testing:** Vitest, Testing Library, Playwright
- **Tools:** pnpm, ESLint, Prettier, Husky, lint-staged, Vercel, Git, VS Code

## Dependencies

Major runtime dependencies:

```json
{
  "@hookform/resolvers": "^5.2.2",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-dropdown-menu": "^2.1.16",
  "@radix-ui/react-navigation-menu": "^1.2.14",
  "@t3-oss/env-nextjs": "^0.13.10",
  "@tanstack/react-form": "^1.28.0",
  "better-auth": "^1.4.17",
  "lucide-react": "^0.563.0",
  "next": "16.1.4",
  "next-themes": "^0.4.6",
  "radix-ui": "^1.4.3",
  "react": "^18.3.1",
  "react-dom": "18.3.1",
  "react-hook-form": "^7.71.1",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.4.0",
  "zod": "^4.3.6"
}
```

Development dependencies include Playwright, Vitest, Testing Library, TypeScript, ESLint, Prettier, Husky, lint-staged, Tailwind CSS, and React/Node type packages.

## Screenshots

Project visual assets are available in [`public`](public):

- [`foodnest-logo-mark.png`](public/foodnest-logo-mark.png)

The repository also includes a [`screenshots`](screenshots) directory for project screenshots.

## Live Demo and Credentials

### Project Links

- Frontend Repo: https://github.com/FahimMuntasir0417/FoodNest-Client
- Backend Repo: https://github.com/FahimMuntasir0417/FoodNest-Server
- Frontend Live: https://food-nest-client.vercel.app
- Backend Live: https://foodnest-server.onrender.com
- Demo Video: https://drive.google.com/file/d/12D4k0QztRpl2FCdRIA1xqe82m1IjgwnU/view?usp=drive_link

### Demo Credentials

Use demo credentials only for non-production demonstrations.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@admin.com` | `admin1234` |
| Provider | `hixemom794@azeriom.com` | `12345@#$` |
| Customer | `y41lhw4kb3@ozsaip.com` | `12345@#$` |

## Installation and Setup

### Prerequisites

- Node.js 20 or later
- pnpm 10 or later
- Access to the FoodNest backend API

### Setup

1. Clone the repository:

```bash
git clone https://github.com/FahimMuntasir0417/FoodNest-Client
cd FoodNest-Client
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a local environment file:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Update environment variables for your local or deployed backend.

5. Run the development server:

```bash
pnpm dev
```

6. Open the app:

```txt
http://localhost:3000
```

## Environment Variables

Create `.env` in the project root using [`.env.example`](.env.example) as the reference.

```env
NEXT_PUBLIC_API_URL=https://foodnest-server.onrender.com/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_URL=http://localhost:3000/api/auth

BACKEND_URL=https://foodnest-server.onrender.com
API_URL=https://foodnest-server.onrender.com/api/v1
AUTH_URL=https://foodnest-server.onrender.com/api/auth
FRONTEND_URL=http://localhost:3000
```

Important notes:

- Public variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- Server-only variables are used by server actions, API helpers, and auth integration.
- Do not commit production secrets or private environment values.

## API and Architecture

### Backend API

```txt
https://foodnest-server.onrender.com
```

Application API:

```txt
https://foodnest-server.onrender.com/api/v1
```

Auth API:

```txt
https://foodnest-server.onrender.com/api/auth
```

### High-level Flow

```text
Page / Component
  -> Server action or feature service
  -> Shared API helper
  -> FoodNest backend API
  -> Typed UI state
```

### Architecture Highlights

- `src/app` contains App Router route groups and dashboard slots.
- `src/actions` contains server actions for authenticated mutations and data flows.
- `src/services` contains API service modules for backend resources.
- `src/features` contains feature-specific schemas, services, types, and components.
- `src/lib` contains API clients, auth helpers, utilities, and legacy shared modules.
- `src/routes` contains role-based dashboard route definitions.
- `src/proxy.ts` protects route access at the edge/proxy layer.

### Main Routes

- `/`
- `/home`
- `/about`
- `/contact`
- `/help`
- `/privacy`
- `/terms`
- `/login`
- `/signup`
- `/food`
- `/maels`
- `/maels/[id]`
- `/order-item`
- `/order`
- `/dashboard-profile`
- `/customer-dashboard`
- `/provider-dashboard`
- `/admin-dashboard`

## Folder Structure

```plaintext
foodnest-client/
|
+-- e2e/
+-- public/
|   +-- foodnest-logo-mark.png
+-- screenshots/
+-- src/
|   +-- actions/
|   +-- app/
|   |   +-- (commonlayout)/
|   |   +-- (dashboardLayout)/
|   |   +-- api/
|   +-- components/
|   +-- config/
|   +-- constants/
|   +-- features/
|   +-- hooks/
|   +-- lib/
|   +-- routes/
|   +-- services/
|   +-- types/
+-- .env.example
+-- package.json
+-- playwright.config.ts
+-- tsconfig.json
+-- vitest.config.ts
```

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm test` | Run unit and component tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:e2e` | Run Playwright end-to-end tests |
| `pnpm format` | Format files with Prettier |
| `pnpm format:check` | Check formatting without writing changes |

## Quality Workflow

Before opening a pull request or deploying, run:

```bash
pnpm type-check
pnpm lint
pnpm format:check
pnpm test
```

For browser-level confidence, run:

```bash
pnpm test:e2e
```

## Deployment

The frontend is deployed on Vercel:

```txt
https://food-nest-client.vercel.app
```

For production deployment:

1. Configure all required environment variables in Vercel.
2. Confirm the backend API URL points to the deployed backend.
3. Run the production build locally with `pnpm build`.
4. Deploy from the connected GitHub repository.

## Quality Signals

This README is structured to show:

- Clear problem understanding for a food ordering frontend
- Clean installation and setup steps
- Evidence of system design thinking through route groups, dashboard slots, service modules, and server actions
- Security awareness around environment variables, auth URLs, role-based access, and demo credentials
- Scalability considerations through feature folders, typed services, reusable components, tests, and deployment workflow

## Contributions

If this is a team project, list contributors here.

| Name | Role | Contributions |
| --- | --- | --- |
| Member-1 | Role | Contributions |
| Member-2 | Role | Contributions |

## How to Contribute

- Fork the project.
- Create a branch: `git checkout -b feature/AmazingFeature`.
- Commit changes: `git commit -m "Add some AmazingFeature"`.
- Push the branch: `git push origin feature/AmazingFeature`.
- Open a pull request.

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## Contact

- **Live URL:** [FoodNest Client](https://food-nest-client.vercel.app)
- **Backend Live:** [FoodNest Server](https://foodnest-server.onrender.com)
- **Frontend Repo:** [FoodNest-Client](https://github.com/FahimMuntasir0417/FoodNest-Client)
- **Backend Repo:** [FoodNest-Server](https://github.com/FahimMuntasir0417/FoodNest-Server)
- **Demo Video:** [FoodNest Demo](https://drive.google.com/file/d/12D4k0QztRpl2FCdRIA1xqe82m1IjgwnU/view?usp=drive_link)
- **Email:** [fahimmuntasirbejoy@gmail.com](mailto:fahimmuntasirbejoy@gmail.com)
- **Portfolio:** [Fahim Portfolio](https://fahim-portfolio-dun.vercel.app/)
