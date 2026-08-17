"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, getSessionUserId } from "@/lib/store";

export default function NewPostPage() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { if (!getSessionUserId()) router.push("/login/"); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = createPost(caption, imageUrl);
    if ("error" in result) { setError(result.error!); return; }
    router.push("/feed/");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-6">New Post</h2>
      <form onSubmit={submit}>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <input type="url" placeholder="Image URL" required className="w-full px-4 py-3 border rounded-lg mb-3 text-sm outline-none" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        {imageUrl && <img src={imageUrl} alt="Preview" className="w-full aspect-square object-cover rounded-lg mb-3 bg-gray-100" />}
        <textarea placeholder="Write a caption..." rows={3} className="w-full px-4 py-3 border rounded-lg mb-4 text-sm outline-none resize-none" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <button type="submit" disabled={!imageUrl} className="w-full py-3 rounded-lg text-white font-semibold text-sm disabled:opacity-50" style={{ background: "var(--accent)" }}>Share Post</button>
      </form>
    </div>
  );
}
