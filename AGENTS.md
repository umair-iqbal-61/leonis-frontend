# Leonis Frontend

## Commands

Run from this repository root with Node.js 24. Start the backend on port 7461 first.

```bash
npm ci
VITE_API_URL=http://localhost:7461/api npm run dev -- --port 5173 --strictPort
npm run lint
VITE_API_URL=http://localhost:7461/api npm run build
```

There is no automated test script. For a browser smoke test, open
`http://localhost:5173/signup`, create a disposable account, add a pet, log a
weight, and reload to verify persistence. Use the `localhost` origin for CORS.

## Code style

- Use JavaScript ES modules and JSX. Ask before introducing TypeScript or changing tooling.
- Match nearby code. Prefer two-space indentation, single quotes in JavaScript,
  and no semicolons. Use PascalCase for components and camelCase for helpers and `use...` hooks.
- Keep route screens in `src/pages/`, reusable UI in `src/components/`, and hooks in `src/hooks/`.
- Prefer Tailwind v4 utilities. Put shared tokens in `@theme` and keep glass effects in small `@utility` definitions.
- Plain CSS is allowed for exceptional cases where utilities are unsuitable. Preserve mobile layouts, dark mode, and Urdu RTL.
- Use `src/lib/api.js` for backend requests. Pass paths relative to the API base,
  such as `/pets`. The base URL includes `/api`.

## Guardrails

- Keep `REFERENCES.md` updated for frontend research and assets; shared livestock/financial sources belong in `../leonis-backend/REFERENCES.md`. Record dates, topic, source links, use and limitations without inventing past verification.
- Work on a dedicated branch. Ask before modifying `main`.
- Never read, create, or edit `.env` files or expose secrets. Treat `VITE_*` values as public.
- `npm ci` installs existing locked dependencies. Ask before adding or upgrading dependencies.
- Keep changes scoped to the task. Check lint and build before handing off code changes.
