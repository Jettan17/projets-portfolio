import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Check if a logo exists for a given repo name
 * Tries multiple naming conventions and extensions
 */
export function getLogoUrl(repoName: string): string | null {
  const extensions = ['.svg', '.png'];
  const publicDir = path.join(process.cwd(), 'public', 'logos');

  // Try multiple name variations: full name, first part, etc.
  const namesToTry = [
    repoName,                           // e.g., "learnex-course-tutor"
    repoName.split('-')[0],             // e.g., "learnex"
    repoName.replace(/-/g, ''),         // e.g., "learnexcoursetutor"
  ];

  for (const name of namesToTry) {
    for (const ext of extensions) {
      const logoPath = path.join(publicDir, `${name}${ext}`);
      if (fs.existsSync(logoPath)) {
        return `/logos/${name}${ext}`;
      }
    }
  }
  return null;
}
