/**
 * GitHub Projects Configuration
 *
 * Add the repositories you want to display on your portfolio.
 * Only repositories listed here will be fetched and displayed.
 *
 * @module config/github-projects
 */

import type { GitHubProjectConfig } from '../lib/github/types';

/**
 * Your GitHub username
 */
export const githubUsername = 'Jettan17';

/**
 * List of repositories to display
 *
 * Add repos by name. You can optionally override any field:
 * - title: Custom display title (default: formatted from repo name)
 * - description: Custom description (default: from GitHub)
 * - tags: Custom tags (default: language + topics from GitHub)
 * - image: Custom image URL (default: generated placeholder)
 * - featured: Mark as featured project (default: false)
 * - liveUrl: Live demo URL (default: GitHub homepage if set)
 *
 * @example
 * ```ts
 * export const githubProjects: GitHubProjectConfig[] = [
 *   // Minimal - just repo name
 *   { repo: 'my-awesome-project' },
 *
 *   // With custom title
 *   { repo: 'learnex-course-tutor', title: 'Learnex' },
 *
 *   // Fully customized
 *   {
 *     repo: 'my-cli-tool',
 *     title: 'Super CLI',
 *     description: 'A powerful command-line tool',
 *     tags: ['CLI', 'Node.js', 'TypeScript'],
 *     featured: true,
 *   },
 * ];
 * ```
 */
export const githubProjects: GitHubProjectConfig[] = [
  // Add your repositories here
  // Example: { repo: 'your-repo-name' },
  {
    repo: 'learnex-course-tutor',
    title: 'Learnex',
    featured: true,
    tags: ['TypeScript', 'Next.js', 'React', 'Tailwind'],
  },
  {
    repo: 'stratos-investment-assistant',
    title: 'Stratos',
    featured: false,
    tags: ['TypeScript', 'React', 'FastAPI', 'Python', 'Supabase'],
  },
  {
    repo: 'prizm-photo-album',
    title: 'Prizm',
    featured: true,
    tags: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
    liveUrl: 'https://prizm-photo-album.vercel.app',
  },
  {
    repo: 'jetflux-cc-sdk',
    title: 'JetFlux',
    description:
      'A comprehensive Claude Code SDK with specialized agents, slash commands, and MCP integrations for structured AI-assisted development workflows.',
    featured: true,
    tags: ['Claude Code', 'TypeScript', 'AI Agents', 'Developer Tools', 'CLI'],
  },
];
