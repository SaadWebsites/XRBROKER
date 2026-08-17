import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, initDb } from "@/lib/db";
import { randomId } from "@/lib/utils";

let dbReady = false;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!dbReady) { await initDb(); dbReady = true; }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: followingId } = await params;

  if (session.userId === followingId) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  const existing = await db.execute({
    sql: "SELECT id FROM follows WHERE follower_id = ?1 AND following_id = ?2",
    args: [session.userId, followingId],
  });

  if (existing.rows.length > 0) {
    await db.execute({ sql: "DELETE FROM follows WHERE follower_id = ?1 AND following_id = ?2", args: [session.userId, followingId] });
    return NextResponse.json({ following: false });
  }

  await db.execute({ sql: "INSERT INTO follows (id, follower_id, following_id) VALUES (?1, ?2, ?3)", args: [randomId(), session.userId, followingId] });
  return NextResponse.json({ following: true });
}
