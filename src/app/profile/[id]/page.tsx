"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";

interface UserProfile {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
}

interface Post {
  id: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  liked: boolean;
  likeCount: number;
  author: { id: string; username: string; name: string; avatar: string };
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setMe(d.user?.id));
    fetch(`/api/users/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return router.push("/feed");
        setProfile(d.user);
        setPosts(d.posts);
        setLoading(false);
      });
  }, [params.id]);

  const toggleFollow = async () => {
    if (!profile) return;
    const res = await fetch(`/api/users/${profile.id}/follow`, { method: "POST" });
    const data = await res.json();
    setProfile({ ...profile, isFollowing: data.following, followerCount: profile.followerCount + (data.following ? 1 : -1) });
  };

  if (loading || !profile) return <div className="flex justify-center py-20 text-sm" style={{ color: "var(--muted)" }}>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: "var(--accent)" }}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-lg">{profile.username}</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{profile.name}</p>
          <div className="flex gap-4 mt-1 text-xs" style={{ color: "var(--muted)" }}>
            <span><strong>{profile.postCount}</strong> posts</span>
            <span><strong>{profile.followerCount}</strong> followers</span>
            <span><strong>{profile.followingCount}</strong> following</span>
          </div>
        </div>
      </div>
      {profile.bio && <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>{profile.bio}</p>}
      {me && me !== profile.id && (
        <button onClick={toggleFollow} className="mb-6 px-6 py-2 rounded-lg text-sm font-semibold transition"
          style={profile.isFollowing ? { border: "1px solid var(--line)", color: "var(--muted)" } : { background: "var(--accent)", color: "white" }}>
          {profile.isFollowing ? "Following" : "Follow"}
        </button>
      )}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>No posts yet</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
