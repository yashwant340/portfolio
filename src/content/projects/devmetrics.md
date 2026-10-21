---
status: shipped
slug: devmetrics
order: 1
title: DevMetrics
category: Analytics
summary: GitHub analytics that syncs pull requests, reviews and commits, then scores repository health over time.
tagline: A GitHub analytics dashboard. Connect a repository and it syncs pull requests, reviews and commits, saves a daily metrics snapshot, and shows health trends and side-by-side comparisons.
role: Solo · Full-stack
stack: [React, TypeScript, Spring Boot, Spring Security, PostgreSQL, GitHub OAuth]
highlights:
  - Incremental sync with SHA de-duplication
  - GitHub OAuth with httpOnly JWT cookies
  - Daily snapshots for trends and comparisons
links:
  frontend: https://github.com/yashwant340/devMetricsUI
  backend: https://github.com/yashwant340/devMetricsService
# Add files under public/projects/devmetrics/ and point to them here:
# cover: /projects/devmetrics/cover.png
# preview: /projects/devmetrics/preview.mp4
clips:
  - title: Connect a repository
  - title: Sync and health score
  - title: Compare two repositories
architecture:
  summary: Two apps. A React client that only renders and fetches, and a Spring Boot API that owns auth, GitHub integration, persistence and metric computation.
  client:
    title: React client
    detail: Vite, TypeScript, React Router
  clientLink: REST + httpOnly cookies
  server:
    title: Spring Boot API
    detail: OAuth2 login, JWT filter, sync service, metrics service, 6-hourly scheduler
  services:
    - title: PostgreSQL
      detail: PRs, commits, reviews, snapshots
      link: JPA
    - title: GitHub API
      detail: OAuth, repos, PRs, commits
      link: REST, paginated
challenges:
  - title: Incremental sync
    body: The first sync imports the full commit history. Later syncs fetch only commits newer than the latest stored one, with a one-minute overlap and SHA de-duplication so nothing is missed or counted twice.
  - title: Token-free frontend
    body: JWTs live in httpOnly cookies, with a 15-minute access token and a 7-day refresh token. The client never sees a token; on a 401 it refreshes once and retries the request transparently.
  - title: A health score you can trend
    body: Four 25-point dimensions (review speed, merge speed, churn and team activity) are computed after each sync and saved as a daily snapshot, so changes show up as trends.
limitations:
  - issue: First sync makes one API call per commit
    next: Large repos can hit GitHub's rate limit. Next, batch with the GraphQL API and back off on rate-limit headers.
  - issue: Manual and scheduled syncs can overlap
    next: Add a per-repository lock and unique constraints on synced rows.
  - issue: Churn is measured all-time
    next: That flattens trend lines. Compute churn over rolling 30-day windows instead.
  - issue: GitHub tokens are stored as plain text
    next: Fine for a local MVP. For production, encrypt them at rest and narrow the OAuth scope.
---

I wanted a quick way to answer "is this repository healthy, and is it getting better?" without clicking through dozens of pull requests. DevMetrics connects to GitHub, pulls the activity behind a repository, and turns it into a few numbers you can track over time.

After you sign in with GitHub and connect a repository, the backend syncs its pull requests, reviews, commits and contributors into PostgreSQL. Each sync ends by computing a metrics snapshot: average time to first review, time to merge, code churn, active contributors and velocity, rolled up into a 0–100 health score. Because a snapshot is saved every day, the dashboard can show sparklines, week-over-week changes and short insight cards rather than just the current state.

You can also put two repositories side by side to compare how they work. Disconnecting a repository is a soft delete, so its history stays intact if you connect it again.
