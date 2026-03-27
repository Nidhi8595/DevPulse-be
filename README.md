# DevPulse — Backend

> NestJS API that aggregates developer content from 8 sources into a single `/feed` endpoint.

Live URL: `https://devpulse-be.onrender.com`

---

## What It Does

Accepts a technology name (e.g. `react`, `docker`, `python`) and fetches data from 8 developer platforms simultaneously, validates that the input is actually a technology, deduplicates results, and returns a combined JSON response.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| NestJS | 10+ | Backend framework (modular architecture) |
| TypeScript | 5+ | Type safety |
| Axios | Latest | HTTP calls to external APIs |
| @nestjs/config | Latest | Environment variable management |

---

## Project Structure

```
src/
├── app.module.ts              — Root module, registers all feature modules
├── app.controller.ts          — Health check endpoint
├── main.ts                    — Bootstrap, CORS config, keep-alive ping
│
├── feed/
│   ├── feed.module.ts         — Imports all source modules
│   ├── feed.controller.ts     — GET /feed?tech=react
│   └── feed.service.ts        — Orchestrates all 8 sources in parallel
│
├── github/
│   ├── github.module.ts
│   ├── github.controller.ts   — GET /github?tech=react
│   └── github.service.ts      — Searches GitHub repos, fetches releases
│
├── github-trending/
│   ├── github-trending.module.ts
│   └── github-trending.service.ts  — Repos created in last 30 days, sorted by stars
│
├── reddit/
│   ├── reddit.module.ts
│   ├── reddit.controller.ts   — GET /reddit?tech=react
│   └── reddit.service.ts      — Reddit public JSON API, filters by dev subreddits
│
├── news/
│   ├── news.module.ts
│   ├── news.controller.ts     — GET /news?tech=react
│   └── news.service.ts        — NewsAPI, filters for developer context
│
├── stackoverflow/
│   ├── stackoverflow.module.ts
│   └── stackoverflow.service.ts  — StackExchange API, active questions by tag
│
├── hackernews/
│   ├── hackernews.module.ts
│   └── hackernews.service.ts  — Algolia HN API, story search
│
├── devto/
│   ├── devto.module.ts
│   └── devto.service.ts       — Dev.to public API, articles by tag
│
├── npm/
│   ├── npm.module.ts
│   └── npm.service.ts         — npm registry search + weekly download counts
│
└── tech/
    ├── tech.module.ts
    ├── tech.controller.ts     — GET /tech/suggest?q=react
    └── tech.service.ts        — StackOverflow tags + GitHub topics for autocomplete
```

---

## API Endpoints

### `GET /feed?tech=react`
Main aggregation endpoint. Fetches all 8 sources in parallel.

**Response:**
```json
{
  "news": [
    { "title": "...", "url": "...", "source": "...", "publishedAt": "..." }
  ],
  "github": [
    { "name": "19.2.4", "url": "...", "date": "...", "repo": "facebook/react" }
  ],
  "githubTrending": [
    { "name": "user/repo", "description": "...", "url": "...", "stars": 1200, "language": "TypeScript", "topics": [] }
  ],
  "reddit": [
    { "title": "...", "url": "...", "subreddit": "reactjs", "score": 450 }
  ],
  "stackoverflow": [
    { "title": "...", "url": "...", "score": 12, "answers": 5 }
  ],
  "hackernews": [
    { "title": "...", "url": "...", "points": 230, "author": "..." }
  ],
  "devto": [
    { "title": "...", "url": "...", "author": "...", "reactions": 45 }
  ],
  "npm": [
    { "name": "react", "version": "19.0.0", "description": "...", "url": "...", "weeklyDownloads": 28000000, "date": "..." }
  ]
}
```

**Error response** (when input is not a technology):
```json
{ "error": "\"pizza\" does not appear to be a developer technology" }
```

---

### `GET /tech/suggest?q=re`
Autocomplete suggestions. Used by the frontend search bar.

**Response:**
```json
["react", "reactjs", "redux", "redis", "rest"]
```

Sources: StackOverflow tags API + GitHub topics API, merged and deduplicated.

