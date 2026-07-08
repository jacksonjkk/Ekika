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
  slideshowImages: string[];
  tag: string;
  included: string[];
};

export type SiteContent = {
  site: EditableSiteInfo;
  experiences: EditableExperience[];
};

const STORAGE_KEY = "ekika-site-content";
const packageImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCUF5Q0elMs1ZTJ_ulIBlxqFQbruH-KrYah0t-NagmCbAKI3N-YwphzPXuoqk9f90lafZpEGhv0rzw6u8ZWS13EV1IihaKToXHxsvdk3LBsQpD09L0syToSfhChPjkBE2K017w8LT70bi9JpAV24K3ixguF0wZTFnEduYtyKw7Ma6OijuRIA2Un-TUEwi2h2787Q-DNlT2nVSENhIlg-my0eoSjl_vdcgzgLTdnm2q2oD6wxepoESsiuq7D2Z4s6q0IPkdqrTqmmIY";
const experienceOrder = ["full-day-package", "half-day-package"];

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
      id: "full-day-package",
      title: "Full Day - 9 Hours",
      description: "A nine-hour cultural immersion with hands-on craft making, local food and drink, dance, community walks, and campfire storytelling.",
      price: "$0",
      duration: "9 Hours",
      image: packageImage,
      slideshowImages: [packageImage],
      tag: "Full Day",
      included: [
        "Craft making",
        "Traditional lunch",
        "Local porridge Bushera",
        "Local beer Omuramba",
        "Dance Ekizino",
        "Cultural",
        "Campfire story telling",
        "Community walks",
      ],
    },
    {
      id: "half-day-package",
      title: "Half Day - 5 Hours",
      description: "A five-hour cultural visit centered on village walks, traditional cooking, craft making, and storytelling.",
      price: "$0",
      duration: "5 Hours",
      image: packageImage,
      slideshowImages: [packageImage],
      tag: "Half Day",
      included: [
        "Village walks",
        "Traditional cooking",
        "Ekizino",
        "Traditional lunch",
        "Local porridge Bushera preparation",
        "Craft making",
        "Story telling",
      ],
    },
  ],
};

export function createBlankExperience(): EditableExperience {
  return {
    id: `package-${Date.now()}`,
    title: "New Cultural Package",
    description: "Describe what guests will see, learn, taste, or do during this package.",
    price: "$0",
    duration: "5 Hours",
    image: defaultContent.experiences[0].image,
    slideshowImages: [defaultContent.experiences[0].image],
    tag: "New",
    included: ["Local guide", "Cultural introduction", "Flexible schedule"],
  };
}

function normalizeExperience(experience: EditableExperience): EditableExperience {
  const included = Array.isArray(experience.included)
    ? experience.included.filter((item) => typeof item === "string" && item.trim())
    : [];
  const slideshowImages = Array.isArray(experience.slideshowImages)
    ? experience.slideshowImages.filter((image) => typeof image === "string" && image.trim())
    : [];

  return {
    ...experience,
    included,
    slideshowImages: slideshowImages.length > 0 ? slideshowImages : (experience.image ? [experience.image] : []),
  };
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    site: { ...defaultContent.site, ...content.site },
    experiences: Array.isArray(content.experiences)
      ? [...content.experiences].map(normalizeExperience).sort((left, right) => {
          const leftIndex = experienceOrder.indexOf(left.id);
          const rightIndex = experienceOrder.indexOf(right.id);
          if (leftIndex === -1 && rightIndex === -1) return 0;
          if (leftIndex === -1) return 1;
          if (rightIndex === -1) return -1;
          return leftIndex - rightIndex;
        })
      : defaultContent.experiences,
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
