/**
 * Single entry point for all site content.
 *
 * Everything the site displays comes from `src/data/*.json`. To update the
 * portfolio you edit those files — no component changes required. The casts
 * here are the one place where raw JSON meets the typed world.
 */

import addonsJson from '@/data/addons.json';
import certificatesJson from '@/data/certificates.json';
import educationJson from '@/data/education.json';
import experienceJson from '@/data/experience.json';
import processJson from '@/data/process.json';
import profileJson from '@/data/profile.json';
import projectsJson from '@/data/projects.json';
import servicesJson from '@/data/services.json';
import skillsJson from '@/data/skills.json';
import socialJson from '@/data/social.json';

import type {
  Addons,
  Certificate,
  EducationEntry,
  ExperienceEntry,
  ProcessStep,
  Profile,
  Project,
  Service,
  SkillGroup,
  SocialLink,
} from '@/types/content';

export const profile = profileJson as Profile;
export const socials = socialJson as SocialLink[];
export const services = servicesJson as Service[];
export const addons = addonsJson as Addons;
export const skillGroups = skillsJson as SkillGroup[];
export const projects = projectsJson as Project[];
export const certificates = certificatesJson as Certificate[];
export const experience = experienceJson as ExperienceEntry[];
export const education = educationJson as EducationEntry[];
export const processSteps = processJson as ProcessStep[];

/** Work history only — volunteer entries render in their own track. */
export const workExperience = experience.filter((entry) => entry.type === 'work');
export const volunteerExperience = experience.filter((entry) => entry.type === 'volunteer');

/** Flat list of every tech icon, used by the marquee. */
export const allSkills = skillGroups.flatMap((group) => group.items);
