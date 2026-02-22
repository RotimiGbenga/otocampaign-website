import VolunteerForm from "@/components/forms/VolunteerForm";

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-campaign-green-800 mb-6">
          Get Involved – Join the Movement
        </h1>
        <p className="mb-8 text-lg text-gray-700">
          Be part of the vision for monumental development in Ogun State.
          Register as a supporter and volunteer today.
        </p>

        <VolunteerForm />
      </div>
    </div>
  );
}