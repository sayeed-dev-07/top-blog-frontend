# Top Blog Frontend

A responsive personal blog frontend built with Next.js. Readers can browse published posts, read individual articles, and participate through comments. Registered users can comment, while administrators have a dashboard for creating, publishing, unpublishing, and deleting posts.

## Features

- Browse published blog posts from the home page.
- Read full post details with cover images, formatted content, and animated article accents.
- Register and sign in with JWT-based authentication.
- Add comments when signed in.
- Edit or delete comments you own; administrators can manage all comments.
- Use the protected admin dashboard to create posts and change their published status.
- Show helpful loading, empty, error, missing-post, and unauthorized states.
- Animate page elements and scroll-triggered details with GSAP.
- Provide smooth scrolling with Lenis while keeping GSAP ScrollTrigger synchronized.
- Use responsive, utility-first styling with Tailwind CSS.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 with React 19 and the App Router |
| Styling | Tailwind CSS 4 |
| Server-state management | TanStack Query 5 |
| Animation | GSAP and `@gsap/react` |
| Smooth scrolling | Lenis with `lenis/react` |
| Authentication | JWT tokens decoded with `jwt-decode` |
| Icons | Lucide React |
| Linting | ESLint with `eslint-config-next` |

## TanStack Query: Caching, Loading, and Error Handling

TanStack Query manages API-driven state for posts, comments, and authentication mutations.

- The shared `QueryProvider` creates one `QueryClient` for the application.
- Queries use a 60-second `staleTime`, so recently fetched data is reused before it is considered stale.
- Failed queries retry once by default, helping with temporary network failures without retrying indefinitely.
- Posts and comments use stable query keys such as `['posts']`, `['posts', postId]`, and `['comments', postId]`.
- Post and comment mutations invalidate the affected queries so the UI receives fresh server data after a create, update, publish, unpublish, or delete action.
- Updating a post also writes the returned post directly into its detail-query cache. Deleting a post removes its detail query.
- Logging in invalidates queries and logging out clears the query cache, preventing a previous user's data from persisting in the session.
- Components use Query status values including `isLoading`, `isPending`, `isError`, and mutation errors to render spinners, disable in-progress actions, and display useful error messages instead of failing silently.

## Lenis Smooth Scrolling

The root layout wraps the application in a Lenis provider. Lenis is configured for smooth mouse-wheel scrolling and is driven through GSAP's ticker. This keeps Lenis and GSAP ScrollTrigger in the same animation loop.

The provider also:

- refreshes ScrollTrigger after layout and font changes;
- watches document-size changes with `ResizeObserver`;
- resets scroll position and Lenis momentum after route changes; and
- disables browser scroll restoration to avoid conflicts with pinned or animated content.

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Public list of published posts |
| `/posts/[id]` | Individual post and comments |
| `/login` | User sign-in |
| `/register` | Account registration |
| `/admin` | Administrator post-management dashboard |

## Project Structure

```text
app/                 Routes, layouts, loading state, and global styles
app/(app)/           Public blog pages
app/(auth)/          Login and registration pages
app/(admin)/         Administrator dashboard
components/shared/   Reusable navigation, footer, and loading UI
hooks/               TanStack Query, auth, user, and admin hooks
lib/                 API request and endpoint helpers
providers/           QueryClient and Lenis providers
public/              Static images and decorative assets
```

## Local Setup

### Prerequisites

- Node.js 20.9 or later is recommended for Next.js 16.
- npm, which is included with Node.js.

### Installation

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd top-blog-frontend
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root if you want to use a different API server.

   ```env
   NEXT_PUBLIC_API_URL=https://your-api.example.com
   ```

   If `NEXT_PUBLIC_API_URL` is not set, the app uses `https://top-blog-api-backend-nine.vercel.app`.

4. Start the development server.

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production server after building |
| `npm run lint` | Run ESLint across the project |

## API and Authentication

The frontend reads its API base URL from `NEXT_PUBLIC_API_URL`. Requests are sent as JSON and automatically include a Bearer token from `localStorage` when one exists.

If the API returns `401 Unauthorized`, the stored token is removed. User information is decoded client-side from the JWT and synchronized across the interface through an `auth-change` browser event. Administrative access is determined by the token's `admin` claim.

## Image Configuration

Post cover images use Next.js `Image`. Remote HTTP and HTTPS image hosts are currently permitted in `next.config.mjs`, and image optimization is disabled to support externally hosted post images.

## Quality Checks

Before opening a pull request or deploying, run:

```bash
npm run lint
npm run build
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | No | Base URL for the blog API. A hosted backend URL is used when omitted. |

Do not commit `.env.local` or credentials. Environment files are excluded by the repository's `.gitignore`.
