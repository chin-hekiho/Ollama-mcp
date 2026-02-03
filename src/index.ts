#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import all tool modules
import { ollamaTools, handleOllamaTool } from './tools/ollama.js';
import { poetryTools, handlePoetryTool } from './tools/chinese-poetry.js';
import { fashionTools, handleFashionTool } from './tools/fashion-stylist.js';
import { historyTools, handleHistoryTool } from './tools/history-knowledge.js';
import { zhouyiTools, handleZhouyiTool } from './tools/zhouyi-divination.js';
import { codeAssistantTools, handleCodeAssistantTool } from './tools/code-assistant.js';

// Unified MCP Server
class UnifiedMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'unified-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List all tools from all modules
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        ...ollamaTools,
        ...poetryTools,
        ...fashionTools,
        ...historyTools,
        ...zhouyiTools,
        ...codeAssistantTools,
      ],
    }));

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Route to appropriate handler based on tool name prefix
        if (name.startsWith('ollama_')) {
          return await handleOllamaTool(name, args);
        } else if (name.startsWith('poetry_')) {
          return await handlePoetryTool(name, args);
        } else if (name.startsWith('fashion_')) {
          return await handleFashionTool(name, args);
        } else if (name.startsWith('history_')) {
          return await handleHistoryTool(name, args);
        } else if (name.startsWith('zhouyi_')) {
          return await handleZhouyiTool(name, args);
        } else if (name.startsWith('code_')) {
          return await handleCodeAssistantTool(name, args);
        } else {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }
      } catch (error) {
        if (error instanceof McpError) throw error;

        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${errorMessage}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Unified MCP Server running on stdio');
    console.error('Available tools:');
    console.error('  - Ollama: 10 tools (ollama_*)');
    console.error('  - Chinese Poetry: 4 tools (poetry_*)');
    console.error('  - Fashion Stylist: 4 tools (fashion_*)');
    console.error('  - History Knowledge: 4 tools (history_*)');
    console.error('  - Zhouyi Divination: 4 tools (zhouyi_*)');
    console.error('  - Code Assistant: 8 tools (code_*)');
    console.error('Total: 34 tools');
  }
}

// Start the server
const server = new UnifiedMcpServer();
server.run().catch(console.error);
