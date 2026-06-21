import { defaultContent } from "./content";

export const siteInfo = defaultContent.site;

export const bookingExperiences = defaultContent.experiences.map((experience) => experience.title);

export function bookingPath(experience?: string) {
  if (!experience) return "/booking";
  return `/booking?experience=${encodeURIComponent(experience)}`;
}
