"use client";

import { useState } from "react";
import UserCard from "@/components/UserCard";

interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  followerCount: number;
  postCount: number;
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searched, setSearched] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    const res = await fetch(`/api/users?q=${encodeURIComponent(query.trim())}`);
    const data = await res.json();
    setUsers(data.users);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-6">Explore</h2>
      <form onSubmit={search} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2"
        />
        <button type="submit" className="px-6 py-3 rounded-lg text-white text-sm font-semibold" style={{ background: "var(--accent)" }}>
          Search
        </button>
      </form>
      {searched && users.length === 0 && (
        <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>No users found</p>
      )}
      <div className="space-y-3">
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
}
