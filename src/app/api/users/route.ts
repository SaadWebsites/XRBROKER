import { NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";

let dbReady = false;

export async function GET(req: Request) {
  if (!dbReady) { await initDb(); dbReady = true; }
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ users: [] });

  const result = await db.execute({
    sql: `SELECT u.id, u.username, u.name, u.bio, u.avatar,
      (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count,
      (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as post_count
      FROM users u WHERE u.username LIKE ?1 OR u.name LIKE ?1 LIMIT 20`,
    args: [`%${q}%`],
  });

  return NextResponse.json({
    users: result.rows.map((u) => ({
      id: u.id, username: u.username, name: u.name, bio: u.bio, avatar: u.avatar,
      followerCount: Number(u.follower_count), postCount: Number(u.post_count),
    })),
  });
}
