# Farming Nyumbani

A farm-leasing marketplace for Kenya. Landowners list plots they are not farming this season;
tenants search by county, budget, water source and crop, and see whether the land's rainfall and
altitude actually support what they want to grow.

Built as a React capstone: component-based, tested, accessible and deployed-ready.

## Status

Milestone 1 complete (public pages) and the engagement features from the user stories:

- Design tokens, typography and shared UI primitives (`Button`, `Input`, `Select`, `Textarea`, `Badge`, `Spinner`, `EmptyState`, `ErrorState`)
- Responsive shell: sticky header with accessible mobile drawer, footer, skip link, error boundary
- Home, Find a farm (filters + debounced search + empty state), Farm detail, Crops & regions (county crop ranking), 404
- Tenant reviews, comments on reviews, emoji reactions on reviews and comments, and a "report this listing" flow
- Firebase Authentication: email/password, Google sign-in, logout, guest-only and protected routes,
  and a `/account` page that is only reachable when signed in
- Delete with recovery: your own reviews and comments can be deleted, undone straight away, and
  restored later from a "Recently deleted" bin; only "delete forever" removes the record
- Engagement data in Firestore when Firebase is configured, with security rules that stop one
  account deleting another's documents; `localStorage` remains the fallback for machines with no keys
- Lease requests: a tenant can ask a landowner about a plot from the farm page, with intended crops,
  a start date and a message, and see every request they sent on `/account`
- Unit and component tests with Vitest + React Testing Library

User stories and acceptance criteria: [`USER_STORIES.md`](./USER_STORIES.md).
Build order from an empty folder: [`STEP_BY_STEP.md`](./STEP_BY_STEP.md).

Not built yet, in plan order: Firestore-backed listings, a landowner dashboard that accepts or
declines incoming requests, weather advisories.

## Data and security rules

Reviews, comments, reactions and reports live in Firestore once Firebase is configured. The app
keeps working with no keys: `services/engagement.js` picks a backend and both answer the same
calls, so components never know which one answered.

```
Browser -> services/engagement.js -> engagementFirestore.js -> Firestore (rules enforced)
                                 -> engagementLocal.js -> localStorage (no keys, tests)
```

| Collection | Who may read | Who may write |
| --- | --- | --- |
| `reviews` | anyone | the author (`authorId == uid`), create + soft delete + restore |
| `comments` | anyone | the author |
| `reactions` | anyone | the account that reacted (`actorId == uid`), add and remove only |
| `reports` | only the reporter | the reporter, create only (no edit, no delete) |
| `leaseRequests` | only the tenant who sent it | that tenant, create only (status changes belong to the landowner side) |

A lease request is a message, not a payment: it records the crops, start date and note the tenant
sent, and nothing in the app can edit it afterwards. Updates may only change `deletedAt` on reviews
and comments: text, rating, farm and owner are immutable, so restoring cannot smuggle different
content back in. The rules are in [`firestore.rules`](./firestore.rules); the
checks in the adapter exist for friendly error messages, but the rules are what actually enforce it,
because a browser can be edited and the rules cannot.

Deploy the rules after changing them:

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # pick the project, alias it 'default'
firebase deploy --only firestore:rules
```

Then create the Firestore database in the console (production mode) before the first write.

## Authentication

Auth is wired through `context/AuthContext.jsx` and Firebase, but gated on configuration: with no
keys the app still runs, and `/login` explains what is missing instead of crashing.

To turn it on:

1. Create a Firebase project and a web app in the console.
2. Authentication → Sign-in method: enable **Email/Password** and **Google**.
3. Authentication → Settings → Authorised domains: add `localhost` and your deployed domain.
4. Copy `.env.example` to `.env.local` and paste the web config values.
5. Restart `npm run dev`.

How it behaves:

- `AuthProvider` subscribes once to `onAuthStateChanged`; `initialising` covers session restore so
  a refresh on `/account` does not flash the login page.
- `ProtectedRoute` redirects to `/login` and remembers where you were; `Login` sends you back there
  after a successful sign-in.
- `PublicOnlyRoute` bounces a signed-in user off `/login` and `/register` to `/account`.
- Errors are mapped in `utils/authErrors.js` ("Email or password is incorrect", popup blocked,
  unauthorised domain) so raw Firebase codes never reach the UI.
- Reviews and comments use the account's display name when signed in, and fall back to the typed
  device-local name for guests.

## Delete and recovery

Nothing a visitor writes is ever thrown away on the first click. `services/engagement.js` stamps
the record with `deletedAt` instead of removing it, and every read filters that stamp out, so the
row is hidden but still in storage:

| Action | Function | Result |
| --- | --- | --- |
| Delete review or comment | `softDeleteItem(kind, id)` | hidden from the farm page, kept in storage |
| Undo, right there | `restoreItem(kind, id)` | comes back with the same text and date |
| Restore later | `listTrash(name)` on `/account` | "Recently deleted" bin, same restore call |
| Delete forever | `purgeItem(kind, id)` | the only action that actually removes the row |

Deleting is limited to your own writing: the buttons only appear when `actor === review.author`,
and the account bin only lists items saved under your display name.

## CI and deployment

Two workflows live in `.github/workflows/`:

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `ci.yml` | every push and pull request | `npm ci`, `npm run lint`, `npm run coverage` (thresholds enforced), `npm run build` |
| `deploy.yml` | pushes to `main`, or manually | builds with the Pages subpath, writes the SPA fallback, publishes to GitHub Pages |

A red CI run means the branch does not install, lint, test or build, so it is not mergeable. The
deploy job only runs on `main`, and only after its own build succeeds.

### Publishing to GitHub Pages

1. Push the repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions** (once).
3. Push to `main`, or run **Deploy to GitHub Pages** from the Actions tab.
4. The site appears at `https://<user>.github.io/<repo>/`.

