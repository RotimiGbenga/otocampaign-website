"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending message...");

    const form = e.currentTarget;

    const formData = {
      name: (form.name as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      phone: (form.phone as HTMLInputElement).value,
      message: (form.message as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Message sent successfully!");
        form.reset();
      } else {
        setStatus("❌ " + (data.message || "Failed to send message"));
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      setStatus("⚠️ Network error. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-green-800">
        Contact the Campaign Team
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
        className="w-full p-3 border rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className="w-full p-3 border rounded"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number (Optional)"
        className="w-full p-3 border rounded"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        required
        rows={5}
        className="w-full p-3 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-green-700 text-white py-3 rounded font-bold hover:bg-green-800 transition"
      >
        Send Message
      </button>

      {status && (
        <p className="text-center font-semibold text-green-700">
          {status}
        </p>
      )}
    </form>
  );
}