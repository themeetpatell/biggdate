import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/bottom-nav";
import { AuthProvider } from "@/components/auth-provider";
import { MaahiChat } from "@/components/maahi-chat";
import "./globals.css";

export const metadata: Metadata = {
  title: "BiggDate — For People Who Build Things",
  description:
    "A relationship product for founders, operators, PMs, engineers, designers, and investors. BiggDate helps builders date with context, schedule intelligence, and sharper compatibility.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BiggDate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-57R8WX5N');
        `}</Script>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GSPNZ2N4CL"
          strategy="afterInteractive"
        />
        <Script id="gtag" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-GSPNZ2N4CL');
        `}</Script>
      </head>
      <body className="antialiased bg-[var(--bd-bg)] text-[var(--bd-text)] min-h-screen pb-nav">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-57R8WX5N"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <TooltipProvider>
          <AuthProvider>
            {children}
            <BottomNav />
            <MaahiChat />
          </AuthProvider>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
