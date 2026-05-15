import { notFound } from "next/navigation";
import { isPulseEnabled } from "@/lib/feature-flags";

export default function PulseLayout({ children }: { children: React.ReactNode }) {
  if (!isPulseEnabled()) notFound();
  return children;
}
