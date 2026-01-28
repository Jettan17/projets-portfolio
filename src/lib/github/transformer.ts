/**
 * Transform GitHub API data to portfolio project format
 * @module lib/github/transformer
 */

import type { GitHubRepository, GitHubProjectConfig, GitHubProjectData } from './types';
import { generatePlaceholderDataUrl, getGitHubOgImageUrl } from './image-generator';
import { githubUsername } from '../../config/github-projects';

/**
 * Extract a meaningful description from README markdown content
 * Skips title, badges, and empty lines to find the first paragraph
 * @param readme - Raw README markdown content
 * @returns Extracted description (max 200 chars) or null if no content found
 */
export function extractDescriptionFromReadme(readme: string): string | null {
  if (!readme || !readme.trim()) {
    return null;
  }

  const lines = readme.split('\n');
  let description = '';
  let foundContent = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines, titles, badges, links, and HTML comments
    if (
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('![') ||
      trimmed.startsWith('[!') ||
      trimmed.startsWith('<!--') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('|') // Skip tables
    ) {
      if (foundContent) break; // End of first paragraph
      continue;
    }

    foundContent = true;
    description += trimmed + ' ';
  }

  if (!description.trim()) {
    return null;
  }

  // Clean up and limit to ~200 chars
  const cleaned = description.trim();
  if (cleaned.length <= 200) {
    return cleaned;
  }

  // Cut at word boundary
  const truncated = cleaned.slice(0, 200);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace > 150 ? lastSpace : 200) + '...';
}

/**
 * Convert kebab-case or snake_case to Title Case
 * Also handles special cases like acronyms
 */
export function toTitleCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => {
      // Keep acronyms uppercase if they're all caps
      if (word.toUpperCase() === word && word.length <= 4) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Extract a clean project title from repository name
 * Handles common patterns like "project-name-app" → "Project Name"
 */
export function extractProjectTitle(repoName: string, config?: GitHubProjectConfig): string {
  // Use config override if provided
  if (config?.title) {
    return config.title;
  }

  // Remove common suffixes
  let cleanName = repoName
    .replace(/-app$/i, '')
    .replace(/-web$/i, '')
    .replace(/-api$/i, '')
    .replace(/-cli$/i, '')
    .replace(/-bot$/i, '');

  return toTitleCase(cleanName);
}

/**
 * Build tags from GitHub language and topics
 */
export function buildTags(repo: GitHubRepository, config?: GitHubProjectConfig): string[] {
  // Use config override if provided
  if (config?.tags && config.tags.length > 0) {
    return config.tags;
  }

  const tags: string[] = [];

  // Add primary language first
  if (repo.language) {
    tags.push(repo.language);
  }

  // Add topics (limit to prevent too many tags)
  if (repo.topics && repo.topics.length > 0) {
    // Capitalize topics and limit to 5
    const formattedTopics = repo.topics.slice(0, 5).map((topic) =>
      topic
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
    tags.push(...formattedTopics);
  }

  // Ensure at least one tag
  if (tags.length === 0) {
    tags.push('Code');
  }

  return tags;
}

/**
 * Determine the image URL for a GitHub project
 * Priority: config override > generated placeholder
 * (OpenGraph images are fetched separately if needed)
 */
export function getProjectImage(
  repo: GitHubRepository,
  config?: GitHubProjectConfig
): string {
  // Use config override if provided
  if (config?.image) {
    return config.image;
  }

  // Generate a placeholder with the project title
  const title = extractProjectTitle(repo.name, config);
  return generatePlaceholderDataUrl(title, repo.language, repo.name);
}

/**
 * Transform a GitHub repository to portfolio project format
 */
export function transformGitHubToProject(
  repo: GitHubRepository,
  config?: GitHubProjectConfig
): GitHubProjectData {
  const title = extractProjectTitle(repo.name, config);

  return {
    slug: `github-${repo.name}`,
    title,
    description:
      config?.description ?? repo.description ?? 'A project hosted on GitHub',
    image: getProjectImage(repo, config),
    tags: buildTags(repo, config),
    liveUrl: config?.liveUrl ?? (repo.homepage || undefined),
    repoUrl: repo.html_url,
    featured: config?.featured ?? false,
    publishDate: new Date(repo.pushed_at || repo.updated_at),
    source: 'github',
    stars: repo.stargazers_count,
    language: repo.language,
  };
}

/**
 * Get the OpenGraph image URL (for fallback/enhancement)
 */
export function getOpenGraphImageUrl(repoName: string): string {
  return getGitHubOgImageUrl(githubUsername, repoName);
}
