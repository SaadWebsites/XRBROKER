"use client";

import { useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
  author: { id: string; username: string; name: string; avatar: string };
}

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const toggleLike = async () => {
    const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
    setLikeCount((c) => (data.liked ? c + 1 : c - 1));
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3 p-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "var(--accent)" }}>
          {post.author.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold">{post.author.username}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </Link>
      <img src={post.imageUrl} alt={post.caption} className="w-full aspect-square object-cover bg-gray-100" />
      <div className="p-4">
        <p className="text-sm mb-3">{post.caption}</p>
        <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm" style={{ color: liked ? "#EF4444" : "var(--muted)" }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likeCount}
        </button>
      </div>
    </div>
  );
}
