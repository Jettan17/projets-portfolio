/**
 * Project filtering and sorting utilities
 * @module utils/projects
 */

import type { ProjectEntry } from './types';
import { fetchRepo, fetchReadme } from '../lib/github/client';
import { transformGitHubToProject, extractDescriptionFromReadme, extractLiveUrlFromReadme, extractTechStackFromReadme } from '../lib/github/transformer';
import { githubProjects, githubUsername } from '../config/github-projects';

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

/**
 * Fetch GitHub projects from the configured list
 * @returns Array of project entries from GitHub
 */
export async function getGitHubProjects(): Promise<ProjectEntry[]> {
  // Return empty if no projects configured
  if (!githubProjects || githubProjects.length === 0) {
    return [];
  }

  const projects = await Promise.all(
    githubProjects.map(async (config) => {
      try {
        // Fetch repo data and README in parallel
        const [repo, readme] = await Promise.all([
          fetchRepo(githubUsername, config.repo),
          fetchReadme(githubUsername, config.repo),
        ]);

        if (!repo) {
          console.warn(`Repository not found: ${githubUsername}/${config.repo}`);
          return null;
        }

        const projectData = transformGitHubToProject(repo, config);

        // Use README description if available and no config override
        const readmeDescription = readme ? extractDescriptionFromReadme(readme) : null;
        const description =
          config.description ?? readmeDescription ?? projectData.description;

        // Use README live URL if no config override and no GitHub homepage
        const readmeLiveUrl = readme ? extractLiveUrlFromReadme(readme) : null;
        const liveUrl = config.liveUrl ?? projectData.liveUrl ?? readmeLiveUrl ?? undefined;

        // Enhance tags with README tech stack extraction if we only have language
        let tags = projectData.tags;
        if (tags.length <= 1 && readme) {
          const readmeTech = extractTechStackFromReadme(readme);
          if (readmeTech.length > 0) {
            // Merge: keep language first, add detected tech
            const merged = new Set([...tags, ...readmeTech]);
            tags = Array.from(merged).slice(0, 6);
          }
        }

        return {
          slug: projectData.slug,
          data: {
            title: projectData.title,
            description,
            image: projectData.image,
            tags,
            liveUrl,
            repoUrl: projectData.repoUrl,
            featured: projectData.featured,
            publishDate: projectData.publishDate,
            source: 'github' as const,
            stars: projectData.stars,
            language: projectData.language,
          },
        } satisfies ProjectEntry;
      } catch (error) {
        console.error(`Failed to fetch ${config.repo}:`, error);
        return null;
      }
    })
  );

  return projects.filter((p): p is ProjectEntry => p !== null);
}

/**
 * Merge markdown and GitHub projects into a single sorted list
 * @param markdownProjects - Projects from Content Collections
 * @param githubProjectsList - Projects from GitHub API
 * @returns Merged and sorted array of projects
 */
export function mergeProjects(
  markdownProjects: ProjectEntry[],
  githubProjectsList: ProjectEntry[]
): ProjectEntry[] {
  // Add source to markdown projects
  const enrichedMarkdown = markdownProjects.map((p) => ({
    ...p,
    data: { ...p.data, source: 'markdown' as const },
  }));

  // Combine and sort by date
  return sortByDate([...enrichedMarkdown, ...githubProjectsList]);
}