The project site is served from a subpath, so the workflow passes
`VITE_BASE_PATH=${{ steps.pages.outputs.base_path }}` into the build. `vite.config.js` uses it as
`base`, and `main.jsx` passes `import.meta.env.BASE_URL` to `BrowserRouter` as `basename`, so router
links stay inside `/<repo>/`. The local default is `/Farming-Nyumbani/`; set `VITE_BASE_PATH` when
deploying under a different repository name or preview subpath.

GitHub Pages has no server-side rewrites, so a shared link like `/repo/farms/<id>` would otherwise
hit a Pages 404. `scripts/spa-fallback.mjs` runs after the build and writes a `dist/404.html` that
remembers the requested path and sends the browser to the site root, where the script in
`index.html` restores the path before React Router reads the URL. Deep links therefore work on
refresh, on a shared link, and in a new tab.

To check the published build locally:

```bash
VITE_BASE_PATH=/Farming-Nyumbani/ npm run build:pages
npx vite preview --base /Farming-Nyumbani/   # open the printed /Farming-Nyumbani/ URL
```

### Firebase on the deployed site

Sign-in and Firestore stay off until the deployed build has keys. Add these as repository secrets
(**Settings → Secrets and variables → Actions**); the deploy workflow passes them to the build:

`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
`VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

With no secrets the deployed site still works: reviews, comments and lease requests fall back to
`localStorage` and the sign-in pages explain that Firebase is not configured. Finally, add the
Pages domain (and any custom domain) under **Authentication → Settings → Authorised domains** in
the Firebase console, or Google sign-in fails with `auth/unauthorized-domain`.

## Stack

React 18 · Vite 5 · React Router 6 · Tailwind CSS 3.4 · Vitest + React Testing Library
Firebase (Auth + Firestore) will back accounts, listings and engagement data in milestone 2.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (React, hooks, jsx-a11y), zero warnings allowed |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Single test run (CI) |
| `npm run coverage` | Test run with a coverage report; fails below the thresholds in `vite.config.js` |

## Environment

Copy `.env.example` to `.env.local` and add your Firebase web config. `.env.local` is git-ignored.
The Firebase web config is public by design - Firestore security rules, not key secrecy, control
access - but it still never gets committed.

## Structure

```
src/
  components/
    ui/          reusable primitives, no feature knowledge
    layout/      header, footer, shell, skip link, error boundary
    farms/       FarmCard, FarmFilters, ReportListing
    reviews/     ReviewSection, ReviewCard, ReviewForm, CommentForm, ReactionBar
  data/          static reference data (counties, crops, seed listings, sample reviews)
  hooks/         useDebouncedValue, useDocumentTitle, useLocalIdentity
  pages/         one component per route
  services/      engagement.js - the seam; engagementLocal/engagementFirestore = backends
                 firebase.js - app, auth and Firestore from env vars
  tests/         test setup
  utils/         formatting, filtering, crop scoring and validation (pure, unit tested)
```

Data flows one way: pages own their filter and form state, pass plain props down to presentational
components, and call pure helpers for anything worth testing. There is no global store yet - when
auth lands, the session belongs in a Context because many distant components need it; listings stay
in per-page hooks so a fetch does not re-render the whole tree.

## Decisions worth knowing

- **Suitability scores are relative, not gospel.** `utils/cropMatch.js` compares a county's average
  rainfall and altitude against a crop's typical range and returns 0-100. It is a planning aid, and
  the UI says so.
- **Listings are seed data shaped like the future Firestore document**, so milestone 2 replaces the
  import with a service call instead of a rewrite.
- **Delete is a stamp, not a removal.** `deletedAt` keeps rows recoverable; a `purgeItem` call is the
  only real delete. Reads must filter `!deletedAt`, which is the one rule to remember here.
- **A failed write is an error, not silence.** Reads fall back to empty on a blocked or corrupt
  store, but `engagementLocal.js` throws when `localStorage` refuses to persist (quota exceeded,
  private mode) and verifies the value it wrote. The forms only show "posted" once the promise
  resolves, so a review that did not stick says so and keeps the text.
- **Engagement is two backends behind one seam.** `engagement.js` forwards to Firestore when
  configured and to `localStorage` otherwise, so the app is demoable without keys and still shares
  reviews between devices once they exist. Reads are public; writes are tied to a uid.
- **Engagement data is local when Firebase is absent.** `services/engagementLocal.js` persists to a
  small interface; only that file changes when Firestore arrives.
- **Land measurements are acres and prices are KES**, because that is what the user sees on the ground.
- **Accessibility is part of the component contract**: labels tied to inputs, errors announced with
  `role="alert"`, focus rings never removed, drawer closes on Escape.