import { randomBytes } from "crypto";

export function randomId() {
  return randomBytes(12).toString("hex");
}
