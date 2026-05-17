import { Metadata } from "next";
import { BillingPage } from "@/components/billing-page";

export const metadata: Metadata = {
  title: "Membership — BiggDate",
  description: "Early access membership and access code redemption.",
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "meet@biggventures.com";
const BILLING_MODE = (process.env.NEXT_PUBLIC_BILLING_MODE ?? "early_access") as
  | "early_access"
  | "stripe";

export default function Page() {
  return <BillingPage mode={BILLING_MODE} supportEmail={SUPPORT_EMAIL} />;
}
