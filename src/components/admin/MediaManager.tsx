"use client";

import { useState } from "react";
import Link from "next/link";
import type { MediaPost } from "@prisma/client";

type MediaManagerProps = {
  initialPosts: MediaPost[];
};

export function MediaManager({ initialPosts }: MediaManagerProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState<MediaPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Creating...");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const imageUrl = (formData.get("imageUrl") as string) || "";

    try {
      const res = await fetch("/api/admin/media/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, content, imageUrl }),
      });

      const data = await res.json();

      if (data.success) {
        setPosts((prev) => [data.data, ...prev]);
        setCreating(false);
        form.reset();
        setStatus("Post created successfully");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("❌ " + (data.error || "Failed to create"));
      }
    } catch (err) {
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
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const imageUrl = (formData.get("imageUrl") as string) || "";

    try {
      const res = await fetch("/api/admin/media/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          title,
          summary,
          content,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === editing.id ? data.data : p))
        );
        setEditing(null);
        setStatus("Post updated successfully");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("❌ " + (data.error || "Failed to update"));
      }
    } catch (err) {
      setStatus("❌ Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/media/delete?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setStatus("Post deleted");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("❌ " + (data.error || "Failed to delete"));
      }
    } catch (err) {
      setStatus("❌ Network error");
    } finally {
      setDeleting(null);
    }
  };

  const MediaForm = ({
    post,
    onSubmit,
    onCancel,
    submitLabel,
  }: {
    post?: MediaPost | null;
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
          defaultValue={post?.title}
          className="input-field"
          placeholder="Post title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Summary
        </label>
        <textarea
          name="summary"
          required
          rows={2}
          defaultValue={post?.summary}
          className="input-field resize-none"
          placeholder="Brief summary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          name="content"
          required
          rows={8}
          defaultValue={post?.content}
          className="input-field resize-y"
          placeholder="Full article content"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          defaultValue={post?.imageUrl ?? ""}
          className="input-field"
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
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
            Media & News Manager
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""} total
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
          + Create New Post
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
        <MediaForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          submitLabel="Create Post"
        />
      )}

      {editing && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Edit Post
          </h2>
          <MediaForm
            post={editing}
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
                Summary
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
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No media posts yet. Create one to get started.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/media/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-green-700 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell max-w-[300px]">
                    <span className="line-clamp-2">{post.summary}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(post);
                        setCreating(false);
                      }}
                      className="text-green-600 hover:underline text-sm font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="text-red-600 hover:underline text-sm font-medium disabled:opacity-50"
                    >
                      {deleting === post.id ? "Deleting..." : "Delete"}
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
