/**
 * Campaign communications – shared constants for broadcast filters.
 * Skills and availability match VolunteerForm options.
 */

export const BROADCAST_SKILLS = [
  "Canvassing (Door-to-door)",
  "Phone Banking (to raise funds)",
  "Campaign Planning & Support",
  "Social Media Advocacy",
  "Data Entry/Collection",
  "Transportation / Driving",
  "Security",
] as const;

export const BROADCAST_AVAILABILITY = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Weekends",
] as const;

export type BroadcastFilter = {
  all?: boolean;
  lgas?: string[];
  skills?: string[];
  availability?: string[];
};
