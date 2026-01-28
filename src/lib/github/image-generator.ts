/**
 * Generate placeholder images for GitHub projects
 * @module lib/github/image-generator
 */

/**
 * Language color mappings (gradient start → end)
 */
export const languageColors: Record<string, { start: string; end: string }> = {
  // Blues & Cyans
  TypeScript: { start: '#007ACC', end: '#0058a3' },     // Vivid blue (official TS color)
  Go: { start: '#00ADD8', end: '#008db0' },             // Cyan/Teal

  // Yellows & Oranges
  JavaScript: { start: '#F0DB4F', end: '#d4c244' },     // Bright yellow
  Java: { start: '#ED8B00', end: '#c97500' },           // Orange (Java's official)
  Astro: { start: '#FF5D01', end: '#cc4a01' },          // Deep orange

  // Greens & Python
  Python: { start: '#4B8BBE', end: '#306998' },         // Light to dark Python blue (blue-dominant)
  Vue: { start: '#42b883', end: '#35495e' },            // Teal to dark (Vue's gradient)
  Shell: { start: '#4EAA25', end: '#3d8a1d' },          // Terminal green

  // Reds & Pinks
  HTML: { start: '#E44D26', end: '#F16529' },           // Orange-red gradient
  Ruby: { start: '#CC342D', end: '#a32925' },           // Ruby red
  'C++': { start: '#f34b7d', end: '#c23c64' },          // Pink
  Swift: { start: '#F05138', end: '#c8412d' },          // Swift orange-red

  // Purples
  CSS: { start: '#264de4', end: '#2965f1' },            // CSS blue (official)
  PHP: { start: '#777BB4', end: '#5f6396' },            // PHP purple
  Kotlin: { start: '#7F52FF', end: '#C711E1' },         // Kotlin gradient (purple to magenta)

  // Earthy tones
  Rust: { start: '#CE422B', end: '#a33622' },           // Rust orange-brown
  C: { start: '#A8B9CC', end: '#5C6BC0' },              // Light blue to indigo

  // Neutral
  default: { start: '#6e7681', end: '#4a4f54' },        // Gray
};

/**
 * Display fonts for title overlay (rotated based on repo name)
 */
export const displayFonts = [
  'Playfair Display',
  'Poppins',
  'Space Grotesk',
  'Outfit',
  'DM Sans',
];

/**
 * Simple hash function for deterministic font selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get the display font for a repository
 */
export function getFontForRepo(repoName: string): string {
  const index = hashString(repoName) % displayFonts.length;
  return displayFonts[index];
}

/**
 * Get gradient colors for a language
 */
export function getLanguageGradient(language: string | null): { start: string; end: string } {
  return languageColors[language ?? 'default'] ?? languageColors.default;
}

/**
 * Generate inline SVG data URL for a project placeholder
 */
export function generatePlaceholderDataUrl(
  title: string,
  language: string | null,
  repoName: string
): string {
  const colors = getLanguageGradient(language);
  const font = getFontForRepo(repoName);

  // Escape special characters for SVG
  const escapedTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.start}" />
          <stop offset="100%" style="stop-color:${colors.end}" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="800" height="500" fill="url(#bg)" />
      <text
        x="400"
        y="260"
        text-anchor="middle"
        font-family="'${font}', system-ui, sans-serif"
        font-size="56"
        font-weight="600"
        fill="white"
        filter="url(#shadow)"
      >${escapedTitle}</text>
    </svg>
  `.trim();

  // Convert to data URL
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Get the GitHub OpenGraph image URL for a repository
 */
export function getGitHubOgImageUrl(username: string, repoName: string): string {
  return `https://opengraph.githubassets.com/1/${username}/${repoName}`;
}