---

### `GET /health`
Health check. Used by keep-alive ping and deployment verification.

**Response:**
```json
{ "status": "ok", "timestamp": "2026-03-28T10:00:00.000Z" }
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# NewsAPI — https://newsapi.org (free tier: 100 req/day)
NEWS_API_KEY=your_newsapi_key_here

# GitHub Personal Access Token — https://github.com/settings/tokens
# Needed to avoid GitHub rate limiting (60 req/hr unauthenticated vs 5000 authenticated)
# Permissions needed: public repositories read
GITHUB_TOKEN=your_github_token_here

# Server port (Render sets this automatically)
PORT=3000

# Set to 'production' on Render to enable keep-alive ping
NODE_ENV=production

# Render sets this automatically in production
RENDER_EXTERNAL_URL=https://your-app.onrender.com
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start with hot reload
npm run start:dev

# Server starts at http://localhost:3000
```

Test endpoints:
```
http://localhost:3000/health
http://localhost:3000/feed?tech=react
http://localhost:3000/tech/suggest?q=re
http://localhost:3000/github?tech=react
http://localhost:3000/reddit?tech=react
```

---

## Architecture — Aggregator Pattern

```
GET /feed?tech=react
        │
        ▼
   FeedService
        │
        │── normalizeTech("react") → "react"
        │
        │── Promise.all([
        │     NewsService.getTechNews("react"),
        │     GithubService.getReleases("react"),
        │     RedditService.getRedditPosts("react"),
        │     StackoverflowService.getQuestions("react"),
        │     HackernewsService.getPosts("react"),
        │     DevtoService.getArticles("react"),
        │     GithubTrendingService.getTrending("react"),
        │     NpmService.getPackageInfo("react"),
        │   ])
        │
        │── Validate: developerSignals > 0
        │── Deduplicate each array by URL
        │
        ▼
   Return combined JSON
```

All 8 API calls run in **parallel** using `Promise.all()`. If they ran sequentially and each took 500ms, the total would be 4 seconds. In parallel, total time = slowest single call (usually ~800ms).

---

## Validation Logic

```typescript
const developerSignals =
  github.length + reddit.length + stackoverflow.length +
  hackernews.length + devto.length + githubTrending.length + npm.length;

if (developerSignals === 0 && news.length < 3) {
  return { error: `"${tech}" does not appear to be a developer technology` };
}
```

News alone doesn't count — a real technology must have signals from at least one developer platform. This prevents words like "pizza" or "football" from returning results.

---

## Tech Normalization

```typescript
normalizeTech(tech: string): string {
  return tech
    .toLowerCase()
    .trim()
    .replace(/^(.+?)(?:\.js)$/i, '$1')   // node.js → node
    .replace(/^(.{4,})js$/i, '$1');       // expressjs → express
}
```

This means users can type `nodejs`, `node.js`, or `node` — all normalize to `node` before querying.

---

## GitHub Service — Dynamic (No Hardcoding)

```typescript
// Step 1: Find most relevant repo for this tech
const searchRes = await axios.get(
  `https://api.github.com/search/repositories?q=${tech}+topic:${tech}&sort=stars&order=desc&per_page=5`
);

// Step 2: Try top 3 repos to find one with releases
for (const repo of repos.slice(0, 3)) {
  const releases = await axios.get(
    `https://api.github.com/repos/${repo.full_name}/releases?per_page=5`
  );
  if (releases.length > 0) return releases;
}

// Step 3: Fallback — return trending repos if no releases found
return repos.map(r => ({ name: r.full_name, stars: r.stargazers_count, ... }));
```

Works for any technology without any hardcoded repo names.

---

## Reddit Service — Community Type Filtering

Instead of filtering by tech name (which would require updating the list for every new technology), filtering is done by **subreddit type**. The allowed list contains 50+ programming communities that collectively cover every technology:

```typescript
private allowedSubreddits = new Set([
  'reactjs', 'javascript', 'typescript', 'vuejs', 'angular',
  'node', 'python', 'java', 'golang', 'rust', 'cpp',
  'devops', 'docker', 'kubernetes', 'aws', 'azure',
  'database', 'mysql', 'postgresql', 'mongodb',
  'machinelearning', 'datascience',
  'programming', 'softwareengineering', 'webdev',
  // ... 30+ more
]);
```

Any new technology (Bun, Zig, etc.) will automatically appear in these communities without any code changes.

---

## Deployment (Render)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Web Service → Connect repo
3. Configure:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/main` |
| Instance Type | Free |

