/**
 * Transform GitHub API data to portfolio project format
 * @module lib/github/transformer
 */

import type { GitHubRepository, GitHubProjectConfig, GitHubProjectData } from './types';
import { generatePlaceholderDataUrl, getGitHubOgImageUrl } from './image-generator';
import { githubUsername } from '../../config/github-projects';

/**
 * Extract live demo URL from README markdown content
 * Looks for common patterns like "Live Demo", "Demo", deployment badges, Vercel/Netlify links
 * @param readme - Raw README markdown content
 * @returns Live URL or null if not found
 */
export function extractLiveUrlFromReadme(readme: string): string | null {
  if (!readme || !readme.trim()) {
    return null;
  }

  // Patterns to find live URLs (in priority order)
  const patterns = [
    // Markdown links with common labels
    /\[(?:live\s*demo|demo|try\s*it|live|visit|website|app)\]\((https?:\/\/[^\s)]+)\)/gi,
    // "Live Demo:" or "Demo:" followed by URL
    /(?:live\s*demo|demo|website|app)\s*[:\-]\s*(https?:\/\/[^\s<>)]+)/gi,
    // Vercel deployment URLs
    /(https?:\/\/[a-z0-9-]+\.vercel\.app)\b/gi,
    // Netlify deployment URLs
    /(https?:\/\/[a-z0-9-]+\.netlify\.app)\b/gi,
    // Railway deployment URLs
    /(https?:\/\/[a-z0-9-]+\.up\.railway\.app)\b/gi,
    // Heroku deployment URLs
    /(https?:\/\/[a-z0-9-]+\.herokuapp\.com)\b/gi,
    // GitHub Pages
    /(https?:\/\/[a-z0-9-]+\.github\.io\/[a-z0-9-]+)\b/gi,
    // Generic "Frontend:" pattern
    /frontend\s*[:\-]\s*(https?:\/\/[^\s<>)]+)/gi,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(readme);
    if (match && match[1]) {
      // Clean the URL (remove trailing punctuation)
      return match[1].replace(/[.,;:!?]+$/, '');
    }
    // Reset regex lastIndex for next iteration
    pattern.lastIndex = 0;
  }

  return null;
}

/**
 * Known technologies to detect in READMEs
 * Maps various spellings/formats to canonical names that match techColors
 */
const techPatterns: Array<{ pattern: RegExp; name: string }> = [
  // Frameworks
  { pattern: /\bnext\.?js\b/i, name: 'Next.js' },
  { pattern: /\breact\b/i, name: 'React' },
  { pattern: /\bvue\.?js?\b/i, name: 'Vue' },
  { pattern: /\bangular\b/i, name: 'Angular' },
  { pattern: /\bsvelte\b/i, name: 'Svelte' },
  { pattern: /\bastro\b/i, name: 'Astro' },
  { pattern: /\bnuxt\b/i, name: 'Nuxt' },
  { pattern: /\bexpress\.?js?\b/i, name: 'Express' },
  { pattern: /\bfastapi\b/i, name: 'FastAPI' },
  { pattern: /\bdjango\b/i, name: 'Django' },
  { pattern: /\bflask\b/i, name: 'Flask' },
  { pattern: /\bnest\.?js\b/i, name: 'NestJS' },
  { pattern: /\bnode\.?js\b/i, name: 'Node.js' },

  // Languages
  { pattern: /\btypescript\b/i, name: 'TypeScript' },
  { pattern: /\bjavascript\b/i, name: 'JavaScript' },
  { pattern: /\bpython\b/i, name: 'Python' },
  { pattern: /\brust\b/i, name: 'Rust' },
  { pattern: /\bgolang\b|\bgo\s+lang/i, name: 'Go' },

  // Databases
  { pattern: /\bpostgres(?:ql)?\b/i, name: 'PostgreSQL' },
  { pattern: /\bmongodb\b/i, name: 'MongoDB' },
  { pattern: /\bredis\b/i, name: 'Redis' },
  { pattern: /\bsupabase\b/i, name: 'Supabase' },
  { pattern: /\bfirebase\b/i, name: 'Firebase' },
  { pattern: /\bprisma\b/i, name: 'Prisma' },

  // CSS/Styling
  { pattern: /\btailwind(?:\s*css)?\b/i, name: 'Tailwind' },
  { pattern: /\bsass\b|\bscss\b/i, name: 'Sass' },

  // Tools
  { pattern: /\bdocker\b/i, name: 'Docker' },
  { pattern: /\bkubernetes\b|\bk8s\b/i, name: 'Kubernetes' },
  { pattern: /\bgraphql\b/i, name: 'GraphQL' },
  { pattern: /\bvite\b/i, name: 'Vite' },

  // AI/ML
  { pattern: /\bopenai\b/i, name: 'OpenAI' },
  { pattern: /\blangchain\b/i, name: 'LangChain' },
  { pattern: /\btensorflow\b/i, name: 'TensorFlow' },
  { pattern: /\bpytorch\b/i, name: 'PyTorch' },

  // Mobile
  { pattern: /\bflutter\b/i, name: 'Flutter' },
  { pattern: /\breact\s*native\b/i, name: 'React Native' },
];

