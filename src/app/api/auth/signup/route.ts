import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { log } from "@/lib/log";
import { hashPassword } from "@/lib/crypto";
import { createToken, setSessionCookie } from "@/lib/auth";
import { randomId } from "@/lib/utils";

let dbReady = false;

export async function POST(req: Request) {
  try {
    if (!dbReady) { await initDb(); dbReady = true; }
    const { username, name, email, password } = await req.json();
    if (!username || !name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be 6+ characters" }, { status: 400 });
    }

    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?1 OR username = ?2",
      args: [email, username],
    });
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email or username already taken" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const id = randomId();
    await db.execute({
      sql: "INSERT INTO users (id, username, name, email, password) VALUES (?1, ?2, ?3, ?4, ?5)",
      args: [id, username, name, email, hashed],
    });

    log("signup", username, email);
    const token = await createToken({ userId: id, username });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, user: { id, username, name } });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
