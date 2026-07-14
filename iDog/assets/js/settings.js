/* ============================================================================
   IDOG SYSTEM — SETTINGS PAGE
   Source connection status and notification recipients. Toggles here persist
   to localStorage for the demo session (see PASS.updateSourceConnected /
   PASS.updateRecipient in utils.js) — "Reset demo data" clears them too.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  document.title = "Settings | " + window.APP_DATA.restaurant.name;

  const sourcesList = document.getElementById("sources-list");
  const recipientsBody = document.getElementById("recipients-body");

  function renderSources() {
    const sources = PASS.getSources();
    sourcesList.innerHTML = sources.map(function (src) {
      const connected = PASS.getSourceConnected(src.id, src.connected);
      const credential = src.tokenMasked
        ? '<span class="settings-row__token">' + PASS.escapeHtml(src.tokenMasked) + "</span>"
        : '<span class="settings-row__token">' + PASS.escapeHtml(src.trackingMethod || "") + "</span>";
      const categoryLabel = ({ review: "Review platform", social: "Social platform", local: "Local press" })[src.category];
      return (
        '<div class="settings-row" data-id="' + src.id + '">' +
          '<div class="settings-row__icon">' + PASS.sourceIcon(src.icon) + "</div>" +
          '<div class="settings-row__main">' +
            '<div class="settings-row__name">' + src.name + "</div>" +
            '<div class="settings-row__sub">' + categoryLabel + " &middot; last synced " + src.lastSync + "</div>" +
          "</div>" +
          credential +
          '<span class="settings-row__status ' + (connected ? "is-connected" : "is-disconnected") + '">' + (connected ? "Connected" : "Disconnected") + "</span>" +
          '<button type="button" class="btn btn--ghost btn--sm js-toggle-connection">' + (connected ? "Disconnect" : "Reconnect") + "</button>" +
        "</div>"
      );
    }).join("");
  }

  function renderRecipients() {
    const recipients = PASS.getRecipients();
    recipientsBody.innerHTML = recipients.map(function (r) {
      const alertLabel = r.alertOn === "all" ? "All activity" : "Negative only";
      return (
        '<tr data-id="' + r.id + '">' +
          "<td>" +
            '<div class="recipient-name">' + PASS.escapeHtml(r.name) + "</div>" +
            '<div class="recipient-role">' + PASS.escapeHtml(r.role) + "</div>" +
          "</td>" +
          "<td>" + PASS.escapeHtml(r.email) + "<br>" + PASS.escapeHtml(r.phone) + "</td>" +
          "<td>" + alertLabel + "</td>" +
          "<td><label class=\"channel-toggle\"><input type=\"checkbox\" class=\"js-channel\" data-channel=\"email\" " + (r.channels.indexOf("email") > -1 ? "checked" : "") + "></label></td>" +
          "<td><label class=\"channel-toggle\"><input type=\"checkbox\" class=\"js-channel\" data-channel=\"sms\" " + (r.channels.indexOf("sms") > -1 ? "checked" : "") + "></label></td>" +
        "</tr>"
      );
    }).join("");
  }

  sourcesList.addEventListener("click", function (e) {
    const btn = e.target.closest(".js-toggle-connection");
    if (!btn) return;
    const row = e.target.closest(".settings-row");
    const id = row.getAttribute("data-id");
    const src = PASS.getSource(id);
    const current = PASS.getSourceConnected(id, src.connected);
    PASS.updateSourceConnected(id, !current);
    renderSources();
  });

  recipientsBody.addEventListener("change", function (e) {
    if (!e.target.classList.contains("js-channel")) return;
    const row = e.target.closest("tr");
    const id = row.getAttribute("data-id");
    const recipient = PASS.getRecipients().find(function (r) { return r.id === id; });
    const channel = e.target.getAttribute("data-channel");
    let channels = recipient.channels.slice();
    if (e.target.checked && channels.indexOf(channel) === -1) channels.push(channel);
    if (!e.target.checked) channels = channels.filter(function (c) { return c !== channel; });
    PASS.updateRecipient(id, { channels: channels });
  });

  renderSources();
  renderRecipients();
});
