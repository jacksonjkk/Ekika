import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { createSupabaseClient } from "./supabase-client.js";
import { hashPassword } from "./security.js";

const supabase = createSupabaseClient();
const now = new Date().toISOString();

async function setAdmin() {
  console.log("Configuring Admin Account...");
  const adminEmail = config.adminEmail.toLowerCase();
  
  if (config.adminPassword.length < 12 || config.adminPassword === "ekika-admin") {
    throw new Error("ADMIN_PASSWORD must contain at least 12 characters before creating/updating an admin account");
  }

  const { data: existingAdmin } = await supabase.from("admins").select("id").eq("email", adminEmail).single();

  if (existingAdmin) {
    await supabase.from("admins").update({
      password_hash: hashPassword(config.adminPassword),
      updated_at: now,
    }).eq("id", existingAdmin.id);
    console.log(`✓ Admin account password updated for (${adminEmail})`);
  } else {
    await supabase.from("admins").insert({
      id: randomUUID(),
      email: adminEmail,
      password_hash: hashPassword(config.adminPassword),
      created_at: now,
      updated_at: now,
    });
    console.log(`✓ Admin account created (${adminEmail})`);
  }
  
  console.log("\nAdmin configuration complete.");
}

setAdmin().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
