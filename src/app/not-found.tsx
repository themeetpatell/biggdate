import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-5xl" style={{ animation: "float 3s ease-in-out infinite" }}>
        🌌
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Lost in the cosmos</h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--bd-text-muted)" }}>
          This page doesn&apos;t exist. Let&apos;s get you back to discovering your soul.
        </p>
      </div>
      <Link href="/dashboard">
        <Button className="bg-[var(--bd-accent)] text-black font-semibold rounded-full px-8">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
