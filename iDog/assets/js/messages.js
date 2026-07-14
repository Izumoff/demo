/* ============================================================================
   IDOG SYSTEM — INBOX / FILTERED MESSAGE LIST
   Reads ?source= &sentiment= &status= (unread|read|unanswered|answered) from
   the URL, pre-sets the filter bar, and keeps the URL in sync (via
   history.replaceState) as filters change so links stay shareable.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  document.title = "Inbox | " + window.APP_DATA.restaurant.name;

  const sourceSel = document.getElementById("f-source");
  const sentimentSel = document.getElementById("f-sentiment");
  const readSel = document.getElementById("f-read");
  const answeredSel = document.getElementById("f-answered");
  const container = document.getElementById("ticket-container");
  const filterBar = document.querySelector(".filter-bar");

  // Author isn't a dropdown in the filter bar — it only arrives via a link
  // from the Authors page (?author=Name), shown as a removable chip instead.
  let authorFilter = PASS.qs("author") || "";

  PASS.getSources().forEach(function (s) {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    sourceSel.appendChild(opt);
  });

  // The dashboard/source KPI cards both use ?status=, but mean different
  // things (unread/read vs. unanswered/answered) — route it to the right select.
  const statusParam = PASS.qs("status");
  sourceSel.value = PASS.qs("source") || "";
  sentimentSel.value = PASS.qs("sentiment") || "";
  readSel.value = statusParam === "unread" || statusParam === "read" ? statusParam : "";
  answeredSel.value = statusParam === "unanswered" || statusParam === "answered" ? statusParam : "";

  function currentFilters() {
    return {
      source: sourceSel.value,
      sentiment: sentimentSel.value,
      read: readSel.value,
      answered: answeredSel.value,
      author: authorFilter
    };
  }

  function renderAuthorChip() {
    const existing = document.getElementById("author-chip");
    if (existing) existing.remove();
    if (!authorFilter) return;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.id = "author-chip";
    chip.innerHTML = "Author: " + PASS.escapeHtml(authorFilter) + ' <button type="button" aria-label="Clear author filter">&times;</button>';
    chip.querySelector("button").addEventListener("click", function () {
      authorFilter = "";
      render();
    });
    filterBar.appendChild(chip);
  }

  function titleFor(f, count) {
    if (!f.source && !f.sentiment && !f.read && !f.answered && !f.author) return "Inbox";
    const src = f.source ? PASS.getSource(f.source).name : "All sources";
    const bits = [];
    if (f.author) bits.push("from " + f.author);
    if (f.sentiment) bits.push(PASS.sentimentLabel(f.sentiment).toLowerCase());
    if (f.read === "unread") bits.push("unread");
    if (f.read === "read") bits.push("read");
    if (f.answered === "unanswered") bits.push("awaiting reply");
    if (f.answered === "answered") bits.push("answered");
    return (f.source ? src : "Inbox") + (bits.length ? " \u2014 " + bits.join(", ") : "");
  }

  function render() {
    const f = currentFilters();
    const filtered = PASS.getMessages().filter(function (m) {
      if (f.source && m.sourceId !== f.source) return false;
      if (f.sentiment && m.sentiment !== f.sentiment) return false;
      if (f.read === "unread" && m.read) return false;
      if (f.read === "read" && !m.read) return false;
      if (f.answered === "unanswered" && m.answered) return false;
      if (f.answered === "answered" && !m.answered) return false;
      if (f.author && m.author !== f.author) return false;
      return true;
    }).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

    document.getElementById("inbox-title").textContent = titleFor(f, filtered.length);
    document.getElementById("inbox-meta").textContent =
      filtered.length + (filtered.length === 1 ? " ticket" : " tickets") + " matching the current filters";
    document.getElementById("result-count").textContent = filtered.length + " shown";
    container.innerHTML = Ticket.renderList(filtered);
    renderAuthorChip();

    const url = PASS.buildUrl("messages.html", {
      source: f.source, sentiment: f.sentiment,
      status: f.read || f.answered || "",
      author: f.author
    });
    history.replaceState(null, "", url);
  }

  [sourceSel, sentimentSel, readSel, answeredSel].forEach(function (el) {
    el.addEventListener("change", function () {
      // Selecting a read-state or reply-state clears the other, since the
      // URL only carries one "status" — keeps the filter bar unambiguous.
      if (el === readSel && readSel.value) answeredSel.value = "";
      if (el === answeredSel && answeredSel.value) readSel.value = "";
      render();
    });
  });

  Ticket.wire(container, render);
  render();
});
