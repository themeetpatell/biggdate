import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session || !ADMIN_USER_IDS.includes(session.userId)) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