/**
 * Extract tech stack from README content
 * Looks for technology mentions in Tech Stack sections or general content
 */
export function extractTechStackFromReadme(readme: string): string[] {
  if (!readme || !readme.trim()) {
    return [];
  }

  const found = new Set<string>();

  // Look in "Tech Stack", "Built With", "Technologies" sections first
  const techSectionContent = extractFromSection(readme, [
    'tech stack',
    'built with',
    'technologies',
    'stack',
    'tools',
  ]);

  const contentToSearch = techSectionContent || readme;

  for (const { pattern, name } of techPatterns) {
    if (pattern.test(contentToSearch)) {
      found.add(name);
    }
  }

  // Limit to 6 technologies
  return Array.from(found).slice(0, 6);
}

/**
 * Check if a line is "skippable" content (badges, links, images, etc.)
 */
function isSkippableLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;

  // Skip headings
  if (trimmed.startsWith('#')) return true;

  // Skip images and badges
  if (trimmed.startsWith('![')) return true;
  if (trimmed.startsWith('[!')) return true;

  // Skip HTML comments and tags
  if (trimmed.startsWith('<!--')) return true;
  if (trimmed.startsWith('<')) return true;

  // Skip tables
  if (trimmed.startsWith('|')) return true;

  // Skip standalone links (line is just a markdown link)
  if (/^\[.+\]\(.+\)$/.test(trimmed)) return true;

  // Skip lines that are just URLs
  if (/^https?:\/\/\S+$/.test(trimmed)) return true;

  // Skip deployment status badges
  if (trimmed.includes('shields.io') || trimmed.includes('badge')) return true;

  // Skip lines that start with common non-description patterns
  if (/^(deploy|build|status|license|version):/i.test(trimmed)) return true;

  return false;
}

/**
 * Extract content from a specific section in README
 */
function extractFromSection(readme: string, sectionNames: string[]): string | null {
  const lines = readme.split('\n');
  let inTargetSection = false;
  let content = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this is a heading
    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      const headingText = headingMatch[1].toLowerCase();

      // Check if we're entering a target section
      if (sectionNames.some(name => headingText.includes(name.toLowerCase()))) {
        inTargetSection = true;
        continue;
      }

      // If we were in a target section and hit a new heading, stop
      if (inTargetSection) {
        break;
      }
      continue;
    }

    // Collect content if we're in the target section
    if (inTargetSection && !isSkippableLine(line)) {
      content += trimmed + ' ';
    }
  }

  return content.trim() || null;
}

/**
 * Extract a meaningful description from README markdown content
 * Looks for About/Overview sections first, then falls back to first paragraph
 * @param readme - Raw README markdown content
 * @returns Extracted description (max 200 chars) or null if no content found
 */
export function extractDescriptionFromReadme(readme: string): string | null {
  if (!readme || !readme.trim()) {
    return null;
  }

  // Priority 1: Look for dedicated description sections
  const sectionContent = extractFromSection(readme, [
    'about',
    'overview',
    'description',
    'what is',
    'introduction',
    'summary',
  ]);

  if (sectionContent && sectionContent.length > 30) {
    return truncateDescription(sectionContent);
  }

  // Priority 2: Look for first meaningful paragraph after title
  const lines = readme.split('\n');
  let description = '';
  let foundContent = false;
  let skippedTitle = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip the first heading (title)
    if (!skippedTitle && trimmed.startsWith('#')) {
      skippedTitle = true;
      continue;
    }

    // Skip other non-content lines
    if (isSkippableLine(line)) {
      if (foundContent) break; // End of paragraph
      continue;
    }

    foundContent = true;
    description += trimmed + ' ';
  }

  if (!description.trim()) {
    return null;
  }

  return truncateDescription(description);
}

/**
 * Truncate description to ~200 chars at word boundary
 */
function truncateDescription(text: string): string {
  const cleaned = text.trim();
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
