# Portfolio

Live at **https://yaswanth-kumar.vercel.app**

Personal portfolio site: Vite, React, TypeScript and Tailwind CSS, deployed on Vercel.

```bash
npm install
npm run dev            # http://localhost:5173
npm run check:content  # validate content and list remaining TODOs
npm run build          # runs check:content, type-checks, builds to dist/
```

## Editing content

All text, links and projects live in `src/content/`. Components only read from these files, so you never need to touch UI code to change what the site says.

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, headline, intro, availability, CV/GitHub/LinkedIn/email links |
| `capabilities.ts` | The "What I can build" cards; `usedIn` lists project slugs |
| `about.ts` | About page intro paragraphs (`**word**` highlights) and quick facts |
| `journey.ts` | Timeline steps (`state`: `past`, `current` or `next`; `org` can be cited by capabilities) |
| `beyond.ts` | Interests (up to 4) |
| `projects/*.md` | One file per project: YAML frontmatter + Markdown overview |
| `schema.ts` | The rules every content file must follow |

**Safety net:** the TypeScript files are type-checked as you edit, and project files are validated by `schema.ts` both in `npm run dev` (error overlay) and before every build. A missing field, a malformed URL or a `usedIn` slug that doesn't match a project fails with a message naming the file and field, so a broken edit never gets deployed.

**Placeholders:** any value starting with `TODO` is allowed while you write. `npm run check:content` lists them all. Links and buttons with a `TODO` value are hidden on the site.

### Adding a project

1. Copy `src/content/projects/devmetrics.md` to `src/content/projects/<slug>.md`. The `slug` in the frontmatter must match the file name.
2. Edit the frontmatter and overview. Use `status: in-progress` with just `slug`, `order`, `title` and `summary` for a project that isn't ready.
3. Put media in `public/projects/<slug>/` and reference it from the frontmatter: `cover` (screenshot), `preview` (short muted clip that plays on hover), and `src` on each entry in `clips`.

### Live demos

Shipped projects without a `links.live` URL show a "Live demo coming soon" badge and note; the wording is `liveDemoSoon` in `profile.ts`. Once a project is deployed, add `live: https://…` under its `links` and the badge becomes a **Live demo** button.

### CV

Put the PDF at `public/Yaswanth_Kumar_CV.pdf` (or change `links.cv` in `profile.ts`). Visitors download it under that file name.

## Deploying

Import the repository in Vercel; it detects Vite automatically. `vercel.json` rewrites routes like `/projects/devmetrics` to the app.
