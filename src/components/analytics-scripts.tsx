"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "bd_analytics_consent";

// All third-party tracking (GTM/GA4, Meta Pixel, Microsoft Clarity) is gated
// on `localStorage.bd_analytics_consent === "granted"`. The ConsentBanner
// component writes this key and fires the "bd:consent-changed" custom event.
// Vercel Analytics is mounted unconditionally elsewhere because it is
// first-party and cookieless.
export function AnalyticsScripts() {
  const [consented, setConsented] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(CONSENT_KEY) === "granted";
  });

  useEffect(() => {
    if (consented) return;
    const onCustom = () => {
      if (localStorage.getItem(CONSENT_KEY) === "granted") setConsented(true);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue === "granted") setConsented(true);
    };
    window.addEventListener("bd:consent-changed", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("bd:consent-changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [consented]);

  if (!consented) return null;

  return (
    <>
      {/* Google Tag Manager (GA4 lives inside this container) */}
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-57R8WX5N');
      `}</Script>

      {/* Meta Pixel — base + PageView. Lead/CompleteRegistration fire from src/lib/gtm.ts. */}
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1680604753184408');
        fbq('track', 'PageView');
      `}</Script>

      {/* Microsoft Clarity */}
      <Script id="clarity" strategy="afterInteractive">{`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script","wk9ecuiovr");
      `}</Script>
    </>
  );
}
