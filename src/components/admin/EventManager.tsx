"use client";

import { useState } from "react";
import Link from "next/link";
import type { CampaignEvent } from "@prisma/client";
import { formatEventDateShort } from "@/lib/formatDate";

type EventManagerProps = {
  initialEvents: CampaignEvent[];
};

function toDatetimeLocal(date: Date): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function EventManager({ initialEvents }: EventManagerProps) {
  const [events, setEvents] = useState(initialEvents);
  const [editing, setEditing] = useState<CampaignEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Creating...");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const imageUrl = (formData.get("imageUrl") as string) || "";

    try {
      const res = await fetch("/api/admin/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, location, date, imageUrl }),
      });

      const data = await res.json();

      if (data.success) {
        setEvents((prev) => [data.data, ...prev]);
        setCreating(false);
        form.reset();
        setStatus("Event created successfully");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("❌ " + (data.error || "Failed to create"));
      }
    } catch {
      setStatus("❌ Network error");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setStatus("Updating...");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const imageUrl = (formData.get("imageUrl") as string) || "";

    try {
      const res = await fetch("/api/admin/events/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          title,
          description,
          location,
          date,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editing.id ? data.data : ev))
        );
        setEditing(null);
        setStatus("Event updated successfully");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("❌ " + (data.error || "Failed to update"));
      }
    } catch {
      setStatus("❌ Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/events/delete?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        setStatus("Event deleted");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("❌ " + (data.error || "Failed to delete"));
      }
    } catch {
      setStatus("❌ Network error");
    } finally {
      setDeleting(null);
    }
  };

  const EventForm = ({
    event,
    onSubmit,
    onCancel,
    submitLabel,
  }: {
    event?: CampaignEvent | null;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    submitLabel: string;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4 p-6 bg-gray-50 rounded-xl border">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={event?.title}
          className="input-field"
          placeholder="Event title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={event?.description}
          className="input-field resize-y"
          placeholder="Event description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          required
          defaultValue={event?.location}
          className="input-field"
          placeholder="Venue or address"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date & Time
        </label>
        <input
          type="datetime-local"
          name="date"
          required
          defaultValue={event ? toDatetimeLocal(event.date) : undefined}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          defaultValue={event?.imageUrl ?? ""}
          className="input-field"
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-800">
            Campaign Events Manager
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {events.length} event{events.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="btn-primary shrink-0"
        >
          + Create New Event
        </button>
      </div>

      {status && (
        <p
          className={`text-sm font-medium ${
            status.startsWith("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {status}
        </p>
      )}

      {creating && (
        <EventForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          submitLabel="Create Event"
        />
      )}

      {editing && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Edit Event
          </h2>
          <EventForm
            event={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitLabel="Save Changes"
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase hidden md:table-cell">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No events yet. Create one to get started.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/events/${event.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-green-700 hover:underline"
                    >
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                    {event.location}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatEventDateShort(event.date)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(event);
                        setCreating(false);
                      }}
                      className="text-green-600 hover:underline text-sm font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      disabled={deleting === event.id}
                      className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
                    >
                      {deleting === event.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
