import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, initDb } from "@/lib/db";

let dbReady = false;

export async function GET() {
  if (!dbReady) { await initDb(); dbReady = true; }
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  const result = await db.execute({
    sql: "SELECT id, username, name, email, bio, avatar, created_at FROM users WHERE id = ?1",
    args: [session.userId],
  });
  if (result.rows.length === 0) return NextResponse.json({ user: null });
  const u = result.rows[0];
  return NextResponse.json({
    user: { id: u.id, username: u.username, name: u.name, email: u.email, bio: u.bio, avatar: u.avatar, createdAt: u.created_at },
  });
}
