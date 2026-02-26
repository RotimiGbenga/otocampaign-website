"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/volunteers", label: "Volunteers" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4">
      {navItems.map(({ href, label }) => {
        const isActive =
          href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium transition ${
              isActive
                ? "text-white underline underline-offset-4"
                : "text-green-100 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
