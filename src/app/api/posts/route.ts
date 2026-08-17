import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, initDb } from "@/lib/db";
import { randomId } from "@/lib/utils";

let dbReady = false;

export async function GET(req: Request) {
  if (!dbReady) { await initDb(); dbReady = true; }
  const session = await getSession();
  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");

  let sql = `
    SELECT p.*, u.username, u.name, u.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
      ${session ? `, (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = '${session.userId}') as liked` : `, 0 as liked`}
    FROM posts p JOIN users u ON p.author_id = u.id
    ${cursor ? `WHERE p.created_at < ?1` : ""}
    ORDER BY p.created_at DESC LIMIT 21
  `;
  const args = cursor ? [cursor] : [];
  const result = await db.execute({ sql, args });
  const rows = result.rows;
  const hasMore = rows.length > 21;
  const items = hasMore ? rows.slice(0, 20) : rows;

  return NextResponse.json({
    posts: items.map((r) => ({
      id: r.id, caption: r.caption, imageUrl: r.image_url, createdAt: r.created_at,
      author: { id: r.author_id, username: r.username, name: r.name, avatar: r.avatar },
      liked: Number(r.liked) > 0, likeCount: Number(r.like_count),
    })),
    nextCursor: hasMore ? items[items.length - 1].created_at : null,
  });
}

export async function POST(req: Request) {
  if (!dbReady) { await initDb(); dbReady = true; }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { caption, imageUrl } = await req.json();
  if (!caption || !imageUrl) {
    return NextResponse.json({ error: "Caption and image URL required" }, { status: 400 });
  }

  const id = randomId();
  await db.execute({
    sql: "INSERT INTO posts (id, caption, image_url, author_id) VALUES (?1, ?2, ?3, ?4)",
    args: [id, caption, imageUrl, session.userId],
  });

  const result = await db.execute({
    sql: `SELECT p.*, u.username, u.name, u.avatar FROM posts p JOIN users u ON p.author_id = u.id WHERE p.id = ?1`,
    args: [id],
  });
  const r = result.rows[0];
  return NextResponse.json({
    ok: true, post: {
      id: r.id, caption: r.caption, imageUrl: r.image_url, createdAt: r.created_at, liked: false, likeCount: 0,
      author: { id: r.author_id, username: r.username, name: r.name, avatar: r.avatar },
    },
  });
}
