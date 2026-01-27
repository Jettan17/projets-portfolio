# projets-portfolio

A personal portfolio website to showcase projects and work.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - Fast, content-focused static site generator
- **Style**: Colorful/Creative - Bold colors, creative layouts

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm (or pnpm/yarn/bun)

### Installation

1. Initialize the Astro project:
```bash
npm create astro@latest . -- --template minimal
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run astro` | Run Astro CLI commands |

## Project Structure

```
projets-portfolio/
├── .claude/
│   ├── commands/     # 20 slash commands
│   ├── agents/       # 13 specialized agents
│   └── mcp-configs/  # MCP server configs
├── src/
│   ├── pages/        # Page components
│   ├── layouts/      # Layout components
│   └── components/   # UI components
├── public/           # Static assets
├── CLAUDE.md         # Claude Code directives
├── instructions.md   # Project settings
├── astro.config.mjs  # Astro configuration
└── package.json
```

## Development Workflow

Using JetFlux SDK commands:

```bash
/plan              # Plan feature implementation
/tdd               # Test-driven development
/verify            # Run verification checks
/code-review       # Quality review
/update-readme     # Update this README
```

## License

MIT
