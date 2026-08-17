"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user) router.push("/login");
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption, imageUrl }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push("/feed");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-6">New Post</h2>
      <form onSubmit={submit}>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <input
          type="url"
          placeholder="Image URL"
          required
          className="w-full px-4 py-3 border rounded-lg mb-3 text-sm outline-none focus:ring-2"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="w-full aspect-square object-cover rounded-lg mb-3 bg-gray-100" />
        )}
        <textarea
          placeholder="Write a caption..."
          rows={3}
          className="w-full px-4 py-3 border rounded-lg mb-4 text-sm outline-none focus:ring-2 resize-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={loading || !imageUrl} className="w-full py-3 rounded-lg text-white font-semibold text-sm disabled:opacity-50" style={{ background: "var(--accent)" }}>
          {loading ? "Posting..." : "Share Post"}
        </button>
      </form>
    </div>
  );
}
