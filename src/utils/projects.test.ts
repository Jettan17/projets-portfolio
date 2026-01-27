import { describe, it, expect } from 'vitest';
import {
  sortByDate,
  getFeaturedProjects,
  filterByTag,
  getAllTags,
  searchProjects,
} from './projects';
import type { ProjectEntry } from './types';

// Test fixtures
const mockProjects: ProjectEntry[] = [
  {
    slug: 'project-a',
    data: {
      title: 'Project Alpha',
      description: 'A great project about web development',
      image: '/images/a.png',
      tags: ['React', 'TypeScript', 'CSS'],
      featured: true,
      publishDate: new Date('2024-01-15'),
    },
  },
  {
    slug: 'project-b',
    data: {
      title: 'Project Beta',
      description: 'An amazing mobile app',
      image: '/images/b.png',
      tags: ['React Native', 'TypeScript'],
      featured: false,
      publishDate: new Date('2024-01-20'),
    },
  },
  {
    slug: 'project-c',
    data: {
      title: 'Project Gamma',
      description: 'Backend API service',
      image: '/images/c.png',
      tags: ['Node.js', 'Express', 'TypeScript'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com/example',
      featured: true,
      publishDate: new Date('2024-01-10'),
    },
  },
];

describe('sortByDate', () => {
  it('should sort projects by publish date (newest first)', () => {
    const result = sortByDate(mockProjects);

    expect(result[0].slug).toBe('project-b');
    expect(result[1].slug).toBe('project-a');
    expect(result[2].slug).toBe('project-c');
  });

  it('should return empty array for empty input', () => {
    const result = sortByDate([]);
    expect(result).toEqual([]);
  });

  it('should not mutate the original array', () => {
    const original = [...mockProjects];
    sortByDate(mockProjects);
    expect(mockProjects).toEqual(original);
  });

  it('should handle single project', () => {
    const single = [mockProjects[0]];
    const result = sortByDate(single);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('project-a');
  });
});

describe('getFeaturedProjects', () => {
  it('should return only featured projects', () => {
    const result = getFeaturedProjects(mockProjects);

    expect(result).toHaveLength(2);
    expect(result.every((p) => p.data.featured)).toBe(true);
  });

  it('should return empty array if no featured projects', () => {
    const nonFeatured: ProjectEntry[] = [
      {
        slug: 'test',
        data: {
          ...mockProjects[0].data,
          featured: false,
        },
      },
    ];
    const result = getFeaturedProjects(nonFeatured);
    expect(result).toEqual([]);
  });

  it('should return empty array for empty input', () => {
    const result = getFeaturedProjects([]);
    expect(result).toEqual([]);
  });
});

describe('filterByTag', () => {
  it('should return projects with the specified tag', () => {
    const result = filterByTag(mockProjects, 'TypeScript');

    expect(result).toHaveLength(3);
  });

  it('should be case-insensitive', () => {
    const result = filterByTag(mockProjects, 'typescript');

    expect(result).toHaveLength(3);
  });

  it('should return empty array if no projects match', () => {
    const result = filterByTag(mockProjects, 'Python');
    expect(result).toEqual([]);
  });

  it('should return empty array for empty input', () => {
    const result = filterByTag([], 'React');
    expect(result).toEqual([]);
  });

  it('should handle partial tag matches', () => {
    const result = filterByTag(mockProjects, 'React');
    // Should match 'React' and 'React Native'
    expect(result).toHaveLength(2);
  });
});

describe('getAllTags', () => {
  it('should return unique tags sorted alphabetically', () => {
    const result = getAllTags(mockProjects);

    expect(result).toEqual([
      'CSS',
      'Express',
      'Node.js',
      'React',
      'React Native',
      'TypeScript',
    ]);
  });

  it('should return empty array for empty input', () => {
    const result = getAllTags([]);
    expect(result).toEqual([]);
  });

  it('should handle projects with no tags', () => {
    const noTags: ProjectEntry[] = [
      {
        slug: 'test',
        data: {
          ...mockProjects[0].data,
          tags: [],
        },
      },
    ];
    const result = getAllTags(noTags);
    expect(result).toEqual([]);
  });
});

describe('searchProjects', () => {
  it('should find projects by title', () => {
    const result = searchProjects(mockProjects, 'Alpha');

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('project-a');
  });

  it('should find projects by description', () => {
    const result = searchProjects(mockProjects, 'mobile app');

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('project-b');
  });

  it('should be case-insensitive', () => {
    const result = searchProjects(mockProjects, 'PROJECT');

    expect(result).toHaveLength(3);
  });

  it('should return empty array for no matches', () => {
    const result = searchProjects(mockProjects, 'xyz123');
    expect(result).toEqual([]);
  });

  it('should return empty array for empty query', () => {
    const result = searchProjects(mockProjects, '');
    expect(result).toEqual([]);
  });

  it('should return empty array for empty input', () => {
    const result = searchProjects([], 'test');
    expect(result).toEqual([]);
  });

  it('should handle whitespace in query', () => {
    const result = searchProjects(mockProjects, '  web development  ');

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('project-a');
  });
});
