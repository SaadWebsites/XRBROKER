"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getFeedPosts, getSessionUserId } from "@/lib/store";

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ReturnType<typeof getFeedPosts>>([]);

  useEffect(() => {
    if (!getSessionUserId()) { router.push("/login/"); return; }
    setPosts(getFeedPosts());
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-6">Feed</h2>
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>No posts yet</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Follow people or create a post to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
