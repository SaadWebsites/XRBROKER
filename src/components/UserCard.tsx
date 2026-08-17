"use client";

import { useState } from "react";
import Link from "next/link";
import { toggleFollow, isFollowing } from "@/lib/store";

interface UserCardProps {
  id: string;
  username: string;
  name: string;
  bio: string;
  followerCount?: number;
  postCount?: number;
  showFollow?: boolean;
}

export default function UserCard(props: UserCardProps) {
  const [following, setFollowing] = useState(() => isFollowing(props.id));

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setFollowing(toggleFollow(props.id));
  };

  return (
    <Link href={`/profile/?id=${props.id}`} className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:shadow-sm transition">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ background: "var(--accent)" }}>
        {props.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{props.username}</p>
        <p className="text-sm truncate" style={{ color: "var(--muted)" }}>{props.name}</p>
        {props.bio && <p className="text-xs mt-1 truncate" style={{ color: "var(--muted)" }}>{props.bio}</p>}
      </div>
      {props.showFollow && (
        <button onClick={toggle} className="text-xs font-semibold px-4 py-1.5 rounded-lg border flex-shrink-0 transition"
          style={following ? { borderColor: "var(--line)", color: "var(--muted)" } : { background: "var(--accent)", color: "white", border: "none" }}>
          {following ? "Following" : "Follow"}
        </button>
      )}
    </Link>
  );
}
