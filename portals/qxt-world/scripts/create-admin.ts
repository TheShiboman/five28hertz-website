import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { storage } from "../server/storage";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin() {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD environment variable is required");
  }

  const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);

  try {
    const admin = await storage.createUser({
      username: process.env.ADMIN_USERNAME || "admin",
      password: hashedPassword,
      role: "admin",
      fullName: process.env.ADMIN_FULL_NAME || "System Administrator",
      email: process.env.ADMIN_EMAIL || "admin@qxtworld.com"
    });
    console.log("Admin user created successfully:", admin.username);
  } catch (error) {
    console.error("Failed to create admin:", error);
  }
}

createAdmin().catch(console.error);