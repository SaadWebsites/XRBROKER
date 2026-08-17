"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";

interface Post {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
  author: { id: string; username: string; name: string; avatar: string };
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user) router.push("/login");
    });
    fetchFeed();
  }, []);

  const fetchFeed = async (c?: string) => {
    const url = c ? `/api/posts?cursor=${c}` : "/api/posts";
    const res = await fetch(url);
    const data = await res.json();
    setPosts((prev) => (c ? [...prev, ...data.posts] : data.posts));
    setCursor(data.nextCursor);
    setLoading(false);
    setLoadingMore(false);
  };

  const loadMore = () => {
    if (!cursor) return;
    setLoadingMore(true);
    fetchFeed(cursor);
  };

  if (loading) return <div className="flex justify-center py-20 text-sm" style={{ color: "var(--muted)" }}>Loading...</div>;

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
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {cursor && (
            <button onClick={loadMore} disabled={loadingMore} className="w-full py-3 text-sm font-semibold rounded-lg border" style={{ borderColor: "var(--line)", color: "var(--accent)" }}>
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
