"""
Configuration for Zhouyi Divination App
"""

import os

# Backend Selection
# Options: "claude" or "ollama"
BACKEND = "ollama"  # Using Ollama via MCP (no API key required)

# Claude Configuration (optional, only if you want to use Claude API directly)
# You can set ANTHROPIC_API_KEY as environment variable or enter it in the UI
CLAUDE_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = "claude-3-5-sonnet-20241022"  # Best model for Chinese

# Ollama Configuration (default backend - no API key needed!)
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "qwen2.5:latest"  # Excellent Chinese language model

# Generation Parameters
DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_TOKENS = 1500  # Increased for better responses

# App Settings
APP_TITLE = "周易占卜助手"
APP_ICON = "☯️"
