# Tasks: Consolidate MCP Servers

- [ ] Setup Unified Environment <!-- id: 0 -->
    - [ ] Install `axios` (for Ollama) <!-- id: 1 -->
- [ ] Migrate Modules <!-- id: 2 -->
    - [ ] Create `src/modules/ollama.ts` (Port Ollama-mcp logic) <!-- id: 3 -->
    - [ ] Create `src/modules/poetry.ts` (Port Chinese Poetry logic) <!-- id: 4 -->
    - [ ] Move existing fashion logic to `src/modules/fashion.ts` (Optional, or keep in `data.ts`) <!-- id: 5 -->
- [ ] Implement Unified Server <!-- id: 6 -->
    - [ ] Update `src/index.ts` to register tools from all modules <!-- id: 7 -->
- [ ] Verification <!-- id: 8 -->
    - [ ] Build project <!-- id: 9 -->
    - [ ] Update `claude_desktop_config_snippet.json` <!-- id: 10 -->
