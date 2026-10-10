/**
 * Print a PBKDF2 hash for a password, in the same self-describing format
 * `src/data/auth.server.ts` reads:
 *
 *   pbkdf2$<iterations>$<saltHex>$<hashHex>
 *
 * Used to seed the initial admin password into D1 without ever committing the
 * plaintext, and to reset it later:
 *
 *   node scripts/hash-password.mjs "new password"
 *   npx wrangler d1 execute champs-construction --remote --command \
 *     "INSERT INTO settings (key, value) VALUES ('admin_password_hash', '<hash>') ON CONFLICT(key) DO UPDATE SET value = excluded.value;"
 */
import { pbkdf2Sync, randomBytes } from "node:crypto";

const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "<password>"');
  process.exit(1);
}

const salt = randomBytes(SALT_BYTES);
const hash = pbkdf2Sync(password, salt, ITERATIONS, HASH_BYTES, "sha256");

console.log(`pbkdf2$${ITERATIONS}$${salt.toString("hex")}$${hash.toString("hex")}`);
