import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { createSupabaseClient } from "./supabase-client.js";
import { hashPassword } from "./security.js";
import { defaultExperiences, defaultSite } from "./seed-data.js";

const supabase = createSupabaseClient();
const now = new Date().toISOString();

async function seed() {
  console.log("Seeding Supabase database…");

  // ── Site Settings ──────────────────────────────────────────────
  const { data: existingSite } = await supabase.from("site_settings").select("id").eq("id", 1).single();
  if (!existingSite) {
    await supabase.from("site_settings").insert({
      id: 1,
      name: defaultSite.name,
      short_name: defaultSite.shortName,
      email: defaultSite.email,
      phone_display: defaultSite.phoneDisplay,
      phone_href: defaultSite.phoneHref,
      whatsapp_url: defaultSite.whatsappUrl,
      address_json: JSON.stringify(defaultSite.address),
      location_label: defaultSite.locationLabel,
      updated_at: now,
    });
    console.log("✓ Site settings inserted");
  } else {
    console.log("– Site settings already exist, skipping");
  }

  // ── Experiences ────────────────────────────────────────────────
  const { data: existingExps } = await supabase.from("experiences").select("id");
  if (!existingExps?.length) {
    const experienceRows = defaultExperiences.map((exp, index) => ({
      id: exp.id,
      title: exp.title,
      description: exp.description,
      price_cents: exp.priceCents,
      currency: "USD",
      duration: exp.duration,
      image_url: exp.image,
      tag: exp.tag,
      included_json: JSON.stringify(exp.included),
      sort_order: index,
      is_active: 1,
      created_at: now,
      updated_at: now,
    }));
    await supabase.from("experiences").insert(experienceRows);
    console.log(`✓ ${experienceRows.length} experiences inserted`);
  } else {
    console.log("– Experiences already exist, skipping");
  }

  // ── Admin ──────────────────────────────────────────────────────
  const adminEmail = config.adminEmail.toLowerCase();
  const { data: existingAdmin } = await supabase.from("admins").select("id").eq("email", adminEmail).single();
  if (!existingAdmin) {
    if (config.adminPassword.length < 12 || config.adminPassword === "ekika-admin") {
      throw new Error("ADMIN_PASSWORD must contain at least 12 characters before creating an admin account");
    }
    await supabase.from("admins").insert({
      id: randomUUID(),
      email: adminEmail,
      password_hash: hashPassword(config.adminPassword),
      created_at: now,
      updated_at: now,
    });
    console.log(`✓ Admin account created (${adminEmail})`);
  } else {
    console.log("– Admin already exists, skipping");
  }

  console.log("\nSeeding complete.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
