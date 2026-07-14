/* ============================================================================
   IDOG SYSTEM — SOURCE REPORT PAGE
   Reads ?source=<id> and builds the whole page from data.js + PASS helpers.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const id = PASS.qs("source");
  const src = PASS.getSource(id);
  const main = document.querySelector(".main");

  if (!src) {
    main.innerHTML =
      '<div class="empty"><strong>Source not found</strong>' +
      '<p>Check the link — try one of the sources in the left-hand menu.</p></div>';
    return;
  }

  const all = PASS.getMessages().filter(function (m) { return m.sourceId === src.id; });
  const stats = PASS.computeStats(all);
  const isReview = src.category === "review";
  const isLocal = src.category === "local";

  document.getElementById("doc-title").textContent = src.name + " | " + window.APP_DATA.restaurant.name;
  document.getElementById("source-title").textContent = src.name;
  document.getElementById("sync-chip").textContent = "Synced " + src.lastSync;

  let profileLine;
  if (isReview) {
    profileLine = src.ratingAvg.toFixed(1) + "\u2605 average across " + src.ratingCount.toLocaleString() + " reviews \u00B7 " +
      src.profileViews.toLocaleString() + " profile views (" + (src.viewsTrendPct >= 0 ? "+" : "") + src.viewsTrendPct + "% this week)";
  } else if (isLocal) {
    profileLine = src.mentionsCount.toLocaleString() + " mentions tracked \u00B7 no reply workflow \u2014 informational only";
  } else {
    profileLine = src.followers.toLocaleString() + " followers (" + (src.followersTrendPct >= 0 ? "+" : "") + src.followersTrendPct + "% this week) \u00B7 " +
      src.engagementRatePct + "% engagement rate";
  }
  document.getElementById("source-meta").textContent =
    ({ review: "Reviews", social: "Social", local: "Local press" })[src.category] + " \u00B7 " + profileLine;

  /* ------------------------------------------------------------------ KPIs */
  const kpis = isLocal
    ? [
        { n: stats.unread, label: "Unread", mod: "mustard", params: { source: src.id, status: "unread" } },
        { n: stats.negative, label: "Negative coverage", mod: "negative", params: { source: src.id, sentiment: "negative" } },
        { n: stats.positive, label: "Positive coverage", mod: "positive", params: { source: src.id, sentiment: "positive" } },
        { n: stats.total, label: "Total mentions", mod: "brand", params: { source: src.id } }
      ]
    : [
        { n: stats.unread, label: "Unread", mod: "mustard", params: { source: src.id, status: "unread" } },
        { n: stats.unanswered, label: "Needs a response", mod: "negative", params: { source: src.id, status: "unanswered" } },
        { n: stats.negative, label: "Negative", mod: "negative", params: { source: src.id, sentiment: "negative" } },
        { n: stats.positive, label: "Positive", mod: "positive", params: { source: src.id, sentiment: "positive" } }
      ];
  document.getElementById("kpi-grid").innerHTML = kpis.map(function (k) {
    return (
      '<a class="kpi-card kpi-card--' + k.mod + '" href="' + PASS.buildUrl("messages.html", k.params) + '">' +
        '<div class="kpi-card__num mono">' + k.n + "</div>" +
        '<div class="kpi-card__label">' + k.label + "</div>" +
        '<div class="kpi-card__trend">View filtered list &rarr;</div>' +
      "</a>"
    );
  }).join("");

  /* ------------------------------------------------------------------ chart */
  document.getElementById("chart-sub").textContent =
    (isReview ? "Reviews received" : isLocal ? "Mentions found" : "Engagements") + " per day, oldest to today";
  renderBarChart(document.getElementById("bar-chart"), src.trend);

  /* -------------------------------------------------------------- recent */
  document.getElementById("view-all-link").textContent = "View all " + stats.total + " \u2192";
  document.getElementById("view-all-link").setAttribute("href", "messages.html?source=" + src.id);

  const recent = all.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); }).slice(0, 5);
  document.getElementById("recent-list").innerHTML = Ticket.renderList(recent);
  Ticket.wire(document.getElementById("recent-list"), function () { window.location.reload(); });

  /* --------------------------------------------------------- chart helper */
  function renderBarChart(svg, values) {
    const w = 560, h = 130, padBottom = 20, padTop = 6, gap = 14;
    const max = Math.max.apply(null, values.concat([1]));
    const barW = (w - gap * (values.length + 1)) / values.length;
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Today"];
    let out = "";
    values.forEach(function (v, i) {
      const barH = ((h - padBottom - padTop) * v) / max;
      const x = gap + i * (barW + gap);
      const y = h - padBottom - barH;
      const isToday = i === values.length - 1;
      out += '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + Math.max(barH, 2) +
        '" rx="3" class="' + (isToday ? "is-today" : "") + '"></rect>';
      out += '<text x="' + (x + barW / 2) + '" y="' + (h - 5) + '" text-anchor="middle">' + labels[i] + "</text>";
    });
    svg.innerHTML = out;
  }
});
