/* ============================================================================
   THE PASS — DASHBOARD PAGE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const messages = PASS.getMessages();
  const stats = PASS.computeStats(messages);
  const sources = PASS.getSources();

  document.getElementById("page-meta").textContent =
    stats.avgRating != null
      ? window.APP_DATA.restaurant.address + " \u00B7 " + stats.avgRating.toFixed(1) + "\u2605 average across " + stats.ratingCount + " reviews"
      : window.APP_DATA.restaurant.address;

  /* ------------------------------------------------------------- KPIs */
  const kpis = [
    { n: stats.unread, label: "Unread messages", mod: "mustard", params: { status: "unread" } },
    { n: stats.unanswered, label: "Needs a response", mod: "negative", params: { status: "unanswered" } },
    { n: stats.negative, label: "Negative sentiment", mod: "negative", params: { sentiment: "negative" } },
    { n: stats.positive, label: "Positive sentiment", mod: "positive", params: { sentiment: "positive" } }
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

  /* ---------------------------------------------------- needs attention */
  const attention = messages
    .filter(function (m) { return !m.answered; })
    .sort(function (a, b) {
      // negative + unread first, then by recency
      const weight = function (m) { return (m.sentiment === "negative" ? 2 : 0) + (!m.read ? 1 : 0); };
      return weight(b) - weight(a) || new Date(b.date) - new Date(a.date);
    })
    .slice(0, 3);
  document.getElementById("attention-list").innerHTML = Ticket.renderList(attention);
  Ticket.wire(document.getElementById("attention-list"), function () { window.location.reload(); });

  /* -------------------------------------------------------- source grids */
  function sourceCardHtml(src) {
    const own = messages.filter(function (m) { return m.sourceId === src.id; });
    const s = PASS.computeStats(own);
    const total = s.total || 1;
    const newCount = own.filter(function (m) { return !m.read; }).length;

    let statRowHtml;
    if (src.category === "review") {
      statRowHtml =
        PASS.stars(Math.round(src.ratingAvg)) + '<span class="source-card__rating">' + src.ratingAvg.toFixed(1) + "</span>";
    } else if (src.category === "social") {
      statRowHtml =
        "<span>" + src.followers.toLocaleString() + " followers</span>" +
        '<span class="source-card__rating">' + (src.followersTrendPct >= 0 ? "+" : "") + src.followersTrendPct + "%</span>";
    } else {
      statRowHtml =
        "<span>" + src.mentionsCount.toLocaleString() + " mentions tracked</span>" +
        '<span class="source-card__rating">synced ' + src.lastSync + "</span>";
    }

    return (
      '<a class="source-card" href="source.html?source=' + src.id + '">' +
        (newCount ? '<span class="source-card__new">+' + newCount + " new</span>" : "") +
        '<div class="source-card__top">' +
          '<div class="source-card__icon">' + PASS.sourceIcon(src.icon) + "</div>" +
          "<div>" +
            '<div class="source-card__name">' + src.name + "</div>" +
            '<div class="source-card__cat">' + ({ review: "Reviews", social: "Social", local: "Local press" })[src.category] + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="source-card__stat-row">' + statRowHtml + "</div>" +
        '<div class="source-card__bar">' +
          '<span class="pos" style="width:' + (100 * s.positive / total) + '%"></span>' +
          '<span class="neu" style="width:' + (100 * s.neutral / total) + '%"></span>' +
          '<span class="neg" style="width:' + (100 * s.negative / total) + '%"></span>' +
        "</div>" +
        '<div class="source-card__legend">' +
          '<span class="l-pos">' + s.positive + " positive</span>" +
          '<span class="l-neg">' + s.negative + " negative</span>" +
        "</div>" +
      "</a>"
    );
  }

  document.getElementById("reviews-grid").innerHTML = sources.filter(function (s) { return s.category === "review"; }).map(sourceCardHtml).join("");
  document.getElementById("social-grid").innerHTML = sources.filter(function (s) { return s.category === "social"; }).map(sourceCardHtml).join("");
  document.getElementById("local-grid").innerHTML = sources.filter(function (s) { return s.category === "local"; }).map(sourceCardHtml).join("");
});
