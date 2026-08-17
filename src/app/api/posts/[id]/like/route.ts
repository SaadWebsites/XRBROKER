import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, initDb } from "@/lib/db";

let dbReady = false;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!dbReady) { await initDb(); dbReady = true; }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: postId } = await params;

  const existing = await db.execute({
    sql: "SELECT id FROM likes WHERE user_id = ?1 AND post_id = ?2",
    args: [session.userId, postId],
  });

  if (existing.rows.length > 0) {
    await db.execute({ sql: "DELETE FROM likes WHERE user_id = ?1 AND post_id = ?2", args: [session.userId, postId] });
    return NextResponse.json({ liked: false });
  }

  const { randomId } = await import("@/lib/utils");
  await db.execute({ sql: "INSERT INTO likes (id, user_id, post_id) VALUES (?1, ?2, ?3)", args: [randomId(), session.userId, postId] });
  return NextResponse.json({ liked: true });
}
