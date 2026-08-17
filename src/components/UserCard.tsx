"use client";

import { useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followerCount: number;
  postCount: number;
}

export default function UserCard({ user, isFollowing: initial }: { user: User; isFollowing?: boolean }) {
  const [following, setFollowing] = useState(initial ?? false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/users/${user.id}/follow`, { method: "POST" });
    const data = await res.json();
    setFollowing(data.following);
  };

  return (
    <Link href={`/profile/${user.id}`} className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:shadow-sm transition">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ background: "var(--accent)" }}>
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{user.username}</p>
        <p className="text-sm truncate" style={{ color: "var(--muted)" }}>{user.name}</p>
        {user.bio && <p className="text-xs mt-1 truncate" style={{ color: "var(--muted)" }}>{user.bio}</p>}
      </div>
      {initial !== undefined && (
        <button
          onClick={toggle}
          className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 transition"
          style={following ? { borderColor: "var(--line)", color: "var(--muted)" } : { background: "var(--accent)", color: "white", border: "none" }}
        >
          {following ? "Following" : "Follow"}
        </button>
      )}
    </Link>
  );
}
