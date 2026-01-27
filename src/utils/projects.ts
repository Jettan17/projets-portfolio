/**
 * Project filtering and sorting utilities
 * @module utils/projects
 */

import type { ProjectEntry } from './types';

/**
 * Sort projects by publish date (newest first)
 * @param projects - Array of project entries
 * @returns Sorted array of projects
 */
export function sortByDate(projects: ProjectEntry[]): ProjectEntry[] {
  return [...projects].sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

/**
 * Filter projects by featured status
 * @param projects - Array of project entries
 * @returns Array of featured projects
 */
export function getFeaturedProjects(projects: ProjectEntry[]): ProjectEntry[] {
  return projects.filter((project) => project.data.featured);
}

/**
 * Filter projects by tag
 * @param projects - Array of project entries
 * @param tag - Tag to filter by
 * @returns Array of projects with the specified tag
 */
export function filterByTag(projects: ProjectEntry[], tag: string): ProjectEntry[] {
  const lowerTag = tag.toLowerCase();
  return projects.filter((project) =>
    project.data.tags.some((t) => t.toLowerCase().includes(lowerTag))
  );
}

/**
 * Get all unique tags from projects
 * @param projects - Array of project entries
 * @returns Array of unique tags sorted alphabetically
 */
export function getAllTags(projects: ProjectEntry[]): string[] {
  const tagSet = new Set<string>();
  projects.forEach((project) => {
    project.data.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Search projects by title or description
 * @param projects - Array of project entries
 * @param query - Search query
 * @returns Array of matching projects
 */
export function searchProjects(projects: ProjectEntry[], query: string): ProjectEntry[] {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return [];
  }

  return projects.filter((project) => {
    const title = project.data.title.toLowerCase();
    const description = project.data.description.toLowerCase();
    return title.includes(trimmedQuery) || description.includes(trimmedQuery);
  });
}
