/* ============================================================================
   IDOG SYSTEM — SHARED UTILITIES
   Used by dashboard.js, source.js and messages.js. No need to edit this file
   to change demo content — see data.js for that.
   ========================================================================== */

const PASS = (function () {

  const STORAGE_KEY = "the-pass-demo-overrides-v1";
  const SETTINGS_KEY = "the-pass-settings-overrides-v1";

  /* ---------------------------------------------------------------- state */

  function loadOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveOverrides(overrides) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) { /* demo mode: fail silently if storage is unavailable */ }
  }

  function loadSettingsOverrides() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveSettingsOverrides(o) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(o));
    } catch (e) { /* demo mode: fail silently if storage is unavailable */ }
  }

  function resetOverrides() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    } catch (e) {}
  }

  // Merge base data.js messages with any in-session overrides (read/answered/
  // allowAiAutoReply/sentReply changes made while clicking through the demo).
  function getMessages() {
    const overrides = loadOverrides();
    return window.APP_DATA.messages.map(function (m) {
      return overrides[m.id] ? Object.assign({}, m, overrides[m.id]) : m;
    });
  }

  function updateMessage(id, patch) {
    const overrides = loadOverrides();
    overrides[id] = Object.assign({}, overrides[id], patch);
    saveOverrides(overrides);
  }

  function getSources() {
    return window.APP_DATA.sources;
  }

  function getSource(id) {
    return window.APP_DATA.sources.find(function (s) { return s.id === id; });
  }

  /* --------------------------------------------------------- settings state */

  // Notification recipients (data.js defaults, overridden by channel-toggle
  // clicks made on the Settings page — same in-session-only pattern as
  // message overrides above).
  function getRecipients() {
    const overrides = loadSettingsOverrides().recipients || {};
    return (window.APP_DATA.notificationRecipients || []).map(function (r) {
      return overrides[r.id] ? Object.assign({}, r, overrides[r.id]) : r;
    });
  }

  function updateRecipient(id, patch) {
    const o = loadSettingsOverrides();
    o.recipients = o.recipients || {};
    o.recipients[id] = Object.assign({}, o.recipients[id], patch);
    saveSettingsOverrides(o);
  }

  // Source connected/disconnected toggle, same override pattern.
  function getSourceConnected(sourceId, defaultVal) {
    const sc = loadSettingsOverrides().sourceConnected || {};
    return Object.prototype.hasOwnProperty.call(sc, sourceId) ? sc[sourceId] : defaultVal;
  }

  function updateSourceConnected(sourceId, connected) {
    const o = loadSettingsOverrides();
    o.sourceConnected = o.sourceConnected || {};
    o.sourceConnected[sourceId] = connected;
    saveSettingsOverrides(o);
  }

  /* ------------------------------------------------------------- authors */

  // Pulls a leading count out of an authorMeta string like "143 local
  // reviews" (-> 143) or "5.1k followers" (-> 5100). Returns null when the
  // string doesn't start with a number (e.g. "commented on your post").
  function parseAuthorMetaCount(str) {
    if (!str) return null;
    const m = String(str).match(/^([\d.]+)(k)?\b/i);
    if (!m) return null;
    let n = parseFloat(m[1]);
    if (isNaN(n)) return null;
    if (m[2]) n *= 1000;
    return Math.round(n);
  }

  // Groups every message by (author + source) and computes the stats an
  // owner would care about: how often they write, sentiment split, average
  // rating they've given, reply rate, and any profile enrichment available
  // in data.js's authorProfiles.
  function getAuthors() {
    const messages = getMessages();
    const groups = {};
    messages.forEach(function (m) {
      const key = m.author + "::" + m.sourceId;
      if (!groups[key]) groups[key] = { author: m.author, sourceId: m.sourceId, list: [] };
      groups[key].list.push(m);
    });
    return Object.keys(groups).map(function (key) {
      const g = groups[key];
      const msgs = g.list.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      const stats = computeStats(msgs);
      const ratings = msgs.filter(function (m) { return typeof m.rating === "number"; }).map(function (m) { return m.rating; });
      const avgRatingGiven = ratings.length ? (ratings.reduce(function (a, b) { return a + b; }, 0) / ratings.length) : null;
      return {
        author: g.author,
        sourceId: g.sourceId,
        authorMeta: msgs[0].authorMeta,
        messageCount: msgs.length,
        firstDate: msgs[msgs.length - 1].date,
        lastDate: msgs[0].date,
        positive: stats.positive,
        negative: stats.negative,
        neutral: stats.neutral,
        answered: stats.answered,
        unanswered: stats.unanswered,
        avgRatingGiven: avgRatingGiven,
        platformCount: parseAuthorMetaCount(msgs[0].authorMeta),
        profile: (window.APP_DATA.authorProfiles || {})[g.author] || null
      };
    });
  }

  /* -------------------------------------------------------------- dates */

  function today() {
    return new Date(window.DEMO_TODAY || Date.now());
  }

  function relativeDate(iso) {
    const d = new Date(iso);
    const diffMs = today() - d;
    const diffH = Math.round(diffMs / 36e5);
    if (diffH < 1) return "just now";
    if (diffH < 24) return diffH + "h ago";
    const diffD = Math.round(diffH / 24);
    if (diffD === 1) return "yesterday";
    if (diffD < 7) return diffD + "d ago";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function timeOfDay(iso) {
    return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  /* -------------------------------------------------------------- render */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stars(rating) {
    if (rating == null) return "";
    let out = '<span class="stars" aria-label="' + rating + ' out of 5 stars">';
    for (let i = 1; i <= 5; i++) {
      out += i <= rating ? "&#9733;" : "&#9734;";
    }
    out += "</span>";
    return out;
  }

  // Small, deliberately generic line icons (not brand logos) per source.
  const ICONS = {
    pin: '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>',
    star: '<path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.1 6-.7z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.6-2.5h4.8L16 7"/><circle cx="12" cy="13.5" r="3.5"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/>',
    hash: '<path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/>',
    newspaper: '<rect x="3" y="5" width="18" height="15" rx="1.5"/><path d="M7 9h6M7 12.5h10M7 16h10"/><path d="M17 5v3h3"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',
    inbox: '<path d="M4 12h4l2 3h4l2-3h4"/><path d="M4 12l1.5-7h13L20 12"/><path d="M4 12v7h16v-7"/>',
    reset: '<path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.5 9A7 7 0 0 1 19 8.5M18.5 15A7 7 0 0 1 5 15.5"/>'
  };

  function sourceIcon(iconKey, cls) {
    const inner = ICONS[iconKey] || ICONS.pin;
    return '<svg class="' + (cls || "src-icon") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  }

  function sentimentLabel(s) {
    return s === "positive" ? "Positive" : s === "negative" ? "Negative" : "Neutral";
  }

  function typeLabel(t) {
    const map = { review: "Review", comment: "Comment", dm: "Direct message", mention: "Mention", reply: "Reply" };
    return map[t] || "Message";
  }

  /* ----------------------------------------------------- aggregate stats */

  // Compute all the counts a dashboard/report page needs from a list of
  // messages (already filtered to whatever scope — one source or all).
  function computeStats(messages) {
    const s = {
      total: messages.length,
      positive: 0, negative: 0, neutral: 0,
      read: 0, unread: 0,
      answered: 0, unanswered: 0,
      ratingSum: 0, ratingCount: 0
    };
    messages.forEach(function (m) {
      s[m.sentiment] = (s[m.sentiment] || 0) + 1;
      if (m.read) s.read++; else s.unread++;
      if (m.answered) s.answered++; else s.unanswered++;
      if (typeof m.rating === "number") { s.ratingSum += m.rating; s.ratingCount++; }
    });
    s.avgRating = s.ratingCount ? (s.ratingSum / s.ratingCount) : null;
    return s;
  }

  /* --------------------------------------------------------------- URL */

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function buildUrl(base, params) {
    const url = new URLSearchParams();
    Object.keys(params).forEach(function (k) {
      if (params[k] != null && params[k] !== "" && params[k] !== "all") url.set(k, params[k]);
    });
    const q = url.toString();
    return base + (q ? "?" + q : "");
  }

  return {
    getMessages: getMessages,
    updateMessage: updateMessage,
    resetOverrides: resetOverrides,
    getSources: getSources,
    getSource: getSource,
    getRecipients: getRecipients,
    updateRecipient: updateRecipient,
    getSourceConnected: getSourceConnected,
    updateSourceConnected: updateSourceConnected,
    getAuthors: getAuthors,
    parseAuthorMetaCount: parseAuthorMetaCount,
    relativeDate: relativeDate,
    timeOfDay: timeOfDay,
    escapeHtml: escapeHtml,
    stars: stars,
    sourceIcon: sourceIcon,
    sentimentLabel: sentimentLabel,
    typeLabel: typeLabel,
    computeStats: computeStats,
    qs: qs,
    buildUrl: buildUrl
  };
})();
