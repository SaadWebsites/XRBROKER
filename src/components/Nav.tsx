"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSessionUserId, logout } from "@/lib/store";

export default function Nav() {
  const [userId, setUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setUserId(getSessionUserId()); }, []);

  const doLogout = () => { logout(); setUserId(null); window.location.href = "/"; };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b flex items-center px-4 md:px-8">
      <Link href={userId ? "/feed/" : "/"} className="text-xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>XRBROKER</Link>
      <div className="ml-auto flex items-center gap-4">
        {userId ? (
          <>
            <Link href="/feed/" className="text-sm font-medium hover:opacity-70 hidden sm:block">Feed</Link>
            <Link href="/explore/" className="text-sm font-medium hover:opacity-70 hidden sm:block">Explore</Link>
            <Link href="/post/new/" className="text-sm font-medium hover:opacity-70 hidden sm:block">Post</Link>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--accent)" }}>X</button>
              {menuOpen && (
                <div className="absolute right-0 top-10 bg-white border rounded-xl shadow-lg py-2 min-w-[160px]">
                  <Link href={`/profile/?id=${userId}`} className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link href="/feed/" className="block px-4 py-2 text-sm hover:bg-gray-50 sm:hidden" onClick={() => setMenuOpen(false)}>Feed</Link>
                  <Link href="/explore/" className="block px-4 py-2 text-sm hover:bg-gray-50 sm:hidden" onClick={() => setMenuOpen(false)}>Explore</Link>
                  <Link href="/post/new/" className="block px-4 py-2 text-sm hover:bg-gray-50 sm:hidden" onClick={() => setMenuOpen(false)}>New Post</Link>
                  <hr className="my-1" />
                  <button onClick={doLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600">Log out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login/" className="text-sm font-medium hover:opacity-70">Log in</Link>
            <Link href="/signup/" className="text-sm font-medium px-4 py-2 rounded-lg text-white" style={{ background: "var(--accent)" }}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
