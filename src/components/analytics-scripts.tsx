"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Reads the analytics consent flag that the cookie banner sets.
// Key: "bd_analytics_consent", value: "granted" | "denied"
export function AnalyticsScripts() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bd_analytics_consent");
    if (stored === "granted") {
      setConsented(true);
      return;
    }
    // Listen for consent granted by the cookie banner
    const handler = (e: StorageEvent) => {
      if (e.key === "bd_analytics_consent" && e.newValue === "granted") {
        setConsented(true);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!consented) return null;

  return (
    <>
      {/* Microsoft Clarity — only loads after explicit analytics consent */}
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
