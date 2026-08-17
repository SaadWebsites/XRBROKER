import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4" style={{ color: "var(--accent)" }}>XRBROKER</h1>
      <p className="text-lg md:text-xl max-w-md mb-8" style={{ color: "var(--muted)" }}>Share moments. Connect with people. Be yourself.</p>
      <div className="flex gap-4">
        <Link href="/signup/" className="px-8 py-3 rounded-xl text-white font-semibold text-lg" style={{ background: "var(--accent)" }}>Get Started</Link>
        <Link href="/login/" className="px-8 py-3 rounded-xl font-semibold text-lg border" style={{ borderColor: "var(--line)" }}>Log In</Link>
      </div>
    </div>
  );
}
