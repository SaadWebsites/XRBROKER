"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push("/feed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>XRBROKER</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Create your account</p>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <input type="text" placeholder="Username" required className="w-full px-4 py-3 border rounded-lg mb-3 text-sm outline-none focus:ring-2" style={{ "--tw-ring-color": "var(--accent)" } as React.CSSProperties}
          value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input type="text" placeholder="Full name" required className="w-full px-4 py-3 border rounded-lg mb-3 text-sm outline-none focus:ring-2"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-lg mb-3 text-sm outline-none focus:ring-2"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password (6+ chars)" required className="w-full px-4 py-3 border rounded-lg mb-4 text-sm outline-none focus:ring-2"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-white font-semibold text-sm disabled:opacity-50" style={{ background: "var(--accent)" }}>
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="text-sm text-center mt-4" style={{ color: "var(--muted)" }}>
          Have an account? <Link href="/login" className="font-semibold" style={{ color: "var(--accent)" }}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
