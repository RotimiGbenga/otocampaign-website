"use client";

import { useState } from "react";
import { OGUN_STATE_LGAS } from "@/lib/campaign";

const VOLUNTEER_SKILLS = [
  "Canvassing (Door-to-door)",
  "Phone Banking (to raise funds)",
  "Campaign Planning & Support",
  "Social Media Advocacy",
  "Data Entry/Collection",
  "Transportation / Driving",
  "Security",
] as const;

const VOLUNTEER_AVAILABILITY = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Weekends",
] as const;

function buildMessageString(
  skills: string[],
  availability: string[]
): string {
  const parts: string[] = [];
  if (skills.length > 0) {
    parts.push(`Skills: ${skills.join(", ")}`);
  }
  if (availability.length > 0) {
    parts.push(`Availability: ${availability.join(", ")}`);
  }
  return parts.join(" | ") || "";
}

export default function VolunteerForm() {
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const form = e.currentTarget;

    const skills = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[name="skills"]:checked')
    ).map((el) => el.value);
    const availability = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        'input[name="availability"]:checked'
      )
    ).map((el) => el.value);
    const message = buildMessageString(skills, availability);

    const formData = {
      fullName: (form.fullName as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      phone: (form.phone as HTMLInputElement).value,
      lga: (form.lga as HTMLSelectElement).value,
      message,
    };

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Thank you for joining the movement!");
        form.reset();
      } else {
        setStatus("❌ " + (data.message || "Submission failed"));
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("⚠️ Network error. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-campaign-green-800">
        Join the Campaign Movement
      </h2>

      {/* FULL NAME */}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        required
        className="w-full p-3 border rounded"
      />

      {/* EMAIL */}
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className="w-full p-3 border rounded"
      />

      {/* PHONE */}
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        required
        className="w-full p-3 border rounded"
      />

      {/* LGA - All 20 Ogun State LGAs */}
      <select
        name="lga"
        required
        className="w-full p-3 border rounded"
        defaultValue=""
      >
        <option value="" disabled>
          Select Your LGA (Ogun State)
        </option>
        {OGUN_STATE_LGAS.map((lga) => (
          <option key={lga} value={lga}>
            {lga}
          </option>
        ))}
      </select>

      {/* SKILLS */}
      <fieldset className="space-y-2 p-4 border rounded bg-gray-50">
        <legend className="text-sm font-semibold text-campaign-green-800 px-1">
          Skills (Select all that apply)
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VOLUNTEER_SKILLS.map((skill) => (
            <label
              key={skill}
              className="flex items-center gap-2 cursor-pointer hover:text-campaign-green-700"
            >
              <input
                type="checkbox"
                name="skills"
                value={skill}
                className="rounded border-gray-300 text-campaign-green-600 focus:ring-campaign-green-500"
              />
              <span className="text-sm">{skill}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* AVAILABILITY */}
      <fieldset className="space-y-2 p-4 border rounded bg-gray-50">
        <legend className="text-sm font-semibold text-campaign-green-800 px-1">
          Availability (Select all that apply)
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VOLUNTEER_AVAILABILITY.map((avail) => (
            <label
              key={avail}
              className="flex items-center gap-2 cursor-pointer hover:text-campaign-green-700"
            >
              <input
                type="checkbox"
                name="availability"
                value={avail}
                className="rounded border-gray-300 text-campaign-green-600 focus:ring-campaign-green-500"
              />
              <span className="text-sm">{avail}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full bg-campaign-green-600 text-white py-3 rounded font-bold hover:bg-campaign-green-700 transition"
      >
        Join the Movement
      </button>

      {status && (
        <p className="text-center font-semibold text-campaign-green-700">
          {status}
        </p>
      )}
    </form>
  );
}
