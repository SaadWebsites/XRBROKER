import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { log } from "@/lib/log";
import { verifyPassword } from "@/lib/crypto";
import { createToken, setSessionCookie } from "@/lib/auth";

let dbReady = false;

export async function POST(req: Request) {
  try {
    if (!dbReady) { await initDb(); dbReady = true; }
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await db.execute({ sql: "SELECT * FROM users WHERE email = ?1", args: [email] });
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password as string);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    log("login ", user.username as string, user.email as string);
    const token = await createToken({ userId: user.id as string, username: user.username as string });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, name: user.name } });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
