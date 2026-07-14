/* ============================================================================
   IDOG SYSTEM — DEMO DATA
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to change what the demo shows.
   Every page (Dashboard, Source Reports, Inbox) reads from this file and
   re-computes its own counts, so you never have to update a number by hand.

   HOW TO EDIT FOR A DEMO:
   1. Change RESTAURANT below to your restaurant's name/address.
   2. Add/remove entries in SOURCES to change which platforms show up.
   3. Add/remove/edit entries in MESSAGES to change reviews, comments & DMs.
      - Copy an existing message object, change the fields, done.
      - "sourceId" must match an "id" from SOURCES.
      - Leave "rating" as null for anything that isn't a star review
        (Instagram/Facebook comments, X mentions, DMs, press mentions, etc).
      - "aiReplyOptions" are the draft replies shown when you click "React".
        Only needed for messages where answered = false.
      - "sentReply" is only needed for messages where answered = true —
        it's shown instead of the React panel, as a record of what went out.
      - Every source needs a "url" — used for the "Go to source" link on
        every ticket from that source. Fine to point at the platform's
        homepage rather than a specific post (that's what the demo does).
      - Sources with category "local" (local press/directories) skip the
        React/AI-reply workflow entirely — set answered: true on all of
        their messages, since there's nothing to reply to, just a mention
        to be aware of.
   4. Reload any page — dates, counts and charts all recalculate.

   Dates are plain ISO strings relative to DEMO_TODAY so the "days ago" math
   and the activity charts stay consistent no matter when you run the demo.
   ========================================================================== */

// Treat this date as "today" for all relative labels (e.g. "2 days ago").
window.DEMO_TODAY = "2026-07-13T09:00:00";

