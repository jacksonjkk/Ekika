import { useEffect, useState } from "react";
import { apiRequest, getAdminToken } from "./api";

export type EditableSiteInfo = {
  name: string;
  shortName: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappUrl: string;
  address: string[];
  locationLabel: string;
};

export type EditableExperience = {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  tag: string;
  included: string[];
};

export type SiteContent = {
  site: EditableSiteInfo;
  experiences: EditableExperience[];
};

const STORAGE_KEY = "ekika-site-content";

export const defaultContent: SiteContent = {
  site: {
    name: "Ekika Cultural Experience",
    shortName: "Ekika",
    email: "hello@ekikaexperience.ug",
    phoneDisplay: "+256 700 000 000",
    phoneHref: "tel:+256700000000",
    whatsappUrl: "https://wa.me/256700000000",
    address: ["Kabale-Lake Bunyonyi Road", "Kigezi Highlands, South Western Uganda", "P.O. Box 42, Kabale"],
    locationLabel: "Kabale District, Kigezi Region, Uganda",
  },
  experiences: [
    {
      id: "food-cooking",
      title: "Cultural Food Tasting & Cooking Lessons",
      description: "Master the art of preparing traditional millet bread (Oburo) and enjoy the rich, earthy flavors of our highland soil.",
      price: "$45",
      duration: "3 Hours",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs1DwY3lmZUoGlvfZoINxau6S8Hz3Jj4HzIKgdzDst0dK9yx6I3KYH4Sc6hc0TPTdshhegVCwf2rQoxzWSSj3YjHuhnEXn4LP_vLwV3Q9w5mxyOkU-6l3qvbxDGUjnihHA3X52eD_meCbolk9HjaYb6AynB3_GnGJ0qGjJoQpDCrUf8uDNzuP5MD7wwoy_qjyBu2tMysDL0kcWULW1AvuduuLGKS9YY1jIZBDmMW_VWxmOjtx3ldzzC3SeDgFOLrzrRqbL7j7QVA0",
      tag: "Most Popular",
      included: ["Traditional lunch included", "Local host guide", "Recipe notes"],
    },
    {
      id: "storytelling",
      title: "Story Telling Sessions",
      description: "Gather around the evening embers as elders recount legends of the ancestors and the spirits of the mountains.",
      price: "$25",
      duration: "2 Hours",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7966SouRc5zHc0oFnseCvOV7vUuvMV7AE3cDz6qmC0AzSDlh1dBIl7i0znUREFlVRqMCj3JLtkLDCWqGjOmUB2KxtEjTPQQcIxQxRAIEqjHx5AEHqPgvPtmBPgS33HQ0Dm_wPvGkqjRcBt_NlxhUNi5KjY-nU9Du3sEfXpawiYH5uvFFToHbKMqaN_efTrcyzWR5v2lQNnKcjVoqmtbGHKDmXSmBXx4DB_heV8dVnLpErzsFp3PNE04YUcLfDPdlTX02tY410dVQ",
      tag: "Evening",
      included: ["Elder-led session", "Tea by the hearth", "Cultural Q&A"],
    },
    {
      id: "traditional-games",
      title: "Traditional Games",
      description: "Test your agility and strength with authentic Kiga sports, from wrestling to traditional target throwing.",
      price: "$20",
      duration: "2 Hours",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQQOa1V3l9rh9DrmmIH-g20B5CFV_Git0PETHxXW-fhnwRHdVmmJ2TArZFaZ7YOGy28335aiQxay2CnWeaVnbyX4zoGW2DJjH12ydp_lc9kAwWpwgqasnhZKfJHO3OT4YF_-HDDIxAtBuFZCaPaAga8yWHn4VeoVO40o8TkSQHuYkLDLLIiwCer6xwDBOzq98eZurNV5HUE7GI9s-HDQTR9PQI-uFtrk9AHsguHbjg6egw8uteO3MOFbKIr2N6JsZE_BpZt76_mSY",
      tag: "Active",
      included: ["Group activities", "Guide supervision", "Family friendly"],
    },
    {
      id: "attire",
      title: "Ekika Dressing & Attire",
      description: "Learn the symbolism behind our traditional skins and beads. Includes a portrait session in full attire.",
      price: "$35",
      duration: "2 Hours",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzag7VJw_-fg_tK1fZBJ9eqTQr60G0a8LaHgsfm8kLZDplro_-sYStc5T6Y8tQmVq4bed1CL44nkYIn3uJdoe9ahV0p3rs0WJHTKso49-6cYCLuD2h7D8h6qDJWsqIzNTCZ1Yuqc5wql_C4ikAKjOvsSCqVbOhcnOdk068K2vTctcJURUTlHSVD3PWCoCKuB2Q_unpv7QPgzewqjjGVKIrCXGvpdEPkKYLraNPM9HQrhpP1bgN8BFtMmSQ4KiWsomTKMlNFDm9F08",
      tag: "Portrait",
      included: ["Attire guidance", "Portrait session", "Symbolism talk"],
    },
    {
      id: "full-day",
      title: "Full Cultural Day Package",
      description: "The definitive Kigezi journey. Includes all activities plus a traditional banquet and highland trekking.",
      price: "$120",
      duration: "8 Hours",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUF5Q0elMs1ZTJ_ulIBlxqFQbruH-KrYah0t-NagmCbAKI3N-YwphzPXuoqk9f90lafZpEGhv0rzw6u8ZWS13EV1IihaKToXHxsvdk3LBsQpD09L0syToSfhChPjkBE2K017w8LT70bi9JpAV24K3ixguF0wZTFnEduYtyKw7Ma6OijuRIA2Un-TUEwi2h2787Q-DNlT2nVSENhIlg-my0eoSjl_vdcgzgLTdnm2q2oD6wxepoESsiuq7D2Z4s6q0IPkdqrTqmmIY",
      tag: "Best Value",
      included: ["Traditional lunch included", "Professional photography", "Highland trekking"],
    },
  ],
};

