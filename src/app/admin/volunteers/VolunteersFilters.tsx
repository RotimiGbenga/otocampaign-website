"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Props = {
  search: string;
  lgaFilter: string;
  lgas: readonly string[];
};

export function VolunteersFilters({ search, lgaFilter, lgas }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(search);
  const [lga, setLga] = useState(lgaFilter);

  useEffect(() => {
    setQ(search);
    setLga(lgaFilter);
  }, [search, lgaFilter]);

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }
    if (lga) {
      params.set("lga", lga);
    } else {
      params.delete("lga");
    }
    router.push(`/admin/volunteers?${params.toString()}`);
  }, [q, lga, router, searchParams]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateFilters();
      }}
      className="flex flex-col sm:flex-row gap-3"
    >
      <input
        type="search"
        placeholder="Search by name or phone..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />
      <select
        value={lga}
        onChange={(e) => setLga(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[180px]"
      >
        <option value="">All LGAs</option>
        {lgas.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
      >
        Search
      </button>
    </form>
  );
}
