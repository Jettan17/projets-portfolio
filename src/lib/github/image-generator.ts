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
 * Technology colors for stack-based gradients
 * Includes languages, frameworks, databases, and tools
 */
export const techColors: Record<string, string> = {
  // Languages
  TypeScript: '#007ACC',
  JavaScript: '#F0DB4F',
  Python: '#4B8BBE',
  Go: '#00ADD8',
  Rust: '#CE422B',
  Java: '#ED8B00',
  'C++': '#f34b7d',
  C: '#A8B9CC',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Swift: '#F05138',
  Kotlin: '#7F52FF',
  Shell: '#4EAA25',
  HTML: '#E44D26',
  CSS: '#264de4',

  // Frontend Frameworks
  React: '#61DAFB',
  Vue: '#42b883',
  Angular: '#DD0031',
  Svelte: '#FF3E00',
  'Next.js': '#000000',
  Nextjs: '#000000',
  Next: '#000000',
  Nuxt: '#00DC82',
  Astro: '#FF5D01',
  Solid: '#2C4F7C',
  Qwik: '#18B6F6',

  // Backend Frameworks
  'Node.js': '#68A063',
  Node: '#68A063',
  Express: '#000000',
  FastAPI: '#009688',
  Django: '#092E20',
  Flask: '#000000',
  Rails: '#CC0000',
  Spring: '#6DB33F',
  NestJS: '#E0234E',
  Deno: '#000000',

  // Databases
  PostgreSQL: '#336791',
  Postgres: '#336791',
  MongoDB: '#47A248',
  Redis: '#DC382D',
  MySQL: '#4479A1',
  SQLite: '#003B57',
  Supabase: '#3ECF8E',
  Firebase: '#FFCA28',
  Prisma: '#2D3748',

  // Cloud & DevOps
  Docker: '#2496ED',
  Kubernetes: '#326CE5',
  AWS: '#FF9900',
  Azure: '#0078D4',
  GCP: '#4285F4',
  Vercel: '#000000',
  Netlify: '#00C7B7',
  Railway: '#0B0D0E',

  // AI/ML
  TensorFlow: '#FF6F00',
  PyTorch: '#EE4C2C',
  OpenAI: '#412991',
  LangChain: '#1C3C3C',
  Hugging: '#FFD21E',
  'Claude Code': '#D97706',
  Claude: '#D97706',
  Anthropic: '#D97706',
  'AI Agents': '#8B5CF6',
  'Developer Tools': '#10B981',
  CLI: '#22D3EE',

  // Mobile
  'React Native': '#61DAFB',
  Flutter: '#02569B',
  iOS: '#000000',
  Android: '#3DDC84',

  // Tools & Others
  GraphQL: '#E10098',
  REST: '#009688',
  Tailwind: '#06B6D4',
  TailwindCSS: '#06B6D4',
  Sass: '#CC6699',
  Webpack: '#8DD6F9',
  Vite: '#646CFF',
  Git: '#F05032',
  Linux: '#FCC624',

  // Default
  default: '#6e7681',
};

/**
 * Display fonts for title overlay (rotated based on repo name)
 * Each font represents a distinct typographic category for visual variety
 */
