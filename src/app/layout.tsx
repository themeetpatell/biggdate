import type { Metadata, Viewport } from "next";
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
      <body className="antialiased bg-[var(--bd-bg)] text-[var(--bd-text)] min-h-screen pb-nav">
        <TooltipProvider>
          <AuthProvider>
            {children}
            <BottomNav />
            <MaahiChat />
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
