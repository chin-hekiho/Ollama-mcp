# Implementation Plan - Unified MCP Server

## Goal Description
Consolidate three separate MCP servers (`fashion_stylist_app`, `Ollama-mcp`, `chinese_poetry_app`) into a single unified MCP server running within the `fashion_stylist_app` directory (which will serve as the host).

## Proposed Changes

### Dependencies
#### [MODIFY] [package.json](file:///home/chinhekiho/mhd/dev/fashion_stylist_app/package.json)
- Add `axios` (required for Ollama API calls).
- Add `@types/node` (ensure it's there).

### Modules
#### [NEW] [src/modules/ollama.ts](file:///home/chinhekiho/mhd/dev/fashion_stylist_app/src/modules/ollama.ts)
- Port logic from `Ollama-mcp`.
- Implement tools: `ollama_serve`, `ollama_run`, `chat_completion`, etc.
- Use `axios` for API calls and `child_process` for CLI commands.

#### [NEW] [src/modules/poetry.ts](file:///home/chinhekiho/mhd/dev/fashion_stylist_app/src/modules/poetry.ts)
- Port logic from `chinese_poetry_app`.
- Implement tools: `generate_poetry`, `explain_poetry`, etc.
- Include static data/prompts.

#### [NEW] [src/modules/fashion.ts](file:///home/chinhekiho/mhd/dev/fashion_stylist_app/src/modules/fashion.ts)
- (Optional refactor) Move `getOutfitSuggestions` etc. from `data.ts` to here for consistency, or just re-export from `data.ts`.

### Server Implementation
#### [MODIFY] [src/index.ts](file:///home/chinhekiho/mhd/dev/fashion_stylist_app/src/index.ts)
- Import tools from all modules.
- Register all tools in the `ListToolsRequestSchema` handler.
- Route requests to appropriate handlers in `CallToolRequestSchema`.

## Verification Plan

### Automated Tests
- Build the project: `npm run build`.

### Manual Verification
- Verify `build/index.js` exists.
- Provide updated `claude_desktop_config.json` with a single server entry.
