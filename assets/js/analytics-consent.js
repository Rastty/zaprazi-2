// ZP_RELEASE_0_8_84
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
    "next_step_click"
  ]);

  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return;
  }

  let state = "unknown";
  let gaLoaded = false;
  // Funnel stages mean unique visitors reaching a step on this page render,
  // not repeated submit clicks after changing answers.
  const oncePerPage = new Set(["builder_start", "builder_complete", "recommendation_view"]);
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
    if (gaLoaded || state !== "granted") {
      return;
    }

    gaLoaded = true;
    ensureGtag();

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true,
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
    if (state !== "granted" || !allowedEvents.has(eventName)) {
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

  // Count an actual move from an Advisor result to another *local* page.
  // No destination, product, problem or selection is ever sent to GA4.
  // In-page anchors, downloads, external sites and sponsored CTAs are excluded.
  document.addEventListener("click", (event) => {
    const link = event?.target?.closest?.('a[href]');
    if (!link || !link.closest(".zp-result") || link.matches('a[rel~="sponsored"]')) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || link.hasAttribute("download")) return;
    let target;
    try { target = new URL(href, window.location.href); }
    catch { return; }
    if (target.origin !== window.location.origin ||
        target.pathname === window.location.pathname ||
        target.search || target.hash && target.pathname === window.location.pathname) return;
    sendEvent("next_step_click");
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
