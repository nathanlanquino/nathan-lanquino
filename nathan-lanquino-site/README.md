# Nathan Lanquino — Operations & Systems Specialist

Production-ready personal website. Static HTML/CSS/JS, no build step, no framework dependencies.

## Project structure

```
.
├── index.html                  Main page (all sections, semantic HTML, SEO meta)
├── assets/
│   ├── css/styles.css          All styles, mobile-first responsive breakpoints
│   ├── js/main.js              Mobile nav, scrollspy, reveal animations, form validation
│   └── img/
│       ├── favicon.svg         Source vector favicon
│       ├── favicon-16.png      Generated PNG favicon (16×16)
│       ├── favicon-32.png      Generated PNG favicon (32×32)
│       ├── apple-touch-icon.png  iOS home-screen icon (180×180)
│       ├── icon-192.png        PWA icon
│       ├── icon-512.png        PWA icon
│       └── og-cover.jpg        Social share preview image (1200×630)
├── site.webmanifest            Web app manifest (PWA metadata)
├── robots.txt                  Crawler rules + sitemap pointer
├── sitemap.xml                 XML sitemap for search engines
└── .github/workflows/deploy.yml  GitHub Actions: auto-deploy to GitHub Pages
```

## Before you deploy — replace these placeholders

Search the project for these markers and swap in your real values:

| Placeholder | Where | Replace with |
|---|---|---|
| `REPLACE-WITH-YOUR-CALENDLY` | `index.html` (4 places) | Your real Calendly URL slug |
| `REPLACE-WITH-LINKEDIN-HANDLE` | `index.html` (3 places), structured data | Your LinkedIn handle |
| `nathan@yourdomain.com` | `index.html` (2 places), JS | Your real email address |
| `nathanlanquino.github.io` | `index.html` meta tags, `robots.txt`, `sitemap.xml` | Your actual GitHub Pages URL (or custom domain) |
| Hero photo placeholder | `index.html`, inside `.hero-photo-frame` | Uncomment the `<img>` tag and add `assets/img/nathan-headshot.jpg` |
| Coffee shop photo placeholder | `index.html`, inside `.story-img-placeholder` | Uncomment the `<img>` tag and add `assets/img/coffee-shop.jpg` |
| Portfolio screenshots | Not yet included | Add a portfolio section with real dashboard screenshots when available |
| Additional testimonials | `assets/js/main.js`, `testimonials` array | Append `{ quote, name, title }` objects as you collect them |
| Contact form backend | `assets/js/main.js`, form submit handler | Wire up Formspree / Netlify Forms / Getform (see comment in code) |

A global find-and-replace for `REPLACE-WITH` will catch most of these in one pass.

## Local preview

No build tools required. Either:

- Open `index.html` directly in a browser, or
- Run a tiny local server (recommended, avoids `file://` quirks):
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

## Deploying to GitHub Pages

### Option A — Automatic (recommended, via GitHub Actions)

1. Create a new GitHub repository (e.g. `nathanlanquino.github.io` for a user site, or any name for a project site).
2. Push this folder's contents to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial production site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source** → select **GitHub Actions**.
4. Push again (or re-run the workflow from the **Actions** tab). The included `deploy.yml` workflow will build and publish automatically on every push to `main`.
5. Your site will be live at `https://YOUR-USERNAME.github.io/` (user site) or `https://YOUR-USERNAME.github.io/YOUR-REPO/` (project site).

> If you deploy as a **project site** (not `username.github.io`), all absolute URLs in `index.html`, `robots.txt`, and `sitemap.xml` should include the repo name in the path. The included paths assume a user site (root domain). Update `https://nathanlanquino.github.io/` → `https://YOUR-USERNAME.github.io/YOUR-REPO/` throughout if needed.

### Option B — Manual (no Actions)

1. In repo **Settings → Pages → Source**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
2. GitHub will build and publish automatically on every push. No workflow file needed (you can delete `.github/workflows/deploy.yml`), though leaving it does no harm if Pages is set to "branch" mode — it simply won't run unless Actions is selected as the source.

## Custom domain (optional)

1. Add a `CNAME` file at the project root containing only your domain, e.g.:
   ```
   www.nathanlanquino.com
   ```
2. In your DNS provider, add a `CNAME` record pointing `www` (or `@` via `ALIAS`/`ANAME`) to `YOUR-USERNAME.github.io`.
3. In **Settings → Pages**, enter the custom domain and enable **Enforce HTTPS** once DNS propagates.
4. Update the canonical/OG URLs in `index.html`, `robots.txt`, and `sitemap.xml` to match the new domain.

## Notes on the contact form

The form currently validates client-side (required fields, email format) but has **no backend** — submitting shows a friendly message directing visitors to email or Calendly instead. To make it actually deliver messages, the easiest options are:

- **Formspree** — point the fetch call in `assets/js/main.js` at `https://formspree.io/f/YOUR_FORM_ID`
- **Netlify Forms** — if hosting on Netlify instead of Pages, add `data-netlify="true"` to the `<form>` and a hidden `form-name` input
- **Getform / Basin** — similar drop-in POST endpoints

The relevant code is clearly commented in `assets/js/main.js` under the submit handler.

## Performance & accessibility notes

- Fonts load via `font-display: swap` (Google Fonts default) to avoid invisible text during load.
- All interactive icons are decorative (`aria-hidden="true"`) where text labels already convey meaning.
- Skip-to-content link, visible focus states, and `prefers-reduced-motion` support are built in.
- Scroll-reveal animations degrade gracefully (content is fully visible) if `IntersectionObserver` isn't supported or motion is reduced.
- Images should be added at the resolutions actually rendered (avoid uploading multi-MB originals); see the placeholder comments in `index.html` for exact dimensions expected.
