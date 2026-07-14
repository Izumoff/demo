/* ============================================================================
   IDOG SYSTEM — TICKET CARD
   One component, reused on the Dashboard ("needs attention" preview), each
   Source Report ("recent tickets" preview) and the Inbox / filtered list.
   Renders a message as a "ticket" and wires up React / AI-suggestion /
   allow-AI-to-reply / send behavior via event delegation.
   ========================================================================== */

const Ticket = (function () {

  function iconSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>';
  }
  function sendSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-8-6 16-3-6-7-2z"/></svg>';
  }
  function refreshSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.5 9A7 7 0 0 1 19 8.5M18.5 15A7 7 0 0 1 5 15.5"/></svg>';
  }
  function externalSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/><path d="M14 4h6v6"/><path d="M10 14L20 4"/></svg>';
  }

  // Renders one ticket <article>. `msg` should already include current
  // read/answered/allowAiAutoReply state (i.e. from PASS.getMessages()).
  function render(msg) {
    const src = PASS.getSource(msg.sourceId);
    const isLocal = src.category === "local";
    const starsHtml = typeof msg.rating === "number" ? PASS.stars(msg.rating) : "";

    const sourceLinkHtml = src.url
      ? '<a class="btn btn--ghost btn--sm" href="' + src.url + '" target="_blank" rel="noopener noreferrer">' +
          externalSvg() + " Go to source</a>"
      : "";

    let footHtml;
    if (isLocal) {
      // Press/local mentions: nothing to answer, just a link back to the source.
      footHtml = '<div class="ticket__foot">' + sourceLinkHtml + "</div>";
    } else if (msg.answered) {
      footHtml =
        '<div class="ticket__sent">' +
          '<span class="eyebrow">Reply sent</span>' +
          PASS.escapeHtml(msg.sentReply || "") +
        "</div>" +
        '<div class="ticket__foot">' + sourceLinkHtml + "</div>";
    } else {
      const options = msg.aiReplyOptions && msg.aiReplyOptions.length ? msg.aiReplyOptions : ["Thanks so much for the feedback — we'll take a close look."];
      footHtml =
        '<div class="ticket__foot">' +
          '<button type="button" class="btn btn--primary js-react-toggle">' + iconSvg() + " React</button>" +
          sourceLinkHtml +
        "</div>" +
        '<div class="react-panel" hidden data-options=\'' + PASS.escapeHtml(JSON.stringify(options)) + '\' data-idx="0">' +
          '<div class="react-panel__label eyebrow">' + iconSvg() + " AI-suggested reply</div>" +
          '<textarea class="js-reply-text" rows="3">' + PASS.escapeHtml(options[0]) + "</textarea>" +
          '<div class="react-panel__actions">' +
            '<label class="checkbox-row"><input type="checkbox" class="js-allow-ai" ' + (msg.allowAiAutoReply ? "checked" : "") + '> Allow AI to send replies like this automatically</label>' +
            '<div class="react-panel__buttons">' +
              '<button type="button" class="btn btn--ghost btn--sm js-regenerate">' + refreshSvg() + " Regenerate</button>" +
              '<button type="button" class="btn btn--primary btn--sm js-send-reply">' + sendSvg() + " Send reply</button>" +
            "</div>" +
          "</div>" +
        "</div>";
    }

    const statusPills =
      '<span class="pill pill--' + msg.sentiment + '">' + PASS.sentimentLabel(msg.sentiment) + "</span>" +
      '<span class="pill pill--' + (msg.read ? "read" : "unread") + '">' + (msg.read ? "Read" : "Unread") + "</span>" +
      (isLocal ? "" : '<span class="pill pill--' + (msg.answered ? "answered" : "unanswered") + '">' + (msg.answered ? "Answered" : "Awaiting reply") + "</span>");

    return (
      '<article class="ticket" data-id="' + msg.id + '">' +
        '<div class="ticket__head">' +
          '<div class="ticket__src-icon">' + PASS.sourceIcon(src.icon) + "</div>" +
          '<div class="ticket__head-info">' +
            '<div class="ticket__src-name">' + src.name + "</div>" +
            '<div class="ticket__meta">' + PASS.typeLabel(msg.type) + " &middot; " + PASS.relativeDate(msg.date) + " &middot; " + PASS.timeOfDay(msg.date) + "</div>" +
          "</div>" +
          starsHtml +
        "</div>" +
        '<div class="ticket__perf"></div>' +
        '<div class="ticket__body">' +
          '<p class="ticket__text">' + PASS.escapeHtml(msg.text) + "</p>" +
          '<div class="ticket__author"><a class="ticket__author-link" href="authors.html?author=' + encodeURIComponent(msg.author) + '">' + PASS.escapeHtml(msg.author) + "</a> &middot; " + PASS.escapeHtml(msg.authorMeta) + "</div>" +
        "</div>" +
        '<div class="ticket__status-row">' + statusPills + "</div>" +
        footHtml +
      "</article>"
    );
  }

  function renderList(messages) {
    if (!messages.length) {
      return (
        '<div class="empty">' + iconSvg() +
          "<strong>No tickets match these filters</strong>" +
          "<p>Try widening the filters above — nothing on the pass right now.</p>" +
        "</div>"
      );
    }
    return '<div class="ticket-list">' + messages.map(render).join("") + "</div>";
  }

  // Event delegation: call this once per container that holds rendered
  // tickets. Re-render the container's HTML any time the underlying data
  // changes (the handlers below take care of that).
  function wire(container, onChange) {
    container.addEventListener("click", function (e) {
      const article = e.target.closest(".ticket");
      if (!article) return;
      const id = article.getAttribute("data-id");

      if (e.target.closest(".js-react-toggle")) {
        const panel = article.querySelector(".react-panel");
        const wasHidden = panel.hasAttribute("hidden");
        panel.toggleAttribute("hidden");
        const msg = PASS.getMessages().find(function (m) { return m.id === id; });
        if (wasHidden && msg && !msg.read) {
          PASS.updateMessage(id, { read: true });
          const unreadPill = article.querySelector(".pill--unread");
          if (unreadPill) {
            unreadPill.classList.remove("pill--unread");
            unreadPill.classList.add("pill--read");
            unreadPill.textContent = "Read";
          }
        }
        return;
      }

      if (e.target.closest(".js-regenerate")) {
        const panel = article.querySelector(".react-panel");
        const options = JSON.parse(panel.getAttribute("data-options"));
        let idx = (parseInt(panel.getAttribute("data-idx"), 10) + 1) % options.length;
        panel.setAttribute("data-idx", idx);
        panel.querySelector(".js-reply-text").value = options[idx];
        return;
      }

      if (e.target.closest(".js-send-reply")) {
        const text = article.querySelector(".js-reply-text").value.trim();
        PASS.updateMessage(id, { answered: true, read: true, sentReply: text });
        if (typeof onChange === "function") onChange();
        return;
      }
    });

    container.addEventListener("change", function (e) {
      if (e.target.classList.contains("js-allow-ai")) {
        const article = e.target.closest(".ticket");
        const id = article.getAttribute("data-id");
        PASS.updateMessage(id, { allowAiAutoReply: e.target.checked });
      }
    });
  }

  return { render: render, renderList: renderList, wire: wire };
})();
