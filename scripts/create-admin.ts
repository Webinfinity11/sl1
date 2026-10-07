// Creates an admin, or resets the password of an existing one.
// Usage: npx tsx scripts/create-admin.ts <email> <password>
import "./env";
import bcrypt from "bcryptjs";
import { admins, db } from "../src/db";

const [email, password] = process.argv.slice(2);
if (!email || !password || password.length < 6) {
  console.error("usage: create-admin.ts <email> <password (6+ chars)>");
  process.exit(1);
}

(async () => {
  const passwordHash = await bcrypt.hash(password, 10);
  await db
    .insert(admins)
    .values({ email: email.toLowerCase(), passwordHash })
    .onConflictDoUpdate({ target: admins.email, set: { passwordHash } });
  console.log(`admin ready: ${email.toLowerCase()}`);
})();
