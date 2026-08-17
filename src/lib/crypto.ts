import bcryptjs from "bcryptjs";

export async function hashPassword(password: string) {
  return bcryptjs.hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string) {
  return bcryptjs.compare(password, hashed);
}
