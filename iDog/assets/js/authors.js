/* ============================================================================
   IDOG SYSTEM — AUTHORS PAGE
   Aggregates every message by (author + source) via PASS.getAuthors() and
   lets the owner filter/sort that list. No new data.js entries are required
   for an author to show up here — it's all computed from MESSAGES.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  document.title = "Authors | " + window.APP_DATA.restaurant.name;

  const sourceSel = document.getElementById("a-source");
  const activitySel = document.getElementById("a-activity");
  const sentimentSel = document.getElementById("a-sentiment");
  const sortSel = document.getElementById("a-sort");
  const list = document.getElementById("author-list");
  const count = document.getElementById("author-count");
  const filterBar = document.querySelector(".filter-bar");

  // A single author can be focused via ?author=Name (from clicking an
  // author's name on a ticket). It's shown as a removable chip rather than a
  // dropdown, since it's a link-in from elsewhere — same pattern as the Inbox.
  let authorFocus = PASS.qs("author") || "";

  PASS.getSources().forEach(function (s) {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    sourceSel.appendChild(opt);
  });

  function renderAuthorChip() {
    const existing = document.getElementById("author-focus-chip");
    if (existing) existing.remove();
    if (!authorFocus) return;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.id = "author-focus-chip";
    chip.innerHTML = "Author: " + PASS.escapeHtml(authorFocus) + ' <button type="button" aria-label="Clear author filter">&times;</button>';
    chip.querySelector("button").addEventListener("click", function () {
      authorFocus = "";
      history.replaceState(null, "", "authors.html");
      render();
    });
    filterBar.appendChild(chip);
  }

  function initials(name) {
    const cleaned = name.replace(/^@/, "").trim();
    const parts = cleaned.split(/[\s._]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return cleaned.slice(0, 2).toUpperCase();
  }

  function leaning(a) {
    if (a.positive > a.negative && a.positive >= a.neutral) return "positive";
    if (a.negative > a.positive && a.negative >= a.neutral) return "negative";
    return "mixed";
  }

  function formatDateShort(iso) {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function renderCard(a) {
    const src = PASS.getSource(a.sourceId);
    const lean = leaning(a);
    const leanLabel = lean === "positive" ? "Mostly positive" : lean === "negative" ? "Mostly negative" : "Mixed / neutral";
    const leanPillClass = lean === "positive" ? "pill--positive" : lean === "negative" ? "pill--negative" : "pill--neutral";
    const replyRate = a.messageCount ? Math.round((a.answered / a.messageCount) * 100) : 0;

    const metaBits = [src.name];
    if (a.authorMeta) metaBits.push(a.authorMeta);
    if (a.profile && a.profile.reviewerLevel) metaBits.push(a.profile.reviewerLevel);
    if (a.profile && a.profile.joined) metaBits.push("joined " + new Date(a.profile.joined).getFullYear());

    const stats = [
      { num: a.messageCount, label: a.messageCount === 1 ? "Message" : "Messages" },
      { num: a.avgRatingGiven != null ? a.avgRatingGiven.toFixed(1) + "\u2605" : "\u2014", label: "Avg rating given" },
      { num: replyRate + "%", label: "Reply rate" },
      { num: a.firstDate === a.lastDate ? formatDateShort(a.lastDate) : formatDateShort(a.firstDate) + " \u2013 " + formatDateShort(a.lastDate), label: "Active window" }
    ];

    return (
      '<article class="author-card">' +
        '<div class="author-card__top">' +
          '<div class="author-card__avatar">' + PASS.escapeHtml(initials(a.author)) + "</div>" +
          "<div>" +
            '<div class="author-card__name">' + PASS.escapeHtml(a.author) + "</div>" +
            '<div class="author-card__meta">' + metaBits.map(PASS.escapeHtml).join(" &middot; ") + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="author-card__badges">' +
          '<span class="pill ' + leanPillClass + '">' + leanLabel + "</span>" +
          (a.messageCount > 1 ? '<span class="pill pill--unread">Repeat author</span>' : "") +
        "</div>" +
        '<div class="author-card__stats">' +
          stats.map(function (s) {
            return '<div><div class="author-stat__num">' + s.num + '</div><div class="author-stat__label">' + s.label + "</div></div>";
          }).join("") +
        "</div>" +
        '<a class="btn btn--ghost btn--sm" href="messages.html?author=' + encodeURIComponent(a.author) + '">View their messages</a>' +
      "</article>"
    );
  }

  function render() {
    const sourceVal = sourceSel.value;
    const activityVal = activitySel.value;
    const sentimentVal = sentimentSel.value;
    const sortVal = sortSel.value;

    let authors = PASS.getAuthors().filter(function (a) {
      if (authorFocus && a.author !== authorFocus) return false;
      if (sourceVal && a.sourceId !== sourceVal) return false;
      if (activityVal === "repeat" && a.messageCount <= 1) return false;
      if (sentimentVal && leaning(a) !== sentimentVal) return false;
      return true;
    });

    if (sortVal === "frequent") {
      authors.sort(function (a, b) { return b.messageCount - a.messageCount; });
    } else if (sortVal === "name") {
      authors.sort(function (a, b) { return a.author.localeCompare(b.author); });
    } else {
      authors.sort(function (a, b) { return new Date(b.lastDate) - new Date(a.lastDate); });
    }

    count.textContent = authors.length + (authors.length === 1 ? " author" : " authors");
    list.innerHTML = authors.length
      ? '<div class="author-list">' + authors.map(renderCard).join("") + "</div>"
      : '<div class="empty"><strong>No authors match these filters</strong><p>Try widening the filters above.</p></div>';
    renderAuthorChip();
  }

  [sourceSel, activitySel, sentimentSel, sortSel].forEach(function (el) {
    el.addEventListener("change", render);
  });

  render();
});
