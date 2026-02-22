"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        await fetch("/api/admin/logout", { method: "POST" });
      } finally {
        router.replace("/admin/login");
      }
    }
    logout();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-campaign-green-800">Logging you out securely...</p>
    </div>
  );
}
