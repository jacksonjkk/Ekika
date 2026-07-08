import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { hashPassword } from "./security.js";
import { defaultExperiences, defaultSite, legacyExperienceIds } from "./seed-data.js";

export function openDatabase(options = {}) {
  const filename = options.databasePath ?? config.databasePath;
  if (filename !== ":memory:") fs.mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  const schema = fs.readFileSync(path.join(config.backendRoot, "src", "schema.sql"), "utf8");
  db.exec(schema);
  ensurePackageSlideshowColumn(db);
  migrateLegacyExperiencesToPackages(db);
  seedDatabase(db, options);
  return db;
}

function ensurePackageSlideshowColumn(db) {
  const columns = db.prepare("PRAGMA table_info(packages)").all().map((column) => column.name);
  if (columns.includes("slideshow_images_json")) return;
  db.exec("ALTER TABLE packages ADD COLUMN slideshow_images_json TEXT NOT NULL DEFAULT '[]';");
}

function migrateLegacyExperiencesToPackages(db) {
  const hasPackagesTable = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'packages'").get();
  const hasExperiencesTable = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'experiences'").get();
  if (!hasPackagesTable || !hasExperiencesTable) return;

  const packageCount = db.prepare("SELECT COUNT(*) AS count FROM packages").get().count;
  if (packageCount > 0) return;

  const experienceCount = db.prepare("SELECT COUNT(*) AS count FROM experiences").get().count;
  if (experienceCount === 0) return;

  db.exec(`
    INSERT INTO packages (id, title, description, price_cents, currency, duration, image_url, slideshow_images_json, tag, included_json, sort_order, is_active, created_at, updated_at)
    SELECT id, title, description, price_cents, currency, duration, image_url, '[]', tag, included_json, sort_order, is_active, created_at, updated_at
    FROM experiences;
  `);
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

  const defaultExperienceIds = defaultExperiences.map((experience) => experience.id);
  const defaultPlaceholders = defaultExperienceIds.map(() => "?").join(",");
  const defaultPackageCount = db.prepare(`SELECT COUNT(*) AS count FROM packages WHERE id IN (${defaultPlaceholders})`).get(...defaultExperienceIds).count;
  const packageCount = db.prepare("SELECT COUNT(*) AS count FROM packages").get().count;
  if (packageCount === 0 || defaultPackageCount < defaultExperiences.length) {
    if (packageCount > 0 && legacyExperienceIds.length) {
      const legacyPlaceholders = legacyExperienceIds.map(() => "?").join(",");
      db.prepare(`UPDATE packages SET is_active = 0, updated_at = ? WHERE id IN (${legacyPlaceholders})`).run(now, ...legacyExperienceIds);
    }
    const insert = db.prepare(`
      INSERT INTO packages
        (id, title, description, price_cents, currency, duration, image_url, slideshow_images_json, tag, included_json, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);
    defaultExperiences.forEach((experience, index) => {
      if (db.prepare("SELECT id FROM packages WHERE id = ?").get(experience.id)) return;
      insert.run(
        experience.id,
        experience.title,
        experience.description,
        experience.priceCents,
        experience.duration,
        experience.image,
        JSON.stringify(experience.slideshowImages ?? [experience.image]),
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
    DELETE FROM packages;
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
