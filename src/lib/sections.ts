/** Single source of truth for the page's sections and their nav labels. */
export const SECTIONS = [
  { id: 'home', labelKey: 'nav.home' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'services', labelKey: 'nav.services' },
  { id: 'skills', labelKey: 'nav.skills' },
  { id: 'journey', labelKey: 'nav.journey' },
  { id: 'projects', labelKey: 'nav.projects' },
  { id: 'certificates', labelKey: 'nav.certificates' },
  { id: 'contact', labelKey: 'nav.contact' },
] as const;

export const SECTION_IDS = SECTIONS.map((section) => section.id);
