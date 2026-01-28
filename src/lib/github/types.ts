/**
 * GitHub API types
 * @module lib/github/types
 */

/**
 * GitHub repository response from REST API
 */
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  fork: boolean;
  archived: boolean;
  default_branch: string;
}

/**
 * Configuration for a GitHub project to display
 */
export interface GitHubProjectConfig {
  /** Repository name (e.g., "my-project") */
  repo: string;
  /** Override title (default: formatted from repo name) */
  title?: string;
  /** Override description (default: from GitHub) */
  description?: string;
  /** Override tags (default: language + topics) */
  tags?: string[];
  /** Custom image URL (default: generated) */
  image?: string;
  /** Mark as featured project */
  featured?: boolean;
  /** Override live URL (default: GitHub homepage) */
  liveUrl?: string;
}

/**
 * Transformed project data ready for display
 */
export interface GitHubProjectData {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl: string;
  featured: boolean;
  publishDate: Date;
  source: 'github';
  stars: number;
  language: string | null;
}
