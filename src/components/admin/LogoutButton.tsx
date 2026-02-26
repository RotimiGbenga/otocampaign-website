"use client";

import Link from "next/link";

type LogoutButtonProps = {
  variant?: "default" | "header";
};

export function LogoutButton({ variant = "default" }: LogoutButtonProps) {
  const className =
    variant === "header"
      ? "text-sm font-medium text-green-100 hover:text-white transition"
      : "text-sm font-medium text-campaign-green-700 hover:text-campaign-green-900";

  return (
    <Link href="/admin/logout" className={className}>
      Sign out
    </Link>
  );
}
