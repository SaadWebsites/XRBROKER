"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getUser, getUserPosts, toggleFollow, isFollowing, getFollowerCount, getFollowingCount, getPostCount, getSessionUserId } from "@/lib/store";

function ProfileInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [posts, setPosts] = useState<ReturnType<typeof getUserPosts>>([]);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const me = getSessionUserId();

  useEffect(() => {
    if (!id) { router.push("/explore/"); return; }
    const u = getUser(id);
    setUser(u);
    setPosts(getUserPosts(id));
    setFollowing(isFollowing(id));
    setFollowerCount(getFollowerCount(id));
    setFollowingCount(getFollowingCount(id));
    setPostCount(getPostCount(id));
  }, [id]);

  if (!user) return <div className="flex justify-center py-20 text-sm" style={{ color: "var(--muted)" }}>Not found</div>;

  const toggle = () => {
    const now = toggleFollow(user!.id);
    setFollowing(now);
    setFollowerCount((c) => now ? c + 1 : c - 1);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: "var(--accent)" }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-lg">{user.username}</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{user.name}</p>
          <div className="flex gap-4 mt-1 text-xs" style={{ color: "var(--muted)" }}>
            <span><strong>{postCount}</strong> posts</span>
            <span><strong>{followerCount}</strong> followers</span>
            <span><strong>{followingCount}</strong> following</span>
          </div>
        </div>
      </div>
      {user.bio && <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>{user.bio}</p>}
      {me && me !== user.id && (
        <button onClick={toggle} className="mb-6 px-6 py-2 rounded-lg text-sm font-semibold transition"
          style={following ? { border: "1px solid var(--line)", color: "var(--muted)" } : { background: "var(--accent)", color: "white" }}>
          {following ? "Following" : "Follow"}
        </button>
      )}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>No posts yet</p>
        ) : posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20 text-sm" style={{ color: "var(--muted)" }}>Loading...</div>}>
      <ProfileInner />
    </Suspense>
  );
}
