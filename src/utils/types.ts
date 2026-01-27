/**
 * Types and interfaces for utility functions
 */

export interface ProjectData {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  publishDate: Date;
}

export interface ProjectEntry {
  slug: string;
  data: ProjectData;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface NavLink {
  href: string;
  label: string;
}