4. Add environment variables in the Environment tab
5. Deploy

**Free tier note:** Render spins down the service after 15 minutes of inactivity. The keep-alive ping in `main.ts` prevents this by calling `/health` every 14 minutes.

---

## Problems Fixed During Development

### NestJS Dependency Injection Error
- **Problem:** `FeedService cannot resolve dependencies — NewsService not available in FeedModule`
- **Root cause:** NestJS uses a module system where each module is isolated. Services can only be injected if they are either in the same module OR exported from another module and that module is imported.
- **Fix:**
  1. Add `exports: [NewsService]` to `NewsModule`
  2. Add `imports: [NewsModule]` to `FeedModule`
  3. Repeat for all source modules

### Reddit Returning Irrelevant Posts
- **Problem:** Searching "react" returned political news, sports, random posts
- **Root cause:** Reddit's public search API searches all subreddits
- **Fix:** Filter results to only keep posts from a hardcoded set of developer subreddits

### Dev.to 404 Error
- **Problem:** `axios.get('https://dev.to/api/articles?tag=java.js')` → 404
- **Root cause:** `generateKeywords()` was creating aliases like `java.js`, `javajs` and sending ALL of them to every API. Dev.to tags don't have `.js` variants.
- **Fix:** Removed the keyword expansion function entirely. Each API now receives only the clean normalized base keyword.

### GitHub Only Working for 5 Technologies
- **Problem:** GitHub service had a hardcoded `repoMap` with only react, node, tailwind, mongodb, nextjs
- **Fix:** Replaced with GitHub search API — dynamically finds the most-starred repo for any technology

### Pizza Passing Validation
- **Problem:** "pizza" returned results because NewsAPI found food articles, and the validator only checked result count
- **Fix:** Changed validation to require developer-specific signals (GitHub, Reddit, SO, HN, Dev.to) — news alone is not enough

### GitHub Rate Limiting (60 req/hr)
- **Problem:** Without authentication, GitHub API allows only 60 requests per hour. DevPulse makes multiple GitHub calls per search.
- **Fix:** Add `GITHUB_TOKEN` to `.env`. Authenticated requests get 5000/hr — more than enough.

### Render Cold Start (30-60 second delay)
- **Problem:** Render free tier spins down after 15 minutes of inactivity. First request after that has a long cold start.
- **Fix:** Self-ping every 14 minutes using `setInterval` + `fetch('/health')` in `main.ts`. Only runs in production (`NODE_ENV === 'production'`).

### CORS Blocking Frontend
- **Problem:** Browser blocked requests from `localhost:4200` to `localhost:3000` (different ports = different origins)
- **Fix 1 (local):** `app.enableCors({ origin: 'http://localhost:4200' })`
- **Fix 2 (production):** `origin: '*'` with `credentials: false` — allows any origin, required because Vercel preview URLs change per deployment

---

## Interview Talking Points

- **Module system:** NestJS modules are analogous to Angular modules — they encapsulate providers and require explicit exports/imports for cross-module dependency injection
- **Parallel requests:** `Promise.all()` runs all 8 API calls concurrently — explain why this is O(max) not O(sum) in terms of time complexity
- **Aggregator pattern:** FeedService is a classic aggregator — it calls multiple downstream services and merges results, a common microservices pattern
- **CORS:** Same-origin policy is a browser security feature — it only affects browser-to-server requests, not server-to-server. That's why your NestJS backend can call GitHub/Reddit without CORS issues, but your Angular frontend cannot call NestJS without explicit CORS headers.
- **Rate limiting:** GitHub's unauthenticated limit is 60/hr, authenticated is 5000/hr. Always use tokens in production.