export function createBlankExperience(): EditableExperience {
  return {
    id: `experience-${Date.now()}`,
    title: "New Cultural Experience",
    description: "Describe what guests will see, learn, taste, or do during this experience.",
    price: "$0",
    duration: "2 Hours",
    image: defaultContent.experiences[0].image,
    tag: "New",
    included: ["Local guide", "Cultural introduction", "Flexible schedule"],
  };
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    site: { ...defaultContent.site, ...content.site },
    experiences: Array.isArray(content.experiences) ? content.experiences : defaultContent.experiences,
  };
}

export function getSiteContent(): SiteContent {
  if (typeof window === "undefined") return defaultContent;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeContent(JSON.parse(raw) as SiteContent) : defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function saveSiteContent(content: SiteContent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeContent(content)));
  window.dispatchEvent(new Event("ekika-content-updated"));

  if (!getAdminToken()) return;
  await apiRequest("/api/admin/site", {
    admin: true,
    method: "PUT",
    body: JSON.stringify({ site: content.site }),
  });

  const server = await apiRequest<{ experiences: EditableExperience[] }>("/api/admin/experiences", { admin: true });
  const serverIds = new Set(server.experiences.map((experience) => experience.id));
  const localIds = new Set(content.experiences.map((experience) => experience.id));

  await Promise.all([
    ...content.experiences.map((experience, sortOrder) => apiRequest(
      serverIds.has(experience.id) ? `/api/admin/experiences/${encodeURIComponent(experience.id)}` : "/api/admin/experiences",
      {
        admin: true,
        method: serverIds.has(experience.id) ? "PUT" : "POST",
        body: JSON.stringify({ experience: { ...experience, sortOrder } }),
      },
    )),
    ...server.experiences
      .filter((experience) => !localIds.has(experience.id))
      .map((experience) => apiRequest(`/api/admin/experiences/${encodeURIComponent(experience.id)}`, { admin: true, method: "DELETE" })),
  ]);
}

export function resetSiteContent() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("ekika-content-updated"));
}

export function useSiteContent() {
  const [content, setContent] = useState(getSiteContent);

  useEffect(() => {
    function refresh() {
      setContent(getSiteContent());
    }

    window.addEventListener("storage", refresh);
    window.addEventListener("ekika-content-updated", refresh);

    Promise.all([
      apiRequest<{ site: EditableSiteInfo }>("/api/site"),
      apiRequest<{ experiences: EditableExperience[] }>("/api/experiences"),
    ]).then(([siteResult, experienceResult]) => {
      const serverContent = normalizeContent({ site: siteResult.site, experiences: experienceResult.experiences });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serverContent));
      setContent(serverContent);
    }).catch(() => {
      // The local cache keeps the frontend usable while the API is offline.
    });

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ekika-content-updated", refresh);
    };
  }, []);

  return content;
}
