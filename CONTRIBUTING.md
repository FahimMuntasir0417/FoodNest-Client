# Contributing

Thank you for improving FoodNest Client.

## Local Workflow

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and adjust values for your environment.
3. Run `pnpm dev` for local development.
4. Before opening a pull request, run:

```bash
pnpm type-check
pnpm lint
pnpm test -- --run
pnpm build
```

## Code Guidelines

- Keep route files small and move business logic into `src/features`.
- Use Zod schemas for form validation.
- Use the shared API client in `src/lib/api.ts` for backend requests.
- Avoid `any`; add feature-specific types when backend responses are known.
