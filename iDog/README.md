# The Pass — restaurant SMM & reputation dashboard (demo)

A static, click-through demo of a social-media & review-management tool for a
restaurant owner. Dashboard → per-source report → filtered ticket list, with
an AI-suggested-reply flow on every unanswered review, comment, mention or DM.

No build step, no backend — plain HTML/CSS/JS, ready for GitHub Pages.

## Structure

```
index.html              Dashboard — today's KPIs, "needs attention", source grids
source.html?source=ID   One platform's report — stats, 7-day chart, recent tickets
messages.html           Inbox — full filterable ticket list (also reached via
                         ?source=&sentiment=&status= from the pages above)

assets/css/styles.css   All styling (design tokens at the top of the file)
assets/js/data.js       ← THE FILE YOU EDIT. Restaurant info, sources, messages.
assets/js/utils.js      Shared helpers (dates, icons, stats, URL params)
assets/js/ticket.js     The "ticket" card component + its React/AI/send behavior
assets/js/nav.js        Sidebar/drawer behavior, active link, live badge counts
assets/js/dashboard.js  Dashboard page logic
assets/js/source.js     Source report page logic
assets/js/messages.js   Inbox / filter-bar logic
```

## Preparing a demo

Everything you'd want to change for a specific pitch lives in
**`assets/js/data.js`**. It's one plain JavaScript object:

- `restaurant` — name, tagline, address shown in the sidebar and dashboard.
- `sources` — one entry per platform, grouped by `category`: `"review"`
  (Google Maps, Yelp, TripAdvisor), `"social"` (Instagram, Facebook, X), or
  `"local"` (local press/directories — Harbor Herald, Marlow Bites, Marlow
  Biz Weekly). Delete or add entries to change what appears in the sidebar.
  Every source needs a `url` — that's what the "Go to source" link on each
  ticket opens (a platform homepage is fine, per-post links aren't required).
  Each has a 7-number `trend` array that drives the little bar chart on
  that source's report page.
- `messages` — every review, comment, mention and DM, in one flat list.
  Copy an existing object and edit the fields; the file has a comment block
  at the top explaining each one. Dashboard counts, source stats and the
  Inbox filters all recompute automatically from this list — you never edit
  a number by hand. Messages from a `"local"` source skip the reply
  workflow entirely (set `answered: true` on those — there's nothing to
  reply to, just a mention to be aware of).

Reload the page after editing `data.js` — no build step required.

### Light / dark theme

The toggle at the bottom of the sidebar switches themes instantly and
remembers the choice (`localStorage`, per browser). Light is the default and
follows Stephen Few's data-visualization principles (*Show Me the Numbers*):
a near-neutral, low-chroma surface everywhere that isn't carrying meaning,
with red and green reserved strictly for negative/positive — no color is
used for decoration. Dark reuses the palette from the very first version of
this demo, adapted into an actual dark surface. Both themes are defined as
CSS custom properties at the top of `styles.css` if you want to adjust
either one directly.

### A note on "read/answered" state while demoing

Clicking **React → Send reply** (or opening a ticket) updates that ticket's
state in the browser's `localStorage`, so the demo feels real as you click
through. This is per-browser only, doesn't touch `data.js`, and resets with
the **"Reset demo data"** link at the bottom of the sidebar (or by clearing
site data / using a private window) — handy to do right before a live demo
so it starts from a clean slate.

## Publishing to GitHub Pages

1. Create a new repo (or a folder in an existing one) and copy all the files
   in this project into it, keeping the folder structure above.
2. Commit and push:
   ```
   git init
   git add .
   git commit -m "The Pass demo"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → Deploy from a branch**, pick
   `main` and the root folder (`/`) — or `/the-pass` etc. if you put it in a
   subfolder of an existing repo (matching how your `iDog` demo is served
   from `/demo/iDog/`).
4. Your demo will be live at
   `https://<you>.github.io/<repo>/` (or `.../<repo>/<subfolder>/`).

All links in the project are relative, so it works the same whether it's
served from the repo root or a subfolder — no path edits needed either way.

## Notes / things you may want to extend later

- Filters on the Inbox page (source, sentiment, read, reply status) update
  the URL live, so any filtered view is a shareable/bookmarkable link —
  that's also how the KPI and stat cards link into pre-filtered lists.
- "Regenerate" on the AI panel cycles between two pre-written reply drafts
  per message (`aiReplyOptions` in data.js) rather than calling a real model
  — enough to demo the interaction without wiring up an API key.
- "Go to source" on every ticket opens that platform's real homepage in a
  new tab. The three local-press sources use `.example` placeholder domains
  (reserved for exactly this by RFC 2606) since they're fictional
  publications invented for the demo.
- The per-source icons are simple generic glyphs (pin, star, camera, etc.),
  not the platforms' actual logos, to keep the demo free of trademarked
  marks — swap in real logos later if this becomes a real product.
