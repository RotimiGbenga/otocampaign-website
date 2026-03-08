"use client";

import { useState, useCallback } from "react";

type Props = {
  lgas: string[];
  skills: string[];
  availability: string[];
};

export function CommunicationsBroadcast({
  lgas,
  skills,
  availability,
}: Props) {
  const [all, setAll] = useState(true);
  const [selectedLgas, setSelectedLgas] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const params = new URLSearchParams();
      params.set("all", String(all));
      if (!all) {
        if (selectedLgas.length) params.set("lgas", selectedLgas.join(","));
        if (selectedSkills.length) params.set("skills", selectedSkills.join(","));
        if (selectedAvailability.length) params.set("availability", selectedAvailability.join(","));
      }
      const res = await fetch(`/api/admin/broadcast/preview?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = (await res.json()) as { count?: number };
      setCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      setMessage({ type: "error", text: "Could not load recipient count" });
      setCount(null);
    } finally {
      setLoading(false);
    }
  }, [all, selectedLgas, selectedSkills, selectedAvailability]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setMessage({ type: "error", text: "Subject and message are required" });
      return;
    }
    setSending(true);
    setMessage(null);
    try {
      const filters = all
        ? { all: true }
        : {
            lgas: selectedLgas.length ? selectedLgas : undefined,
            skills: selectedSkills.length ? selectedSkills : undefined,
            availability: selectedAvailability.length ? selectedAvailability : undefined,
          };
      const res = await fetch("/api/admin/communications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject: subject.trim(), body: body.trim(), filters }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? data.message ?? "Broadcast failed");
      }
      setMessage({
        type: "success",
        text: `Broadcast sent. ${data.sent} delivered${data.failed ? `, ${data.failed} failed` : ""}.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Broadcast failed",
      });
    } finally {
      setSending(false);
    }
  };

  const toggleLga = (lga: string) => {
    setSelectedLgas((prev) =>
      prev.includes(lga) ? prev.filter((x) => x !== lga) : [...prev, lga]
    );
    setAll(false);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((x) => x !== skill) : [...prev, skill]
    );
    setAll(false);
  };

  const toggleAvailability = (av: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(av) ? prev.filter((x) => x !== av) : [...prev, av]
    );
    setAll(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Target Audience
        </h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={all}
              onChange={(e) => {
                setAll(e.target.checked);
                if (e.target.checked) {
                  setSelectedLgas([]);
                  setSelectedSkills([]);
                  setSelectedAvailability([]);
                }
              }}
              className="rounded border-gray-300"
            />
            <span className="font-medium">Send to All Volunteers</span>
          </label>

          {!all && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">By LGA</p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {lgas.map((lga) => (
                    <label
                      key={lga}
                      className="flex items-center gap-1.5 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLgas.includes(lga)}
                        onChange={() => toggleLga(lga)}
                        className="rounded"
                      />
                      <span>{lga}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">By Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center gap-1.5 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded"
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">By Availability</p>
                <div className="flex flex-wrap gap-2">
                  {availability.map((av) => (
                    <label
                      key={av}
                      className="flex items-center gap-1.5 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes(av)}
                        onChange={() => toggleAvailability(av)}
                        className="rounded"
                      />
                      <span>{av}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCount}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-70"
          >
            {loading ? "Loading..." : "Preview Count"}
          </button>
          {count !== null && !loading && (
            <span className="text-sm font-semibold text-green-800">
              {count} recipient{count !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Compose Message
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Campaign update – OTO 2027"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Use {{name}} to personalize. E.g. Dear {{name}}, ..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use {"{{name}}"} to insert each recipient&apos;s name
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={sending || !subject.trim() || !body.trim()}
        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
      >
        {sending ? "Sending..." : "Send Email Broadcast"}
      </button>
    </div>
  );
}
