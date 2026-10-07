// ZP_RELEASE_0_8_25
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
    "merchant_click"
  ]);

  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return;
  }

  let state = "unknown";
  let gaLoaded = false;

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

    loadAnalytics();
    ensureGtag();
    window.gtag("event", eventName);
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
