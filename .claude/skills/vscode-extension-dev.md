# Skill: VS Code Extension Development

**Type:** Auto-triggered skill
**Confidence:** 65% avg
**Evolved from:** 2 instincts
**Created:** 2026-02-06

## Trigger Conditions

Activate this skill when ANY of these are detected:
- Building or debugging VS Code extensions
- Extension state not persisting between sessions
- Extension not found in a VS Code fork (Cursor, Windsurf, etc.)
- `onActivate`, `loadConfiguration`, or settings-related extension code

## Diagnostic Checklist

### 1. State Must Persist to Settings
**Source:** `vscode-extension-state-persistence` (70% confidence)

Extension state (toggles, preferences, feature flags) must be written to VS Code settings, not just held in memory or written to flag files.

**Wrong approaches:**
- In-memory variables (lost on reload/restart)
- Flag files on disk (not synced across machines, ignored by Settings Sync)
- `context.globalState` alone (not visible to users, not in settings UI)

**Correct approach:**
```typescript
// Write to VS Code settings (persists, syncs, visible in settings UI)
const config = vscode.workspace.getConfiguration('myExtension');
await config.update('featureEnabled', true, vscode.ConfigurationTarget.Global);

// Read from settings
const enabled = config.get<boolean>('featureEnabled', false);
```

**Register the setting in package.json:**
```json
{
  "contributes": {
    "configuration": {
      "title": "My Extension",
      "properties": {
        "myExtension.featureEnabled": {
          "type": "boolean",
          "default": false,
          "description": "Enable the feature"
        }
      }
    }
  }
}
```

### 2. VS Code Forks Use Different Extension Paths
**Source:** `vscode-fork-extension-paths` (60% confidence)

VS Code forks (Cursor, Windsurf, Antigravity, etc.) store extensions in different directories than standard VS Code.

| Editor | Extension Directory |
|--------|-------------------|
| VS Code | `~/.vscode/extensions/` |
| Cursor | `~/.cursor/extensions/` |
| Windsurf | `~/.windsurf/extensions/` |
| VS Codium | `~/.vscode-oss/extensions/` |

**When debugging "extension not found":**
1. Check which editor the user is running
2. Verify the extension is installed in the correct fork directory
3. Some forks may not support all VS Code APIs - test in the target editor
4. Extension marketplace availability varies by fork

## Decision Flow

```
VS Code extension issue?
  |
  +-- State lost between sessions?
  |     -> Persist to workspace/global settings (#1)
  |
  +-- Extension not found?
  |     -> Check fork-specific extension directory (#2)
  |
  +-- Settings not visible to user?
        -> Register in package.json contributes.configuration (#1)
```

## Source Instincts

| Instinct | Confidence | Domain |
|----------|-----------|--------|
| vscode-extension-state-persistence | 70% | IDE/Tooling |
| vscode-fork-extension-paths | 60% | IDE/Tooling |
