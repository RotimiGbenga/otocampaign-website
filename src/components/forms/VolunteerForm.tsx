"use client";

import { useState } from "react";
import { OGUN_STATE_LGAS } from "@/lib/campaign";

const COUNTRIES = [
  "Nigeria",
  "United Kingdom",
  "United States",
  "Canada",
  "South Africa",
  "Other",
] as const;

const NIGERIAN_STATES = [
  { value: "Abia", label: "Abia" },
  { value: "Adamawa", label: "Adamawa" },
  { value: "Akwa Ibom", label: "Akwa Ibom" },
  { value: "Anambra", label: "Anambra" },
  { value: "Bauchi", label: "Bauchi" },
  { value: "Bayelsa", label: "Bayelsa" },
  { value: "Benue", label: "Benue" },
  { value: "Borno", label: "Borno" },
  { value: "Cross River", label: "Cross River" },
  { value: "Delta", label: "Delta" },
  { value: "Ebonyi", label: "Ebonyi" },
  { value: "Edo", label: "Edo" },
  { value: "Ekiti", label: "Ekiti" },
  { value: "Enugu", label: "Enugu" },
  { value: "FCT", label: "Federal Capital Territory (Abuja)" },
  { value: "Gombe", label: "Gombe" },
  { value: "Imo", label: "Imo" },
  { value: "Jigawa", label: "Jigawa" },
  { value: "Kaduna", label: "Kaduna" },
  { value: "Kano", label: "Kano" },
  { value: "Katsina", label: "Katsina" },
  { value: "Kebbi", label: "Kebbi" },
  { value: "Kogi", label: "Kogi" },
  { value: "Kwara", label: "Kwara" },
  { value: "Lagos", label: "Lagos" },
  { value: "Nasarawa", label: "Nasarawa" },
  { value: "Niger", label: "Niger" },
  { value: "Ogun", label: "Ogun" },
  { value: "Ondo", label: "Ondo" },
  { value: "Osun", label: "Osun" },
  { value: "Oyo", label: "Oyo" },
  { value: "Plateau", label: "Plateau" },
  { value: "Rivers", label: "Rivers" },
  { value: "Sokoto", label: "Sokoto" },
  { value: "Taraba", label: "Taraba" },
  { value: "Yobe", label: "Yobe" },
  { value: "Zamfara", label: "Zamfara" },
] as const;

const SUPPORT_TYPES = [
  { value: "Volunteer", label: "Volunteer (Door-to-door outreach)" },
  { value: "Donate", label: "Donate / Financial Support" },
  { value: "Media", label: "Social Media Advocacy" },
  { value: "Mobilizer", label: "Community Mobilization" },
  { value: "Events", label: "Event Organization & Support" },
] as const;

const VOLUNTEER_SKILLS = [
  "Canvassing (Door-to-door)",
  "Phone Banking",
  "Campaign Planning",
  "Social Media Advocacy",
  "Data Collection",
  "Transportation / Driving",
  "Security",
  "Donate / Financial Support",
] as const;

const VOLUNTEER_AVAILABILITY = [
  "Weekday Morning",
  "Weekday Afternoon",
  "Weekday Evening",
  "Weekend",
] as const;

export default function VolunteerForm() {
  const [status, setStatus] = useState<string>("");
  const [country, setCountry] = useState<string>("Nigeria");
  const [stateValue, setStateValue] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Thank you for joining the movement!");
        form.reset();
        setCountry("Nigeria");
        setStateValue("");
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

      {/* HOW WOULD YOU LIKE TO SUPPORT */}
      <fieldset className="space-y-2 p-4 border rounded bg-gray-50">
        <legend className="text-sm font-semibold text-campaign-green-800 px-1">
          How would you like to support the campaign?
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SUPPORT_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer hover:text-campaign-green-700"
            >
              <input
                type="checkbox"
                name="supportType"
                value={value}
                className="rounded border-gray-300 text-campaign-green-600 focus:ring-campaign-green-500"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* LOCATION SECTION */}
      <fieldset className="space-y-4 p-4 border rounded bg-gray-50">
        <legend className="text-sm font-semibold text-campaign-green-800 px-1">
          Location
        </legend>

        {/* COUNTRY */}
        <select
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="w-full p-3 border rounded bg-white"
        >
          <option value="Nigeria">Nigeria</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="South Africa">South Africa</option>
          <option value="Other">Other</option>
        </select>

        {/* STATE - Dropdown for Nigeria, free text for international */}
        {country === "Nigeria" ? (
          <select
            name="state"
            value={stateValue}
            onChange={(e) => setStateValue(e.target.value)}
            required
            className="w-full p-3 border rounded bg-white"
          >
            <option value="">Select State</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="state"
            placeholder="State / Province / Region"
            required
            className="w-full p-3 border rounded bg-white"
          />
        )}

        {/* LGA - Only for Nigeria + Ogun State */}
        {country === "Nigeria" && stateValue === "Ogun" && (
          <select
            name="lga"
            required
            className="w-full p-3 border rounded bg-white"
            defaultValue=""
          >
            <option value="">Select Your LGA (Ogun State)</option>
            {OGUN_STATE_LGAS.map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
        )}

        {/* CITY - For international supporters */}
        {country !== "Nigeria" && (
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full p-3 border rounded bg-white"
          />
        )}
      </fieldset>

      {/* OCCUPATION */}
      <input
        type="text"
        name="occupation"
        placeholder="Occupation / Profession"
        className="w-full p-3 border rounded"
      />

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

      {/* CONTACT PERMISSION */}
      <label className="flex items-center gap-2 cursor-pointer p-4 border rounded bg-gray-50 hover:bg-gray-100">
        <input
          type="checkbox"
          name="contactPermission"
          value="yes"
          className="rounded border-gray-300 text-campaign-green-600 focus:ring-campaign-green-500"
        />
        <span className="text-sm font-medium text-campaign-green-800">
          I agree to be contacted by the campaign team.
        </span>
      </label>

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
