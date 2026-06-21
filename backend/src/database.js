import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { hashPassword } from "./security.js";
import { defaultExperiences, defaultSite } from "./seed-data.js";

export function openDatabase(options = {}) {
  const filename = options.databasePath ?? config.databasePath;
  if (filename !== ":memory:") fs.mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  const schema = fs.readFileSync(path.join(config.backendRoot, "src", "schema.sql"), "utf8");
  db.exec(schema);
  seedDatabase(db, options);
  return db;
}

export function seedDatabase(db, options = {}) {
  const now = new Date().toISOString();
  if (!db.prepare("SELECT id FROM site_settings WHERE id = 1").get()) {
    db.prepare(`
      INSERT INTO site_settings
        (id, name, short_name, email, phone_display, phone_href, whatsapp_url, address_json, location_label, updated_at)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      defaultSite.name,
      defaultSite.shortName,
      defaultSite.email,
      defaultSite.phoneDisplay,
      defaultSite.phoneHref,
      defaultSite.whatsappUrl,
      JSON.stringify(defaultSite.address),
      defaultSite.locationLabel,
      now,
    );
  }

  const experienceCount = db.prepare("SELECT COUNT(*) AS count FROM experiences").get().count;
  if (experienceCount === 0) {
    const insert = db.prepare(`
      INSERT INTO experiences
        (id, title, description, price_cents, currency, duration, image_url, tag, included_json, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, 1, ?, ?)
    `);
    defaultExperiences.forEach((experience, index) => {
      insert.run(
        experience.id,
        experience.title,
        experience.description,
        experience.priceCents,
        experience.duration,
        experience.image,
        experience.tag,
        JSON.stringify(experience.included),
        index,
        now,
        now,
      );
    });
  }

  const email = (options.adminEmail ?? config.adminEmail).toLowerCase();
  const password = options.adminPassword ?? config.adminPassword;
  if (!db.prepare("SELECT id FROM admins WHERE email = ?").get(email)) {
    db.prepare("INSERT INTO admins (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
      .run(randomUUID(), email, hashPassword(password), now, now);
  }
}

export function resetAndSeed(db) {
  db.exec(`
    DELETE FROM audit_log;
    DELETE FROM payments;
    DELETE FROM bookings;
    DELETE FROM inquiries;
    DELETE FROM gallery_items;
    DELETE FROM experiences;
    DELETE FROM site_settings;
    DELETE FROM admins;
    DELETE FROM customer_sessions;
    DELETE FROM customers;
  `);
  seedDatabase(db);
}

export function closeDatabase(db) {
  db.close();
}
