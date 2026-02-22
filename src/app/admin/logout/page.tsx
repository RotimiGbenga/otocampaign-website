import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/auth";

export default async function AdminLogoutPage() {
  await clearAdminSession();
  redirect("/admin/login");
}
