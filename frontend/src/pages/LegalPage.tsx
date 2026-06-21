import { Link } from "react-router-dom";
import { useSiteContent } from "../data/content";

type LegalPageProps = {
  type: "privacy" | "terms" | "safety";
};

const content = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    intro:
      "We collect only the details needed to respond to inquiries, plan experiences, and keep travelers informed before their visit.",
    sections: [
      "Booking and contact details are used to coordinate your trip and respond to your requests.",
      "We do not sell visitor information. If online payments or analytics are added later, this page should be updated before launch.",
      "You can contact us to correct or remove details shared through the website.",
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Service",
    intro:
      "These terms outline the basic expectations for booking and joining an Ekika Cultural Experience.",
    sections: [
      "Experiences are confirmed after our team contacts you and agrees on date, group size, and itinerary.",
      "Prices, activity duration, and availability may change based on season, weather, and group needs.",
      "Travelers are expected to respect hosts, cultural sites, community guidance, and local safety instructions.",
    ],
  },
  safety: {
    eyebrow: "Safety",
    title: "Traveler Safety",
    intro:
      "Our team helps visitors prepare for highland terrain, changing weather, and respectful community participation.",
    sections: [
      "Wear comfortable walking shoes, carry water, and share medical or dietary needs before arrival.",
      "Some activities involve hills, farms, cooking areas, or dance. Guides will adapt the pace where possible.",
      "For urgent travel changes, contact the team by phone or WhatsApp before your scheduled visit.",
    ],
  },
};

export default function LegalPage({ type }: LegalPageProps) {
  const { site } = useSiteContent();
  const page = content[type];

  return (
    <main className="pt-28 sm:pt-36 lg:pt-48 pb-16 md:pb-24 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
      <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-sm font-bold tracking-widest uppercase mb-6">
        {page.eyebrow}
      </span>
      <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface mb-6 md:mb-8">
        {page.title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-3xl mb-10 md:mb-12">
        {page.intro}
      </p>
      <div className="grid gap-6 mb-12">
        {page.sections.map((section) => (
          <article key={section} className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
            <p className="text-on-surface-variant leading-relaxed">{section}</p>
          </article>
        ))}
      </div>
      <div className="bg-primary text-on-primary rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between min-w-0">
        <div>
          <h2 className="font-headline text-2xl font-black mb-2">Need clarification?</h2>
          <p className="text-on-primary/80 break-words">Reach us at {site.email} before confirming your visit.</p>
        </div>
        <Link to="/contact" className="inline-flex items-center justify-center bg-white text-primary px-6 py-3 rounded-xl font-bold">
          Contact Us
        </Link>
      </div>
    </main>
  );
}
