/**
 * Shapes for everything in `src/data/*.json`.
 *
 * Every user-facing string is a `Localized` pair so a single JSON edit updates
 * both languages. Keep these in sync when you add fields to the JSON files —
 * `src/lib/content.ts` is the only place that casts the raw imports.
 */

export type Locale = 'en' | 'ar';

/** A string in both supported languages. */
export type Localized = Record<Locale, string>;

export interface Profile {
  name: Localized;
  shortName: Localized;
  role: Localized;
  greeting: Localized;
  rotatingRoles: Localized[];
  tagline: Localized;
  bio: Localized;
  bioSecondary: Localized;
  avatar: string;
  logo: string;
  location: Localized;
  availability: { open: boolean; label: Localized };
  contact: { email: string; phone: string; phoneHref: string; whatsapp: string };
  resume: { url: string; label: Localized };
  servicesDeck: { url: string; label: Localized };
  languages: { name: Localized; level: Localized; value: number }[];
  stats: { value: number; suffix: string; decimals?: number; label: Localized }[];
}

export type SocialIcon = 'whatsapp' | 'linkedin' | 'github' | 'mail';

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
  icon: SocialIcon;
  brandColor: string;
  primary: boolean;
}

export interface Service {
  id: string;
  icon: string;
  title: Localized;
  summary: Localized;
  price: { amount: number; from: boolean };
  duration: Localized;
  features: Localized[];
  /** Empty label means no live example is set. */
  example: { label: string; url: string };
  featured: boolean;
}

export interface Addons {
  paid: { id: string; icon: string; title: Localized; note: Localized; price: number }[];
  free: { id: string; icon: string; title: Localized; note: Localized }[];
  terms: { id: string; title: Localized; body: Localized }[];
}

export interface SkillGroup {
  id: string;
  title: Localized;
  items: { name: string; icon: string }[];
}

export interface Project {
  id: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  image: string;
  url: string | null;
  /** Empty string means no public repo. */
  repo: string;
  year: number;
  featured: boolean;
  tags: string[];
  category: Localized;
}

export type CertificateCategory =
  | 'ai'
  | 'engineering'
  | 'academic'
  | 'leadership'
  | 'volunteer'
  | 'quran';

export interface Certificate {
  id: string;
  title: Localized;
  issuer: Localized;
  year: number;
  category: CertificateCategory;
  description: Localized;
  /** Empty string falls back to a generated card. */
  image: string;
  /** Empty string means no public verification link. */
  url: string;
}

export interface ExperienceEntry {
  id: string;
  type: 'work' | 'volunteer';
  role: Localized;
  organisation: Localized;
  location: Localized;
  start: string;
  /** Empty string means ongoing. */
  end: string;
  current: boolean;
  highlights: Localized[];
}

export interface EducationEntry {
  id: string;
  degree: Localized;
  institution: Localized;
  start: string;
  /** Empty string means ongoing. */
  end: string;
  current: boolean;
  score: { label: Localized; value: string };
  notes: Localized[];
}

export interface ProcessStep {
  id: string;
  icon: string;
  title: Localized;
  body: Localized;
}