export const displayFonts = [
  'Playfair Display',   // Serif - elegant, editorial
  'Space Grotesk',      // Geometric Sans - tech, modern
  'JetBrains Mono',     // Monospace - developer, code
  'Roboto Slab',        // Slab Serif - bold, authoritative
  'Inter',              // Neo-grotesque Sans - clean, professional
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
 * Get the primary (start) color for a language
 */
export function getLanguageColor(language: string | null): string {
  return languageColors[language ?? 'default']?.start ?? '#6e7681';
}

/**
 * Get a color for a technology (case-insensitive lookup)
 */
function getTechColor(tech: string): string | null {
  // Direct match
  if (techColors[tech]) return techColors[tech];

  // Case-insensitive match
  const lowerTech = tech.toLowerCase();
  for (const [key, color] of Object.entries(techColors)) {
    if (key.toLowerCase() === lowerTech) return color;
  }

  return null;
}

/**
 * Get stack colors from tags array
 * Returns up to 4 colors for the gradient
 */
export function getStackColors(tags: string[], language?: string | null): string[] {
  const colors: string[] = [];
  const seen = new Set<string>();

  // First, try to get colors from tags
  for (const tag of tags) {
    const color = getTechColor(tag);
    if (color && !seen.has(color)) {
      colors.push(color);
      seen.add(color);
      if (colors.length >= 4) break;
    }
  }

  // If we don't have enough colors, add the language color
  if (colors.length < 2 && language) {
    const langColor = techColors[language] ?? languageColors[language]?.start;
    if (langColor && !seen.has(langColor)) {
      colors.unshift(langColor); // Add at start (center of gradient)
      seen.add(langColor);
    }
  }

  // Fallback to default if no colors found
  if (colors.length === 0) {
    return [techColors.default];
  }

  return colors;
}

/**
 * Generate a radial gradient CSS string from stack colors
 */
export function getStackGradient(tags: string[], language?: string | null): string {
  const colors = getStackColors(tags, language);

  if (colors.length === 1) {
    // Single color - simple radial fade
    return `radial-gradient(circle at center, ${colors[0]} 0%, transparent 70%)`;
  }

  // Multi-color radial gradient
  // Distribute colors evenly from center to edge
  const stops = colors.map((color, i) => {
    const percent = Math.round((i / (colors.length - 1)) * 60); // 0% to 60%
    return `${color} ${percent}%`;
  });

  // Add transparent fade at the end
  stops.push('transparent 85%');

  return `radial-gradient(circle at center, ${stops.join(', ')})`;
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

// =============================================================================
// UNIQUE PROJECT COLORS & STYLES (not based on tech stack)
// =============================================================================

/**
 * Image style variants for project cards
 */
export const imageStyles = ['orb', 'waves', 'corners', 'grain', 'diagonal', 'duotone-grain'] as const;
export type ImageStyle = (typeof imageStyles)[number];

/**
 * Custom color overrides for specific projects
 * Hue values: 0=red, 30=orange, 60=yellow, 120=green, 180=cyan, 240=blue, 300=magenta
 * Each project gets a UNIQUE, well-separated hue for visual variety
 */
const customProjectHues: Record<string, number> = {
  // Stratos: Blue logo → Warm coral/orange (complementary to blue per color theory)
  'stratos-investment-assistant': 25,
  // Learnex: Purple/Yellow logo → Teal/cyan (contrasts purple, complements yellow)
  'learnex-course-tutor': 175,
  // Prizm: Rainbow prism logo → Deep violet (complements spectrum colors)
  'prizm-photo-album': 280,
  // JetFlux: SDK branding → Warm amber/gold
  'jetflux-cc-sdk': 45,
};

/**
 * Get unique hue for a project using golden angle distribution
 * This ensures well-separated colors even for projects with similar names
 */
export function getUniqueProjectHue(repoName: string): number {
  // Check for custom override first
  if (customProjectHues[repoName] !== undefined) {
    return customProjectHues[repoName];
  }
  const hash = hashString(repoName);
  // Golden angle (137.508°) creates visually pleasing, well-distributed hues
  return Math.round((hash * 137.508) % 360);
}

/**
 * Get unique color palette for a project based on its name
 * Returns primary, secondary, and accent colors in HSL format
 */
export function getUniqueProjectColors(repoName: string): {
  primary: string;
  secondary: string;
  accent: string;
  hue: number;
} {
  const hue = getUniqueProjectHue(repoName);
  return {
    // Muted, darker backgrounds for better logo contrast
    primary: `hsl(${hue}, 55%, 40%)`,              // Lower saturation, darker
    secondary: `hsl(${(hue + 35) % 360}, 50%, 35%)`, // Subtle color shift
    accent: `hsl(${(hue + 180) % 360}, 60%, 45%)`,   // Complementary accent
    hue,
  };
}

/**
 * Deterministically assign an image style to a project based on its name
 * Same project will always get the same style across rebuilds
 */
export function getProjectStyle(repoName: string): ImageStyle {
  const hash = hashString(repoName);
  const index = hash % imageStyles.length;
  return imageStyles[index];
}

/**
 * Get CSS gradient for unique project colors (replaces stack-based gradient)
 */
export function getUniqueProjectGradient(repoName: string): string {
  const colors = getUniqueProjectColors(repoName);
  return `radial-gradient(circle at center, ${colors.primary} 0%, ${colors.secondary} 60%, transparent 85%)`;
}
