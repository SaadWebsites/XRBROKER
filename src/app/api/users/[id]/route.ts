import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, initDb } from "@/lib/db";

let dbReady = false;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!dbReady) { await initDb(); dbReady = true; }
  const { id } = await params;
  const session = await getSession();

  const uRes = await db.execute({
    sql: `SELECT u.*,
      (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
      (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as post_count
      FROM users u WHERE u.id = ?1`,
    args: [id],
  });
  if (uRes.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const u = uRes.rows[0];

  let isFollowing = false;
  if (session) {
    const f = await db.execute({
      sql: "SELECT id FROM follows WHERE follower_id = ?1 AND following_id = ?2",
      args: [session.userId, id],
    });
    isFollowing = f.rows.length > 0;
  }

  const postsRes = await db.execute({
    sql: `SELECT p.*, us.username, us.name, us.avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count
      ${session ? `, (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = '${session.userId}') as liked` : `, 0 as liked`}
      FROM posts p JOIN users us ON p.author_id = us.id
      WHERE p.author_id = ?1 ORDER BY p.created_at DESC`,
    args: [id],
  });

  return NextResponse.json({
    user: {
      id: u.id, username: u.username, name: u.name, bio: u.bio, avatar: u.avatar, isFollowing,
      followerCount: Number(u.follower_count), followingCount: Number(u.following_count), postCount: Number(u.post_count),
    },
    posts: postsRes.rows.map((p) => ({
      id: p.id, caption: p.caption, imageUrl: p.image_url, createdAt: p.created_at,
      author: { id: p.author_id, username: p.username, name: p.name, avatar: p.avatar },
      liked: Number(p.liked) > 0, likeCount: Number(p.like_count),
    })),
  });
}
