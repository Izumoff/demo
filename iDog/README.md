# iDog system — restaurant SMM & reputation dashboard (demo)

A static, click-through demo of a social-media & review-management tool for a
restaurant owner. Dashboard → per-source report → filtered ticket list, with
an AI-suggested-reply flow on every unanswered review, comment, mention or DM
— plus an Authors directory and a Settings page for connections/notifications.

No build step, no backend — plain HTML/CSS/JS, ready for GitHub Pages.

## Structure

```
index.html              Dashboard — today's KPIs, "needs attention", source grids
source.html?source=ID   One platform's report — stats, 7-day chart, recent tickets
messages.html           Inbox — full filterable ticket list (also reached via
                         ?source=&sentiment=&status=&author= from other pages)
authors.html            Authors — everyone who's reviewed/commented, with
                         per-author stats and its own filter bar
settings.html           Settings — source connections + notification recipients

assets/css/styles.css   All styling (design tokens at the top of the file)
assets/js/data.js       ← THE FILE YOU EDIT. Restaurant, sources, messages,
                         author profiles, notification recipients.
assets/js/utils.js      Shared helpers (dates, icons, stats, authors, settings state)
assets/js/ticket.js     The "ticket" card component + its React/AI/send behavior
assets/js/nav.js        Sidebar/drawer behavior, active link, masthead, theme toggle
assets/js/dashboard.js  Dashboard page logic
assets/js/source.js     Source report page logic
assets/js/messages.js   Inbox / filter-bar logic
assets/js/authors.js    Authors page logic
assets/js/settings.js   Settings page logic
```

Nav order (top to bottom): Dashboard, Inbox, Authors, Reviews (3 sources),
Social (3 sources), Local resources (3 sources), then Settings below a
divider — the first three are cross-platform views, the middle groups are
per-platform drill-downs, and Settings sits apart as configuration rather
than data.

## Preparing a demo

Everything you'd want to change for a specific pitch lives in
**`assets/js/data.js`**. It's one plain JavaScript object:

- `restaurant` — name and address. These populate the masthead line at the
  top of every page's content (below it: the actual page title — "Dashboard",
  "Inbox", a source name, etc.) and every page's browser tab title, in the
  form `<Page> | <restaurant name>`. The sidebar itself only shows the
  product name and a small initials mark — the restaurant's identity lives
  in that masthead line instead, not the sidebar.
- `sources` — one entry per platform, grouped by `category`: `"review"`
  (Google Maps, Yelp, TripAdvisor), `"social"` (Instagram, Facebook, X), or
  `"local"` (local press/directories — Harbor Herald, Marlow Bites, Marlow
  Biz Weekly). Delete or add entries to change what appears in the sidebar
  and on the Settings page. Every source needs a `url` (for each ticket's
  "Go to source" link — a platform homepage is fine) and a `connected`
  flag plus either `tokenMasked` (API-based sources) or `trackingMethod`
  (local press, which is usually monitored rather than pulled via an API) —
  both shown on the Settings page. Each also has a 7-number `trend` array
  for the little bar chart on that source's report page.
- `notificationRecipients` — staff who get alerted, shown on the Settings
  page. Each has `channels` (any of `"email"`/`"sms"`) and `alertOn`
  (`"all"` or `"negative"`). Add as many people as you want — there's no
  fixed limit, just copy an existing entry.
- `authorProfiles` — optional enrichment for the Authors page, keyed by the
  exact `author` string used in a message (e.g. `"Sarah M."`). Not every
  author needs one — the Authors page computes message count, sentiment
  split, and activity dates straight from `messages`, and just layers a
  `joined` date or `reviewerLevel` badge on top when it's available.
- `messages` — every review, comment, mention and DM, in one flat list.
  Copy an existing object and edit the fields; the file has a comment block
  at the top explaining each one. Dashboard counts, source stats, Inbox
  filters, and the Authors directory all recompute automatically from this
  list — you never edit a number by hand. Messages from a `"local"` source
  skip the reply workflow entirely (set `answered: true` on those — there's
  nothing to reply to, just a mention to be aware of). Reusing the same
  `author` string across two or more messages is what makes someone a
  "repeat author" on the Authors page.

Reload the page after editing `data.js` — no build step required.

### Light / dark theme

The toggle at the bottom of the sidebar switches themes instantly and
remembers the choice (`localStorage`, per browser). Light is the default and
follows Stephen Few's data-visualization principles (*Show Me the Numbers*):
a near-neutral, low-chroma surface everywhere that isn't carrying meaning,
with red and green reserved strictly for negative/positive, and gold/amber
for anything pending or unread — no color is used for decoration. Dark
reuses the palette from the very first version of this demo, adapted into
an actual dark surface. Both themes are defined as CSS custom properties at
the top of `styles.css` if you want to adjust either one directly.

### A note on demo state while clicking through

Sending a reply, marking something read, toggling a source's connection on
Settings, or flipping a notification channel — all of it updates
`localStorage`, not `data.js`, so the demo feels real as you click through
without ever touching your source file. This is per-browser only, and
resets with the **"Reset demo data"** link at the bottom of the sidebar (or
by clearing site data / using a private window) — handy to do right before
a live demo so it starts from a clean slate.

## Publishing to GitHub Pages

1. Create a new repo (or a folder in an existing one) and copy all the files
   in this project into it, keeping the folder structure above.
2. Commit and push:
   ```
   git init
   git add .
   git commit -m "iDog system demo"
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

- Filters on the Inbox page (source, sentiment, read, reply status, plus an
  author filter reached only via a link from the Authors page) update the
  URL live, so any filtered view is a shareable/bookmarkable link — that's
  also how the KPI and stat cards link into pre-filtered lists.
- "Regenerate" on the AI panel cycles between two pre-written reply drafts
  per message (`aiReplyOptions` in data.js) rather than calling a real model
  — enough to demo the interaction without wiring up an API key.
- "Go to source" on every ticket opens that platform's real homepage in a
  new tab. The three local-press sources use `.example` placeholder domains
  (reserved for exactly this by RFC 2606) since they're fictional
  publications invented for the demo.
- The Authors page footer lists a few ideas that would need real backend
  work to go further: matching the same person across platforms, sentiment
  trend per author over time, and flagging likely brand ambassadors by
  reach and repeat-visit frequency.
- The per-source icons are simple generic glyphs (pin, star, camera, etc.),
  not the platforms' actual logos, to keep the demo free of trademarked
  marks — swap in real logos later if this becomes a real product.
