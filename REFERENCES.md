# Leonis frontend references

Keep important frontend research and asset references here. Record the research
date, issue, original source URL, decision, affected files and limitations. Shared
livestock, record-quality and financial research belongs in the
[backend research register](../leonis-backend/REFERENCES.md); link to it rather
than duplicating its findings. If the backend checkout is unavailable, retain
new source notes here until they can be linked from the owning repository.

## Landing-page photography

**Registered:** 19 November 2026 from the existing implementation; original research date not recorded here. The external page was not fetched again for this update.

- **Source/credit:** [Azat Kılınç on Unsplash — sleeping cat by a window](https://unsplash.com/photos/sleeping-orange-and-white-cat-by-window-YMEC22V5uLE).
- **Use:** landing-page cat photograph, stored at [public/leonis-cat.jpg](public/leonis-cat.jpg), with the credit link rendered by [Landing.jsx](src/pages/Landing.jsx).
- **Original asset endpoint used:** [Unsplash image](https://images.unsplash.com/photo-1560948799-e17458123a9a?auto=format&fit=crop&w=1800&q=85).
- **Limit:** this records the existing asset source and credit; it is not a fresh license review.

## Typography

**Registered:** 19 November 2026 from [index.html](index.html).

- **Resource:** [Google Fonts stylesheet for DM Sans and Noto Naskh Arabic](https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;650;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap).
- **Use:** the current Latin/Urdu font pairing. [Shared tokens](src/index.css) contain the corresponding font-family declarations.
- **Limit:** an implementation resource, not evidence that every device has been visually tested.

## Design decisions supplied by the owner

The mobile-first layout, English/Urdu RTL support, liquid-glass-inspired buttons
and Tailwind-first preference are project requirements from the owner. They are
not claims of compliance with an Apple design specification or an externally
validated design system. See [AGENTS.md](AGENTS.md) for the current styling rules.

## Barn screens and report export

**Registered:** 19 November 2026, implementation evidence rather than new external research.

- [Barn screens](src/pages/barns/) and [translations/formatting](src/lib/barn.js) implement the owner's mobile-first, Tailwind-first, English/Urdu requirements using the existing UI system.
- Financial/production definitions come from the [backend specification and source mapping](../leonis-backend/docs/barn-dashboard-research.md), with [implemented report rules](../leonis-backend/docs/barn-dashboard.md). They are provisional product decisions informed by the primary sources in the backend register.
- Browser checks used the real isolated API/PostgreSQL database. Mobile widths, dark mode, RTL, payments, transfers and rendered English/Urdu PDFs were checked. This does not substitute for owner validation or external accounting review.

## New entry template

- **Date researched:** YYYY-MM-DD, or explicitly unknown.
- **Issue / question:** What problem was being investigated?
- **Source:** Original publisher, title, direct URL and relevant section/page.
- **Used for:** The decision, pattern or asset it supported.
- **Affected work:** Components, styles, tests or documentation links.
- **Limits / follow-up:** Age, access restrictions, assumptions and open questions.

## Workspace navigation and signup

**Registered:** 20 November 2026. **Source:** the owner's approved one-login Pets/Livestock split; no external research used.
**Use:** signup choice, saved account preferences, workspace dropdown/settings, separate pet/cattle lists/forms, and conditional barn navigation with shared commerce.
**Affected work:** [workspace strings](src/lib/workspace.js), [provider](src/components/WorkspaceProvider.jsx), [settings](src/pages/Workspaces.jsx), and [backend contract/backfill notes](../leonis-backend/docs/workspaces.md).
**Limits:** navigation preferences are not permissions; disabling a workspace retains records and existing owner-scoped record links.

## Existing-hosting release preparation

**Researched:** 20 November 2026.
**Issue:** configure v2 builds without changing the owner's Vercel/Render hosting.

- [Vercel: supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) supports the bounded `engines.node: 24.x` declaration in [package.json](package.json). Platform settings still need checking on the existing project.
- [Vercel: Vite, environment variables and SPA deep links](https://vercel.com/docs/frameworks/frontend/vite) informs the build-variable and route-reload checks in the [release guide](../leonis-backend/docs/deploy-v2.md). The existing SPA rewrite is retained; production routes have not been re-tested in the cloud for this update.
- The production API hostname comes from this repository's README, not authenticated hosting-dashboard inspection. `VITE_API_URL` is public and includes `/api`. Preview frontends require an explicit backend CORS allowlist entry.

**Related work:** runtime metadata in package/lock files, README commands and the shared release guide. These sources describe platform behavior; they do not confirm live project settings or deployment success.
