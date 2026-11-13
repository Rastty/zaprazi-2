// ZP_RELEASE_0_8_218
(() => {
  "use strict";

  const config = window.ZaPraziAnalyticsConfig || {};
  const measurementId = String(config.measurementId || "");
  const storageKey = String(config.storageKey || "zaprazi_analytics_consent_v1");
  const allowedEvents = new Set([
    "builder_start",
    "builder_complete",
    "recommendation_view",
    "product_click",
    "merchant_click",
    "affiliate_click",
    "next_step_click",
    "guide_advisor_click"
  ]);

  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return;
  }

  // A WordPress ?s= search can expose sensitive family circumstances.
  // Never load GA4 for search pages, even when the visitor opted in.
  const currentUrl = (() => {
    try { return new URL(window.location.href); }
    catch { return null; }
  })();
  const privateSearchPage = !currentUrl || currentUrl.searchParams.has("s");
  const safePageLocation = currentUrl && /^https?:$/.test(currentUrl.protocol)
    ? currentUrl.origin + currentUrl.pathname : "";
  const safeReferrer = (() => {
    try {
      const referrer = new URL(document.referrer);
      return /^https?:$/.test(referrer.protocol) ? referrer.origin + "/" : "";
    } catch { return ""; }
  })();
  let state = "unknown";
  let gaLoaded = false;
  // Funnel stages mean unique visitors reaching a step on this page render,
  // not repeated submit clicks after changing answers.
  const oncePerPage = new Set(["builder_start", "builder_complete", "recommendation_view", "guide_advisor_click"]);
  const sentOnThisPage = new Set();

  const readPreference = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === "granted" || value === "denied" ? value : "unknown";
    } catch {
      return "unknown";
    }
  };

  const writePreference = (value) => {
    state = value;
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Consent still applies for the current page even if storage is blocked.
    }
  };

  const ensureGtag = () => {
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
  };

  const loadAnalytics = () => {
    if (privateSearchPage || !safePageLocation || gaLoaded || state !== "granted") {
      return;
    }

    gaLoaded = true;
    ensureGtag();

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true,
      page_location: safePageLocation,
      page_referrer: safeReferrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    document.head.appendChild(script);
  };

  const clearGaCookies = () => {
    const host = window.location.hostname;
    const domainCandidates = [host, `.${host}`];

    document.cookie.split(";").forEach((entry) => {
      const name = entry.split("=")[0]?.trim();
      if (!name || !name.startsWith("_ga")) {
        return;
      }

      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      domainCandidates.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
      });
    });
  };

  const sendEvent = (eventName) => {
    if (privateSearchPage || !safePageLocation || state !== "granted" || !allowedEvents.has(eventName)) {
      return;
    }
    if (oncePerPage.has(eventName) && sentOnThisPage.has(eventName)) return;

    loadAnalytics();
    ensureGtag();
    window.gtag("event", eventName);
    if (oncePerPage.has(eventName)) sentOnThisPage.add(eventName);
  };

  state = readPreference();

  if (state === "granted") {
    loadAnalytics();
  }

  window.addEventListener("zaprazi:analytics", (event) => {
    const eventName = event?.detail?.event;
    if (typeof eventName === "string") {
      sendEvent(eventName);
    }
  });

  // Only track outbound links that the Advisor itself labels as affiliate.
  // No destination URL, merchant name, product, or questionnaire answers are included.
  // GA4 adapter silently drops this signal until explicit analytics consent is granted.
  document.addEventListener("click", (event) => {
    const link = event?.target?.closest?.('a[rel~="sponsored"]');
    if (!link || !link.closest(".zp-result")) {
      return;
    }
    sendEvent("affiliate_click");
  });

  // A generic useful-next-step click: from an Advisor result, or exactly
  // two educational handoffs on the seven-measurements guide. The event
  // carries ONLY its name: not which choice, destination, answers or product.
  // Consent and private-search fail closed in sendEvent.
  document.addEventListener("click", (event) => {
    const link = event?.target?.closest?.('a[href]');
    if (!link || link.matches('a[rel~="sponsored"]') || link.hasAttribute("download")) return;
    const inAdvisorResult = Boolean(link.closest(".zp-result"));
    const inWalkerGuide = !inAdvisorResult &&
      window.location.pathname === "/co-zmerit-pred-vyberem-choditka/" &&
      Boolean(link.closest("#co-po-mereni"));
    if (!inAdvisorResult && !inWalkerGuide) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    let target;
    try { target = new URL(href, window.location.href); }
    catch { return; }
    if (target.protocol !== "https:" || target.origin !== window.location.origin ||
        target.pathname === window.location.pathname ||
        target.search || target.hash && target.pathname === window.location.pathname) return;
    // Only the two already safe informational options count from the guide.
    // The Advisor link separately emits guide_advisor_click, not two events.
    if (inWalkerGuide && ![
      "/choditko-na-pojistovnu/#priprava-pro-lekare",
      "/pujceni-choditka/#rozpocet-pujceni-choditka"
    ].includes(target.pathname + target.hash)) return;
    sendEvent("next_step_click");
  });

  // Anonymous editorial-to-Advisor handoff. Only explicitly marked primary
  // local links are eligible: no URL, title, product, diagnosis, selected
  // answers, merchant or source-page parameter ever reaches analytics.
  // Once per page view is a funnel interaction count, NOT unique people.
  document.addEventListener("click", (event) => {
    const link = event?.target?.closest?.('a[data-zp-journey="advisor"][href]');
    if (!link || link.closest(".zp-result") ||
        link.matches('a[rel~="sponsored"]') || link.hasAttribute("download")) return;
    const href = link.getAttribute("href");
    if (!href) return;
    let destination;
    try { destination = new URL(href, window.location.href); }
    catch { return; }
    if (destination.protocol !== "https:" ||
        destination.origin !== window.location.origin ||
        destination.search ||
        !/^#poradce(?:-[a-z0-9-]+)?$/.test(destination.hash)) return;
    sendEvent("guide_advisor_click");
  });

  const initUi = () => {
    const banner = document.querySelector("#zp-analytics-consent");
    const allowButton = document.querySelector("#zp-analytics-allow");
    const denyButton = document.querySelector("#zp-analytics-deny");
    const settingsButton = document.querySelector("#zp-analytics-settings");

    if (!banner || !allowButton || !denyButton || !settingsButton) {
      return;
    }

    const showBanner = () => {
      banner.hidden = false;
      window.setTimeout(() => allowButton.focus(), 0);
    };

    const hideBanner = () => {
      banner.hidden = true;
    };

    if (state === "unknown") {
      showBanner();
    }

    allowButton.addEventListener("click", () => {
      writePreference("granted");
      hideBanner();
      loadAnalytics();
    });

    denyButton.addEventListener("click", () => {
      const wasGranted = state === "granted";
      writePreference("denied");

      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", { analytics_storage: "denied" });
      }

      clearGaCookies();
      hideBanner();

      if (wasGranted) {
        window.location.reload();
      }
    });

    settingsButton.addEventListener("click", showBanner);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUi, { once: true });
  } else {
    initUi();
  }
})();
