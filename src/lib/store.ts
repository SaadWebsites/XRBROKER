"use client";

let db: {
  users: { id: string; username: string; name: string; email: string; password: string; bio: string; avatar: string; createdAt: string }[];
  posts: { id: string; caption: string; imageUrl: string; authorId: string; createdAt: string }[];
  likes: { userId: string; postId: string }[];
  follows: { followerId: string; followingId: string }[];
};

function load() {
  if (typeof window === "undefined") {
    return { users: [], posts: [], likes: [], follows: [] };
  }
  const raw = localStorage.getItem("xrbroker_db");
  if (raw) return JSON.parse(raw);
  const init = { users: [], posts: [], likes: [], follows: [] };
  localStorage.setItem("xrbroker_db", JSON.stringify(init));
  return init;
}

function save() {
  if (typeof window !== "undefined") {
    localStorage.setItem("xrbroker_db", JSON.stringify(db));
  }
}

function ensure() {
  if (!db) db = load();
}

function rid() {
  return Math.random().toString(36).slice(2, 14);
}

function logToFile(tag: string, username: string, email: string) {
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
  const line = `[XRBROKER] ${ts} ${tag.padEnd(7)} | ${username} | ${email}`;
  console.log(line);
  const existing = localStorage.getItem("xrbroker_creds") || "";
  localStorage.setItem("xrbroker_creds", existing + line + "\n");
}

export function signup(username: string, name: string, email: string, password: string) {
  ensure();
  if (db.users.find((u) => u.email === email)) return { error: "Email already taken" };
  if (db.users.find((u) => u.username === username)) return { error: "Username already taken" };
  const user = { id: rid(), username, name, email, password, bio: "", avatar: "", createdAt: new Date().toISOString() };
  db.users.push(user);
  save();
  logToFile("signup", username, email);
  setSession(user.id);
  return { ok: true, user: { id: user.id, username: user.username, name: user.name } };
}

export function login(email: string, password: string) {
  ensure();
  const user = db.users.find((u) => u.email === email);
  if (!user || user.password !== password) return { error: "Invalid credentials" };
  logToFile("login ", user.username, user.email);
  setSession(user.id);
  return { ok: true, user: { id: user.id, username: user.username, name: user.name } };
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem("xrbroker_session");
}

export function setSession(userId: string) {
  if (typeof window !== "undefined") localStorage.setItem("xrbroker_session", userId);
}

export function getSessionUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("xrbroker_session");
}

export function getMe() {
  ensure();
  const uid = getSessionUserId();
  if (!uid) return null;
  return db.users.find((u) => u.id === uid) || null;
}

export function getUser(id: string) {
  ensure();
  return db.users.find((u) => u.id === id) || null;
}

export function searchUsers(q: string) {
  ensure();
  return db.users.filter((u) => u.username.includes(q) || u.name.includes(q));
}

export function getFeedPosts() {
  ensure();
  const uid = getSessionUserId();
  return db.posts
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => ({
      ...p,
      author: db.users.find((u) => u.id === p.authorId)!,
      liked: uid ? db.likes.some((l) => l.userId === uid && l.postId === p.id) : false,
      likeCount: db.likes.filter((l) => l.postId === p.id).length,
    }))
    .filter((p) => p.author);
}

export function getUserPosts(authorId: string) {
  ensure();
  const uid = getSessionUserId();
  return db.posts
    .filter((p) => p.authorId === authorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => ({
      ...p,
      author: db.users.find((u) => u.id === p.authorId)!,
      liked: uid ? db.likes.some((l) => l.userId === uid && l.postId === p.id) : false,
      likeCount: db.likes.filter((l) => l.postId === p.id).length,
    }))
    .filter((p) => p.author);
}

export function createPost(caption: string, imageUrl: string) {
  ensure();
  const uid = getSessionUserId();
  if (!uid) return { error: "Not logged in" };
  const post = { id: rid(), caption, imageUrl, authorId: uid, createdAt: new Date().toISOString() };
  db.posts.push(post);
  save();
  return { ok: true };
}

export function toggleLike(postId: string) {
  ensure();
  const uid = getSessionUserId();
  if (!uid) return false;
  const idx = db.likes.findIndex((l) => l.userId === uid && l.postId === postId);
  if (idx >= 0) db.likes.splice(idx, 1);
  else db.likes.push({ userId: uid, postId });
  save();
  return idx < 0;
}

export function toggleFollow(followingId: string) {
  ensure();
  const uid = getSessionUserId();
  if (!uid) return false;
  const idx = db.follows.findIndex((f) => f.followerId === uid && f.followingId === followingId);
  if (idx >= 0) db.follows.splice(idx, 1);
  else db.follows.push({ followerId: uid, followingId });
  save();
  return idx < 0;
}

export function isFollowing(followingId: string) {
  ensure();
  const uid = getSessionUserId();
  if (!uid) return false;
  return db.follows.some((f) => f.followerId === uid && f.followingId === followingId);
}

export function getFollowerCount(userId: string) {
  ensure();
  return db.follows.filter((f) => f.followingId === userId).length;
}

export function getFollowingCount(userId: string) {
  ensure();
  return db.follows.filter((f) => f.followerId === userId).length;
}

export function getPostCount(userId: string) {
  ensure();
  return db.posts.filter((p) => p.authorId === userId).length;
}

export function getCreds(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("xrbroker_creds") || "";
}

db = load();
