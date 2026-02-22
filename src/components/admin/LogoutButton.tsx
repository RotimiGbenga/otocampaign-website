"use client";

import Link from "next/link";

export function LogoutButton() {
  return (
    <Link
      href="/admin/logout"
      className="text-sm font-medium text-campaign-green-700 hover:text-campaign-green-900"
    >
      Sign out
    </Link>
  );
}
