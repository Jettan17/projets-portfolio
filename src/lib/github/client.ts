/**
 * GitHub API client for fetching repository data
 * @module lib/github/client
 */

import type { GitHubRepository } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Get headers for GitHub API requests
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Site',
  };

  // Use token if available for higher rate limits
  const token = import.meta.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  return headers;
}

/**
 * Fetch all public repositories for a user
 * @param username - GitHub username
 * @returns Array of repositories sorted by update date
 */
export async function fetchUserRepos(username: string): Promise<GitHubRepository[]> {
  const url = `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`;

  try {
    const response = await fetch(url, { headers: getHeaders() });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos: GitHubRepository[] = await response.json();

    // Filter out private repos, forks, and archived repos
    return repos.filter((repo) => !repo.private && !repo.fork && !repo.archived);
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    return [];
  }
}

/**
 * Fetch a single repository by name
 * @param username - GitHub username
 * @param repoName - Repository name
 * @returns Repository data or null if not found
 */
export async function fetchRepo(
  username: string,
  repoName: string
): Promise<GitHubRepository | null> {
  const url = `${GITHUB_API_BASE}/repos/${username}/${repoName}`;

  try {
    const response = await fetch(url, { headers: getHeaders() });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Repository not found: ${username}/${repoName}`);
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch repository ${username}/${repoName}:`, error);
    return null;
  }
}

/**
 * Fetch the README content for a repository
 * @param username - GitHub username
 * @param repoName - Repository name
 * @returns README markdown content or null if not found
 */
export async function fetchReadme(
  username: string,
  repoName: string
): Promise<string | null> {
  const url = `${GITHUB_API_BASE}/repos/${username}/${repoName}/readme`;

  try {
    const headers = getHeaders();
    // Request raw markdown content
    headers['Accept'] = 'application/vnd.github.v3.raw';

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch README for ${username}/${repoName}:`, error);
    return null;
  }
}

/**
 * Check if a GitHub OpenGraph image exists for a repository
 * @param username - GitHub username
 * @param repoName - Repository name
 * @returns OpenGraph image URL or null
 */
export async function getOpenGraphImageUrl(
  username: string,
  repoName: string
): Promise<string | null> {
  // GitHub's OpenGraph image service
  const ogUrl = `https://opengraph.githubassets.com/1/${username}/${repoName}`;

  try {
    const response = await fetch(ogUrl, { method: 'HEAD' });
    if (response.ok) {
      return ogUrl;
    }
    return null;
  } catch {
    return null;
  }
}
