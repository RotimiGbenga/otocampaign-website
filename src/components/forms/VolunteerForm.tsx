"use client";

import { useState } from "react";
import { OGUN_STATE_LGAS } from "@/lib/campaign";

export default function VolunteerForm() {
  const [status, setStatus] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const form = e.currentTarget;

    const formData = {
      fullName: (form.fullName as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      phone: (form.phone as HTMLInputElement).value,
      lga: (form.lga as HTMLSelectElement).value,
      message: (form.message as HTMLTextAreaElement).value,
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

      {/* MESSAGE */}
      <textarea
        name="message"
        placeholder="How would you like to support the campaign?"
        rows={4}
        className="w-full p-3 border rounded"
      />

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
