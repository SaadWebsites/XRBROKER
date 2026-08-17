"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(form.email, form.password);
    if ("error" in result) { setError(result.error!); return; }
    router.push("/feed/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>XRBROKER</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Log in to continue</p>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <input type="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-lg mb-3 text-sm outline-none" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-lg mb-4 text-sm outline-none" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="w-full py-3 rounded-lg text-white font-semibold text-sm" style={{ background: "var(--accent)" }}>Log in</button>
        <p className="text-sm text-center mt-4" style={{ color: "var(--muted)" }}>Don&apos;t have an account? <Link href="/signup/" className="font-semibold" style={{ color: "var(--accent)" }}>Sign up</Link></p>
      </form>
    </div>
  );
}
