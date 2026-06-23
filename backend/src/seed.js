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
  }

  // ── Reviews ────────────────────────────────────────────────────
  const { data: existingReviews } = await supabase.from("reviews").select("id");
  if (!existingReviews?.length) {
    const defaultReviews = [
      {
        id: randomUUID(),
        reviewer_name: "Sarah Mitchell",
        reviewer_photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-o54n0qT_eGcn6WAZZUT6kid4_hqixsVsCnwILW7uVkBoeW-HSDYSePfun781BWxJmFiWRff7uXyM2q9us0nlXTVUfzKAj769WZeEXDDhBPDAS6oa5tuzDRl6crVx6bFlNKrWcn408jj9BaLAuk5MzVCGheVML_3Z6H06aI35tZB5p0JoROfDVd04ba4x8NOLCaNrjHeUDt0JugsmadKZWVkxKGxFJnd9Lewtq4HPhW-dQHJir8mmDyN8jvHLkLRdBAI3va14gUg",
        experience_title: "Cultural Food Tasting & Cooking Lessons",
        rating: 5,
        comment: "The dance ceremony was like nothing I've ever seen. The energy, the drums, the warmth of the village—it truly felt like a transformation rather than just a tour.",
        is_active: 1,
        sort_order: 0,
        created_at: now,
        updated_at: now,
      },
      {
        id: randomUUID(),
        reviewer_name: "David Chen",
        reviewer_photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDADczsgIavf_eTu17Kug62piQ2INIn8XxViepin2Yr9ZezJ496ILeenlqSXL5E-3rC0JzuX-H6MGMzqyco-sEhw3SOe5Z729wPrCWtJrbl2oiB7o33jEkE2JFdrEVrY2ZmWKRXhBmZd_vDNUi-5Ch-ZmJDGsUk6ZhyJCIKfAlRdprlPbfpuQ5il6Vra_OAYP6lRbJJFODdwUUoqnFCEiICY6B7A3H7AZFz0MgeVUGXSbn2l9-miaS0ZRB_LLlsBnPJE-Wf3V7I9lI",
        experience_title: "Traditional Games",
        rating: 5,
        comment: "Beyond the beautiful landscapes, it's the people that make this place special. We spent a day learning traditional farming and it was the highlight of our Uganda trip.",
        is_active: 1,
        sort_order: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: randomUUID(),
        reviewer_name: "Elena Rodriguez",
        reviewer_photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhE9CEdTV-dh1rAekKvpu86WgbS8J-_gchD3RRdOhqfwrOOljzMRrcYWEx1VTgdddOYh4UUZ4fvF6cjKi7qwxiZLmBx8hwzuknAWTAe_mSSRkx40pw9EOzjanth-dtM1XnXk2wqdRjIkQk1e_cz3Q0IHpkr5gsD4IrjSlx9R314CiexqT-84idB0NZ9pmYBfIz1UQZwjb4PQBJ0IQhXnYpfIlU767D7cFz2D1iizHMnMXcxZPC-CGe1sk_KRNOfqdz56qNuSzMRME",
        experience_title: "Story Telling Sessions",
        rating: 5,
        comment: "As a solo traveler, I felt completely safe and welcomed. The guides are incredibly knowledgeable about their history and very passionate.",
        is_active: 1,
        sort_order: 2,
        created_at: now,
        updated_at: now,
      }
    ];
    await supabase.from("reviews").insert(defaultReviews);
    console.log(`✓ ${defaultReviews.length} default reviews inserted`);
  } else {
    console.log("– Reviews already exist, skipping");
  }

  console.log("\nSeeding complete.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