window.APP_DATA = {

  restaurant: {
    name: "Island Burger & Bites",
    tagline: "Italian coastal kitchen & bar",
    address: "1 Estell Lee Pl, Wilmington, NC",
    initials: "IB"
  },

  // ---------------------------------------------------------------------
  // SOURCES — one entry per platform. category is "review" or "social".
  // trend = last 7 days of activity, oldest first, used for the little
  // bar chart on each source's report page. Any 7 numbers work.
  // ---------------------------------------------------------------------
  sources: [
    {
      id: "google-maps",
      name: "Google Maps",
      category: "review",
      icon: "pin",
      url: "https://www.google.com/maps",
      ratingAvg: 4.6,
      ratingCount: 812,
      profileViews: 1842,
      viewsTrendPct: 11,
      lastSync: "08:02 AM",
      trend: [14, 19, 16, 22, 25, 30, 27],
      connected: true,
      tokenMasked: "AIzaSy••••••••9F2c"
    },
    {
      id: "yelp",
      name: "Yelp",
      category: "review",
      icon: "star",
      url: "https://www.yelp.com",
      ratingAvg: 4.1,
      ratingCount: 356,
      profileViews: 640,
      viewsTrendPct: -3,
      lastSync: "08:03 AM",
      trend: [9, 8, 10, 7, 11, 9, 8],
      connected: true,
      tokenMasked: "yelp_key_••••••••7Bd1"
    },
    {
      id: "tripadvisor",
      name: "TripAdvisor",
      category: "review",
      icon: "compass",
      url: "https://www.tripadvisor.com",
      ratingAvg: 4.4,
      ratingCount: 214,
      profileViews: 505,
      viewsTrendPct: 6,
      lastSync: "08:03 AM",
      trend: [5, 6, 6, 8, 7, 9, 10],
      connected: true,
      tokenMasked: "ta_partner_••••••••3Aq9"
    },
    {
      id: "instagram",
      name: "Instagram",
      category: "social",
      icon: "camera",
      url: "https://www.instagram.com",
      followers: 9840,
      followersTrendPct: 4,
      engagementRatePct: 5.8,
      lastSync: "08:04 AM",
      trend: [22, 28, 24, 31, 40, 52, 46],
      connected: true,
      tokenMasked: "IGQVJ••••••••88Lm"
    },
    {
      id: "facebook",
      name: "Facebook",
      category: "social",
      icon: "flag",
      url: "https://www.facebook.com",
      followers: 6120,
      followersTrendPct: 1,
      engagementRatePct: 3.2,
      lastSync: "08:04 AM",
      trend: [10, 12, 9, 14, 13, 18, 15],
      connected: true,
      tokenMasked: "EAAGm••••••••42Xk"
    },
    {
      id: "x-twitter",
      name: "X (Twitter)",
      category: "social",
      icon: "hash",
      url: "https://x.com",
      followers: 3210,
      followersTrendPct: -2,
      engagementRatePct: 2.1,
      lastSync: "08:05 AM",
      trend: [4, 6, 3, 7, 9, 6, 8],
      connected: false,
      tokenMasked: "AAAAA••••••••Rk7v"
    },

    // Local resources — local press/media and directory listings. These are
    // mentions, not reviews or DMs: no rating, no reply workflow, just a
    // "Go to source" link and a read/unread + sentiment tag.
    // These use a tracking method instead of an API token, since local press
    // mentions are usually monitored rather than pulled through a platform API.
    {
      id: "starnews",
      name: "StarNews",
      category: "local",
      icon: "newspaper",
      url: "https://www.starnewsonline.com/",
      mentionsCount: 38,
      lastSync: "08:06 AM",
      trend: [1, 0, 2, 1, 0, 1, 2],
      connected: true,
      trackingMethod: "Google Alerts + manual clipping"
    },
    {
      id: "port-city-foodie",
      name: "Port City Foodie",
      category: "local",
      icon: "newspaper",
      url: "https://portcityfoodie.com/",
      mentionsCount: 21,
      lastSync: "08:06 AM",
      trend: [0, 1, 0, 1, 1, 2, 1],
      connected: true,
      trackingMethod: "Google Alerts + manual clipping"
    },
    {
      id: "wilmingtonbiz",
      name: "WilmingtonBiz",
      category: "local",
      icon: "newspaper",
      url: "https://www.wilmingtonbiz.com/",
      mentionsCount: 9,
      lastSync: "08:07 AM",
      trend: [0, 0, 1, 0, 0, 0, 1],
      connected: false,
      trackingMethod: "Google Alerts + manual clipping"
    }
  ],

  // ---------------------------------------------------------------------
  // SETTINGS — notification recipients (email + SMS), editable the same
  // way as everything else in this file. "channels" controls which alerts
  // reach them: any combination of "email" / "sms".
  // ---------------------------------------------------------------------
  notificationRecipients: [
    { id: "rec-1", name: "Alex Chen", role: "General Manager", email: "alex@bellavistatrattoria.example", phone: "+1 (910) 555-0142", channels: ["email", "sms"], alertOn: "negative" },
    { id: "rec-2", name: "Priya Raman", role: "Owner", email: "priya@bellavistatrattoria.example", phone: "+1 (910) 555-0198", channels: ["email"], alertOn: "all" },
    { id: "rec-3", name: "Marcus Webb", role: "Social Media Lead", email: "marcus@bellavistatrattoria.example", phone: "+1 (910) 555-0117", channels: ["email", "sms"], alertOn: "all" }
  ],

  // ---------------------------------------------------------------------
  // AUTHOR PROFILES — optional enrichment for the Authors page, keyed by
  // the exact "author" string used in MESSAGES. Not every author needs an
  // entry here — the Authors page computes what it can (message count,
  // sentiment, dates) straight from MESSAGES, and just layers this on top
  // when it's available. "joined" is when they joined that platform (not
  // when they first reviewed you); "reviewerLevel" is whatever badge the
  // platform itself shows on their profile (Local Guide tier, Elite year,
  // verified, etc) — leave it null if the platform doesn't have one.
  // ---------------------------------------------------------------------
  authorProfiles: {
    "Sarah M.": { joined: "2021-05-12", reviewerLevel: "Local Guide · Level 4" },
    "MarloHarborLocal": { joined: "2018-11-03", reviewerLevel: "Yelp Elite 2026" },
    "TravelingCouplesATL": { joined: "2017-06-30", reviewerLevel: null },
    "@ncsupperclub": { joined: "2020-02-20", reviewerLevel: "Verified food account" },
    "@lowcountry_bites": { joined: "2019-09-14", reviewerLevel: null },
    "PierViewPatty": { joined: "2024-01-15", reviewerLevel: null }
  },

  // ---------------------------------------------------------------------
  // MESSAGES — reviews, comments, mentions and DMs, all in one list.
  // ---------------------------------------------------------------------
  messages: [

    /* ---------------- Google Maps ---------------- */
    {
      id: "gm-100", sourceId: "google-maps", type: "review",
      author: "Sarah M.", authorMeta: "143 local reviews", rating: 4,
      text: "First visit a few months back — the room was lovely and the pasta was excellent. Docking one star only because the wait for a table ran long on a Friday.",
      date: "2026-04-02T19:10:00", sentiment: "positive", read: true, answered: true,
      sentReply: "Thank you for the early visit and for coming back since! We've been working on Friday wait times — glad the pasta made up for it."
    },
    {
      id: "gm-101", sourceId: "google-maps", type: "review",
      author: "Sarah M.", authorMeta: "143 local reviews", rating: 5,
      text: "The saffron linguine with clams was outstanding — the best we've had on this coast by a wide margin. Service was warm without being intrusive, and the harbor view at dusk made the whole night feel special.",
      date: "2026-07-13T07:20:00", sentiment: "positive", read: false, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Sarah, thank you so much — comments like this make the whole team's week! We'll pass your kind words to the kitchen. Can't wait to have you back for the next tasting menu.",
        "Thank you, Sarah! So glad the linguine and the view lived up to the evening. We'd love to welcome you back soon — ask for the harbor-side table again."
      ]
    },
    {
      id: "gm-102", sourceId: "google-maps", type: "review",
      author: "James R.", authorMeta: "28 local reviews", rating: 2,
      text: "Food was genuinely good but service was very slow — about 45 minutes for entrees on a Tuesday night. Kitchen seemed understaffed for how busy the room was.",
      date: "2026-07-12T19:40:00", sentiment: "negative", read: true, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "James, thank you for the honest feedback and I'm sorry the pacing let down an otherwise good meal. Tuesday's kitchen staffing was short, and we're correcting that. I'd like to make it right on your next visit — please email us and ask for the manager.",
        "Thanks for flagging this, James. A 45-minute wait for entrees isn't the standard we hold ourselves to, especially on a slower night. We're addressing the staffing gap directly. Hope you'll give us another shot."
      ]
    },
    {
      id: "gm-103", sourceId: "google-maps", type: "review",
      author: "FirstTimeGuest22", authorMeta: "1 review", rating: 1,
      text: "Never coming back.",
      date: "2026-07-13T06:10:00", sentiment: "negative", read: false, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "We're sorry to hear this, though we'd genuinely like to understand what happened during your visit so we can fix it — could you send us a note with more detail?",
        "Sorry to disappoint you. If you're open to it, we'd appreciate a few more details on what went wrong so we can address it directly."
      ]
    },
    {
      id: "gm-104", sourceId: "google-maps", type: "review",
      author: "TableFor2_ILM", authorMeta: "5 local reviews", rating: 5,
      text: "Perfect anniversary dinner. The staff must have seen the note I left when booking — they surprised us with a complimentary tiramisu and a candle. Small gesture, enormous impact.",
      date: "2026-07-11T20:05:00", sentiment: "positive", read: true, answered: true,
      sentReply: "What a lovely evening to be part of — happy anniversary! We'll let the front-of-house team know their touch didn't go unnoticed. Looking forward to next year's celebration."
    },
    {
      id: "gm-105", sourceId: "google-maps", type: "review",
      author: "Coastal_Diner_NC", authorMeta: "22 local reviews", rating: 4,
      text: "Great atmosphere and a genuinely creative cocktail list — the Marlow Spritz was a highlight. Would happily come back for a weeknight dinner.",
      date: "2026-07-10T21:15:00", sentiment: "positive", read: true, answered: false,
      allowAiAutoReply: true,
      aiReplyOptions: [
        "Thank you! The Marlow Spritz is one of our favorites to make too — glad it hit the mark. Hope to see you again soon for another weeknight dinner.",
        "So glad you enjoyed it! We put a lot of thought into that cocktail list, and it's great to hear it's landing. See you next time."
      ]
    },

    /* ---------------- Yelp ---------------- */
    {
      id: "yl-201", sourceId: "yelp", type: "review",
      author: "MarloHarborLocal", authorMeta: "64 Yelp reviews", rating: 5,
      text: "Our go-to for date night. The branzino is cooked perfectly every single time and the bread service alone is worth the visit.",
      date: "2026-07-13T05:45:00", sentiment: "positive", read: false, answered: false,
      allowAiAutoReply: true,
      aiReplyOptions: [
        "Thank you for making us your go-to — that means a lot! We'll tell the kitchen the branzino streak continues. See you at the next date night.",
        "That's wonderful to hear, thank you! The branzino is one we're proud of. Looking forward to your next visit."
      ]
    },
    {
      id: "yl-202", sourceId: "yelp", type: "review",
      author: "quietcritic88", authorMeta: "112 Yelp reviews", rating: 2,
      text: "Reservation was lost even though I had a confirmation email. We were seated 30 minutes late after a frustrating conversation at the host stand.",
      date: "2026-07-12T18:30:00", sentiment: "negative", read: false, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "I'm sorry — a lost reservation with a confirmation in hand isn't acceptable, and I understand the frustration at the host stand on top of it. We're reviewing what happened with our booking system. Please reach out directly so we can make this right.",
        "This shouldn't have happened, especially with a confirmed booking. I'd like to look into where this broke down — could you share your reservation details with our manager directly?"
      ]
    },
    {
      id: "yl-203", sourceId: "yelp", type: "review",
      author: "SarahP_eats", authorMeta: "9 Yelp reviews", rating: 4,
      text: "Cozy spot, great wine list. Portions run a little small for the price but the quality is there.",
      date: "2026-07-09T19:00:00", sentiment: "neutral", read: true, answered: true,
      sentReply: "Thanks for the honest take, Sarah — glad the wine list stood out. We're always tuning portion sizes against quality and appreciate the feedback."
    },
    {
      id: "yl-204", sourceId: "yelp", type: "review",
      author: "roadtrip_reviews", authorMeta: "301 Yelp reviews", rating: 5,
      text: "Stopped in on a road trip and left wishing we lived closer. The burrata board and the affogato were both excellent.",
      date: "2026-07-08T14:20:00", sentiment: "positive", read: true, answered: true,
      sentReply: "That's the best kind of compliment — thank you! Safe travels, and you're always welcome back if the road brings you through Marlow Harbor again."
    },

    /* ---------------- TripAdvisor ---------------- */
    {
      id: "ta-301", sourceId: "tripadvisor", type: "review",
      author: "TravelingCouplesATL", authorMeta: "67 TripAdvisor reviews", rating: 5,
      text: "Came on our hotel concierge's recommendation and couldn't be happier. The oysters were the freshest we've had anywhere on this trip, and the outdoor deck at sunset made the evening.",
      date: "2026-07-12T20:30:00", sentiment: "positive", read: false, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Thank you for trusting the recommendation and for such kind words! The deck at sunset is one of our favorite spots too. Hope you'll book it again on your next visit.",
        "So glad the concierge steered you our way. Fresh oysters and a good sunset are a hard combination to beat — thank you for celebrating it with us."
      ]
    },
    {
      id: "ta-302", sourceId: "tripadvisor", type: "review",
      author: "NC_foodie_trail", authorMeta: "40 TripAdvisor reviews", rating: 3,
      text: "Food was solid but the noise level made conversation difficult on a Saturday night. Worth trying on a quieter evening instead.",
      date: "2026-07-11T21:50:00", sentiment: "neutral", read: true, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Thank you for the feedback — Saturday nights do get lively, and we're looking at ways to soften the noise without losing the energy. A quieter weeknight might be a better fit if conversation is the priority. Hope to host you again.",
        "That's fair feedback and something we're actively working on for weekend evenings. A Tuesday or Wednesday visit tends to be much quieter if you'd like to give us another try."
      ]
    },
    {
      id: "ta-303", sourceId: "tripadvisor", type: "review",
      author: "PierViewPatty", authorMeta: "12 TripAdvisor reviews", rating: 1,
      text: "Waited at the bar for 20 minutes without being acknowledged. Left before ordering.",
      date: "2026-07-13T04:55:00", sentiment: "negative", read: false, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Patty, I'm sorry — being overlooked at the bar for 20 minutes is exactly the kind of thing we train hard to prevent, and clearly we missed it. I'd like to hear more about when this happened so we can address it with the bar team directly.",
        "This isn't the welcome we aim for, and I apologize you left without being served. Could you let us know the date and approximate time so we can look into it with the bar staff on shift?"
      ]
    },

    /* ---------------- Instagram ---------------- */
    {
      id: "ig-401", sourceId: "instagram", type: "comment",
      author: "@coastal.eats.nc", authorMeta: "commented on your carousel post", rating: null,
      text: "That burrata board 😍 what's in the honey drizzle?? need to know",
      date: "2026-07-13T08:10:00", sentiment: "positive", read: false, answered: false,
      allowAiAutoReply: true,
      aiReplyOptions: [
        "It's a rosemary-infused local honey — comes out on the board every night! Come say hi and we'll point you to it 🍯",
        "Local honey steeped with fresh rosemary — one of our favorite little details. Hope to see you in for a bite soon!"
      ]
    },
    {
      id: "ig-402", sourceId: "instagram", type: "dm",
      author: "@harbor.wanderer", authorMeta: "sent you a DM", rating: null,
      text: "Hi! Do you have anything on the menu that's dairy-free? Coming in Friday for a birthday dinner.",
      date: "2026-07-12T16:45:00", sentiment: "neutral", read: true, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Happy early birthday! Yes — several dishes can go dairy-free, including the branzino and the saffron linguine (made without the finishing butter on request). Mention it when you arrive Friday and we'll take care of it.",
        "Absolutely, and happy birthday for Friday! Let your server know about the dairy-free request when you sit down and we'll guide you to the best options on the menu that night."
      ]
    },
    {
      id: "ig-403", sourceId: "instagram", type: "comment",
      author: "@localfoodcritic", authorMeta: "commented on your reel", rating: null,
      text: "Cute video but the reel makes the portions look way bigger than what actually arrives at the table. A bit misleading tbh.",
      date: "2026-07-11T13:20:00", sentiment: "negative", read: true, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Appreciate you saying so directly — that's useful feedback on how we're framing shots, not just the food itself. We'll take a closer look at how we present portions on camera.",
        "Fair point, and thank you for the honesty. We want what's on camera to match what's on the plate, so we'll revisit how we're shooting these."
      ]
    },
    {
      id: "ig-404", sourceId: "instagram", type: "comment",
      author: "@nc.date.nights", authorMeta: "commented on your post", rating: null,
      text: "Been here twice this month already, the tiramisu is unreal 🙌",
      date: "2026-07-09T19:30:00", sentiment: "positive", read: true, answered: true,
      sentReply: "Twice in one month is basically family status 🙌 thank you for making us part of your date nights — the tiramisu says hi back."
    },
    {
      id: "ig-405", sourceId: "instagram", type: "dm",
      author: "@meetings_and_mains", authorMeta: "sent you a DM", rating: null,
      text: "Do you take reservations for groups of 12+? Looking at early August for a work dinner.",
      date: "2026-07-08T11:05:00", sentiment: "neutral", read: true, answered: true,
      sentReply: "We do! For groups of 12+ we set up a private section of the dining room — send us a preferred date in early August and we'll hold it for you."
    },

    /* ---------------- Facebook ---------------- */
    {
      id: "fb-501", sourceId: "facebook", type: "review",
      author: "Denise K.", authorMeta: "recommended your page", rating: 5,
      text: "Recommend! Brought my parents for their anniversary and the whole team went above and beyond. The osso buco is a must-order.",
      date: "2026-07-12T22:00:00", sentiment: "positive", read: false, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Denise, thank you for trusting us with your parents' anniversary — that's exactly the kind of night we love hosting. Glad the osso buco delivered too!",
        "That means so much, Denise — celebrating a milestone like that with your family is a real honor for us. Thank you for the recommendation."
      ]
    },
    {
      id: "fb-502", sourceId: "facebook", type: "comment",
      author: "Marcus T.", authorMeta: "commented on your event post", rating: null,
      text: "Is the patio heated in the fall? Thinking about booking for late October.",
      date: "2026-07-12T09:15:00", sentiment: "neutral", read: true, answered: false,
      allowAiAutoReply: true,
      aiReplyOptions: [
        "Yes, the patio has overhead heaters running from October through early spring, so late October is a great time to book it. Want us to pencil in a date for you?",
        "It is — heaters go up in October, so you're timing it well. Happy to help you get a patio table booked for that date."
      ]
    },
    {
      id: "fb-503", sourceId: "facebook", type: "review",
      author: "GregH_wilm", authorMeta: "recommended your page", rating: 2,
      text: "Not recommended for large groups — we had a party of 8 and the kitchen clearly couldn't keep pace, food came out over 40 minutes apart between courses.",
      date: "2026-07-11T20:40:00", sentiment: "negative", read: false, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "Greg, that gap between courses for a party of 8 is exactly what we try to avoid with larger tables, and clearly the kitchen missed the mark that night. I'd like to understand the date so we can look into it — happy to make it up to your group.",
        "Thank you for the direct feedback. A 40-minute gap between courses isn't the experience we want for a group celebration. We're looking at how we pace larger parties in the kitchen — sorry this one slipped through."
      ]
    },
    {
      id: "fb-504", sourceId: "facebook", type: "comment",
      author: "Priya N.", authorMeta: "commented on your menu post", rating: null,
      text: "So happy to see a vegan option added to the mains! Ordering this weekend.",
      date: "2026-07-10T17:25:00", sentiment: "positive", read: true, answered: true,
      sentReply: "We're excited about it too — hope it's everything you're hoping for this weekend. Let us know what you think!"
    },

    /* ---------------- X (Twitter) ---------------- */
    {
      id: "x-601", sourceId: "x-twitter", type: "mention",
      author: "@ncsupperclub", authorMeta: "2.4k followers", rating: null,
      text: "genuinely one of the best wine lists on the coast right now, @BellaVistaTratt is doing something right",
      date: "2026-07-13T07:50:00", sentiment: "positive", read: false, answered: false,
      allowAiAutoReply: true,
      aiReplyOptions: [
        "This made our morning — thank you! Come by and we'll pour you something new we just added to the list.",
        "Thank you! A lot of care goes into that list, so it's great to see it noticed. Next round's on the house next time you're in."
      ]
    },
    {
      id: "x-602", sourceId: "x-twitter", type: "reply",
      author: "@harborcritic", authorMeta: "890 followers", rating: null,
      text: "@BellaVistaTratt hostess was pretty short with us at the door tonight, kind of soured the whole visit before we even sat down",
      date: "2026-07-12T21:10:00", sentiment: "negative", read: true, answered: false,
      allowAiAutoReply: false,
      aiReplyOptions: [
        "That's not the welcome we want anyone to have — sorry the tone at the door set things off on the wrong foot. Could you DM us the time you came in? We'd like to follow up with the front-of-house team directly.",
        "Really sorry to hear that — a short greeting at the door isn't acceptable and we'd like to address it directly with the team. Mind sending the time of your visit over DM?"
      ]
    },
    {
      id: "x-603", sourceId: "x-twitter", type: "mention",
      author: "@lowcountry_bites", authorMeta: "5.1k followers", rating: null,
      text: "the espresso martini at @BellaVistaTratt might be the best one I've had in the state, not exaggerating",
      date: "2026-07-10T22:40:00", sentiment: "positive", read: true, answered: true,
      sentReply: "High praise, thank you! We'll let the bar team know — they'll be thrilled. See you for the next round."
    },

    /* ---------------- Local resources (press mentions — no reply workflow) ---------------- */
    {
      id: "sn-701", sourceId: "starnews", type: "mention",
      author: "StarNews", authorMeta: "Weekend dining feature", rating: null,
      text: "Bella Vista Trattoria's harbor-side deck remains the standout waterfront table in town this summer, with the saffron linguine leading a strong seasonal menu.",
      date: "2026-07-13T06:00:00", sentiment: "positive", read: false, answered: true
    },
    {
      id: "sn-702", sourceId: "starnews", type: "mention",
      author: "StarNews", authorMeta: "Restaurant roundup, print edition", rating: null,
      text: "Service has been inconsistent on peak weekend nights according to several readers who wrote in — a common growing pain for a room this popular.",
      date: "2026-07-09T06:00:00", sentiment: "negative", read: true, answered: true
    },
    {
      id: "pcf-801", sourceId: "port-city-foodie", type: "mention",
      author: "Port City Foodie", authorMeta: "\"Where to eat this month\" newsletter", rating: null,
      text: "The burrata board with rosemary honey has quietly become the dish locals recommend to out-of-town guests first.",
      date: "2026-07-12T09:00:00", sentiment: "positive", read: false, answered: true
    },
    {
      id: "pcf-802", sourceId: "port-city-foodie", type: "mention",
      author: "Port City Foodie", authorMeta: "Instagram roundup post", rating: null,
      text: "Included in our \"5 patios worth the wait\" list this week, right alongside two newcomers on the harbor.",
      date: "2026-07-07T09:00:00", sentiment: "neutral", read: true, answered: true
    },
    {
      id: "wb-901", sourceId: "wilmingtonbiz", type: "mention",
      author: "WilmingtonBiz", authorMeta: "Local business briefs", rating: null,
      text: "Ownership confirmed plans to extend the harbor-facing patio next spring, citing steady growth since reopening.",
      date: "2026-07-11T08:00:00", sentiment: "neutral", read: true, answered: true
    }
  ]
};
