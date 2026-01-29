# projets-portfolio

A personal portfolio website showcasing creative web development projects.

**Live Site:** [projets-portfolio.vercel.app](https://projets-portfolio.vercel.app)

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.2 - Fast, content-focused static site generator
- **Styling**: Custom CSS with CSS variables, responsive design, dark mode support
- **Deployment**: [Vercel](https://vercel.com/)
- **Data Source**: GitHub API for project data

## Features

- Dynamic project loading from GitHub repositories
- Responsive design (mobile, tablet, desktop)
- Dark/light theme toggle with system preference detection
- **6 unique project image styles** - Orb, Waves, Corners, Grain, Diagonal, Duotone
- Golden angle color distribution for visually distinct project cards
- Error handling with user-friendly messages
- **Style Guide page** (`/styles`) - Complete design system documentation

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured projects, skills |
| `/projets` | All projects grid |
| `/projets/:slug` | Individual project details |
| `/about` | About page |
| `/styles` | Design system showcase |

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm (or pnpm/yarn/bun)
- GitHub Personal Access Token (for higher API rate limits)

### Installation

```bash
# Clone the repository
git clone https://github.com/Jettan17/projets-portfolio.git
cd projets-portfolio

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root:

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | Recommended |

```bash
# .env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

Get a token at [github.com/settings/tokens](https://github.com/settings/tokens) (no scopes needed for public repos).

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
projets-portfolio/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.astro
│   │   ├── Footer.astro
│   │   ├── GeneratedImage.astro  # 6 visual styles
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ProjectCard.astro
│   │   ├── ProjectGrid.astro
│   │   ├── SkillBadge.astro
│   │   ├── SocialLinks.astro
│   │   └── ThemeToggle.astro
│   ├── config/           # Configuration files
│   │   └── github-projects.ts
│   ├── content/          # Content collections
│   │   └── projets/      # Markdown project files
│   ├── data/             # Static data (personal.json)
│   ├── layouts/          # Page layouts
│   ├── lib/              # Libraries
│   │   └── github/       # GitHub API client & image generator
│   ├── pages/            # Route pages
│   │   ├── index.astro   # Homepage
│   │   ├── about.astro   # About page
│   │   ├── styles.astro  # Style Guide
│   │   └── projets/      # Projects pages
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── public/               # Static assets
├── codemaps/             # Architecture documentation
├── .env                  # Environment variables (not committed)
├── astro.config.mjs      # Astro configuration
├── package.json
└── vercel.json           # Vercel deployment config
```

## Design System

The site uses a High-Key colorful design with:

### Colors
- Primary: Coral red (#FF6B6B)
- Secondary: Teal (#4ECDC4)
- Accent: Bright yellow (#FFE66D)
- Highlight: Mint (#95E1D3)

### Project Image Styles

Each project card displays a unique generated image with one of 6 visual styles:

| Style | Description |
|-------|-------------|
| Orb | Refined gradient ellipse with blur |
| Waves | Bold 3-layer SVG waves |
| Corners | Dual corner accents with glow |
| Grain | Noise texture overlay |
| Diagonal | Single bold accent line |
| Duotone | Two-tone vertical split |

Colors are generated using golden angle distribution (137.508 degrees) for maximum visual distinction between projects.

Visit `/styles` to see all design system elements.

## Adding Projects

Projects are loaded from GitHub. Configure them in `src/config/github-projects.ts`:

```typescript
export const githubProjects: GitHubProjectConfig[] = [
  {
    repo: 'your-repo-name',
    title: 'Display Title',
    featured: true,
    tags: ['TypeScript', 'React'],
    liveUrl: 'https://your-demo.com', // optional
  },
];
```

## Documentation

- [Architecture](codemaps/architecture.md) - System overview
- [Frontend](codemaps/frontend.md) - Components, pages, routing
- [Data](codemaps/data.md) - Data sources, GitHub integration

## Deployment

The site auto-deploys to Vercel on push to `main`. For manual deployment:

```bash
npm run build
npx vercel --prod
```

## License

MIT
