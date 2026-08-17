"use client";

import { useState } from "react";
import UserCard from "@/components/UserCard";
import { searchUsers, getSessionUserId } from "@/lib/store";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<ReturnType<typeof searchUsers>>([]);
  const [searched, setSearched] = useState(false);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    setUsers(searchUsers(query.trim()));
  };

  const me = getSessionUserId();

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-6">Explore</h2>
      <form onSubmit={search} className="flex gap-2 mb-6">
        <input type="text" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 px-4 py-3 border rounded-lg text-sm outline-none" />
        <button type="submit" className="px-6 py-3 rounded-lg text-white text-sm font-semibold" style={{ background: "var(--accent)" }}>Search</button>
      </form>
      {searched && users.length === 0 && <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>No users found</p>}
      <div className="space-y-3">
        {users.filter((u) => u.id !== me).map((u) => (
          <UserCard key={u.id} id={u.id} username={u.username} name={u.name} bio={u.bio} showFollow />
        ))}
      </div>
    </div>
  );
}
