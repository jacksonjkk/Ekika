export const defaultSite = {
  name: "Ekika Cultural Experience",
  shortName: "Ekika",
  email: "hello@ekikaexperience.ug",
  phoneDisplay: "+256 700 000 000",
  phoneHref: "tel:+256700000000",
  whatsappUrl: "https://wa.me/256700000000",
  address: ["Kabale-Lake Bunyonyi Road", "Kigezi Highlands, South Western Uganda", "P.O. Box 42, Kabale"],
  locationLabel: "Kabale District, Kigezi Region, Uganda",
};

export const legacyExperienceIds = [
  "food-cooking",
  "storytelling",
  "traditional-games",
  "attire",
  "full-day",
];

const packageImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuCUF5Q0elMs1ZTJ_ulIBlxqFQbruH-KrYah0t-NagmCbAKI3N-YwphzPXuoqk9f90lafZpEGhv0rzw6u8ZWS13EV1IihaKToXHxsvdk3LBsQpD09L0syToSfhChPjkBE2K017w8LT70bi9JpAV24K3ixguF0wZTFnEduYtyKw7Ma6OijuRIA2Un-TUEwi2h2787Q-DNlT2nVSENhIlg-my0eoSjl_vdcgzgLTdnm2q2oD6wxepoESsiuq7D2Z4s6q0IPkdqrTqmmIY";

export const defaultExperiences = [
  {
    id: "full-day-package",
    title: "Full Day - 9 Hours",
    description: "A nine-hour cultural immersion with hands-on craft making, local food and drink, dance, community walks, and campfire storytelling.",
    priceCents: 0,
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
    priceCents: 0,
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
];
