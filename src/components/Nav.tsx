"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [user, setUser] = useState<{ id: string; username: string; name: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b flex items-center px-4 md:px-8">
      <Link href="/" className="text-xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
        XRBROKER
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <>
            <Link href="/feed" className="text-sm font-medium hover:opacity-70 hidden sm:block">Feed</Link>
            <Link href="/explore" className="text-sm font-medium hover:opacity-70 hidden sm:block">Explore</Link>
            <Link href="/post/new" className="text-sm font-medium hover:opacity-70 hidden sm:block">Post</Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "var(--accent)" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 bg-white border rounded-xl shadow-lg py-2 min-w-[160px]">
                  <Link href={`/profile/${user.id}`} className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link href="/feed" className="block px-4 py-2 text-sm hover:bg-gray-50 sm:hidden" onClick={() => setMenuOpen(false)}>
                    Feed
                  </Link>
                  <Link href="/explore" className="block px-4 py-2 text-sm hover:bg-gray-50 sm:hidden" onClick={() => setMenuOpen(false)}>
                    Explore
                  </Link>
                  <Link href="/post/new" className="block px-4 py-2 text-sm hover:bg-gray-50 sm:hidden" onClick={() => setMenuOpen(false)}>
                    New Post
                  </Link>
                  <hr className="my-1" />
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600">
                    Log out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium hover:opacity-70">Log in</Link>
            <Link href="/signup" className="text-sm font-medium px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
