/* ============================================================================
   IDOG SYSTEM — NAV BEHAVIOR
   The nav markup itself lives in each HTML page (so every page works
   standalone with no templating step). This file just wires it up:
   mobile drawer open/close, active-link highlighting, and the small
   live counts next to "Inbox" and each source link.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // Restaurant initials in the sidebar/topbar brand chip, and the
  // name+address masthead row at the top of the page content, both come
  // from data.js rather than hardcoded markup.
  const restaurant = window.APP_DATA && window.APP_DATA.restaurant;
  if (restaurant) {
    document.querySelectorAll(".brand__mark").forEach(function (el) { el.textContent = restaurant.initials; });
    document.querySelectorAll(".masthead__name").forEach(function (el) { el.textContent = restaurant.name; });
    document.querySelectorAll(".masthead__address").forEach(function (el) { el.textContent = restaurant.address; });
  }

  const drawer = document.querySelector(".sidebar");
  const scrim = document.querySelector(".nav-scrim");
  const openBtn = document.querySelector(".js-open-nav");
  const closeBtn = document.querySelector(".js-close-nav");

  function openDrawer() {
    drawer.classList.add("is-open");
    scrim.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }
  function closeDrawer() {
    drawer.classList.remove("is-open");
    scrim.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }
  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (scrim) scrim.addEventListener("click", closeDrawer);

  // Active link: match on filename + source query param.
  const path = window.location.pathname.split("/").pop() || "index.html";
  const sourceParam = PASS.qs("source");
  document.querySelectorAll(".nav-link").forEach(function (link) {
    const linkUrl = new URL(link.getAttribute("href"), window.location.href);
    const linkPath = linkUrl.pathname.split("/").pop() || "index.html";
    const linkSource = linkUrl.searchParams.get("source");
    const matches = linkPath === path && (linkSource || null) === (sourceParam || null);
    if (matches) link.classList.add("is-active");
  });

  // Live counts.
  const messages = PASS.getMessages();
  const inboxBadge = document.querySelector('[data-badge="inbox"]');
  if (inboxBadge) {
    const needsReply = messages.filter(function (m) { return !m.answered; }).length;
    inboxBadge.textContent = needsReply;
    inboxBadge.hidden = needsReply === 0;
  }
  document.querySelectorAll("[data-badge-source]").forEach(function (el) {
    const id = el.getAttribute("data-badge-source");
    const count = messages.filter(function (m) { return m.sourceId === id && !m.read; }).length;
    el.textContent = count;
    el.hidden = count === 0;
  });

  const resetBtn = document.querySelector(".js-reset-demo");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      PASS.resetOverrides();
      window.location.reload();
    });
  }

  /* -------------------------------------------------------------- theme */
  const THEME_KEY = "the-pass-theme";
  const themeBtn = document.querySelector(".js-theme-toggle");
  if (themeBtn) {
    function paintThemeButton(theme) {
      const isDark = theme === "dark";
      themeBtn.innerHTML =
        (isDark
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>'
        ) +
        "<span>" + (isDark ? "Light mode" : "Dark mode") + "</span>";
    }
    paintThemeButton(document.documentElement.getAttribute("data-theme") || "light");
    themeBtn.addEventListener("click", function () {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      paintThemeButton(next);
    });
  }
});
