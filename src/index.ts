#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 設定の型定義
interface ToolConfig {
  enabledTools: string[];
  [key: string]: any;
}

// ツールモジュールの型定義
interface ToolModule {
  prefix: string;
  name: string;
  tools: any[];
  handler: (name: string, args: any) => Promise<any>;
  check?: () => Promise<void>;
}

class UnifiedMcpServer {
  private server: Server;
  private toolModules: ToolModule[] = [];
  private config: ToolConfig;
  private startTime: number = Date.now();

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

    this.config = this.loadConfig();
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  /**
   * 設定ファイルを読み込む
   */
  private loadConfig(): ToolConfig {
    try {
      const configPath = path.join(__dirname, 'config', 'tools.json');
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      }
    } catch (error) {
      console.error('設定ファイルの読み込みに失敗、デフォルト設定を使用:', error);
    }

    // デフォルト設定
    return {
      enabledTools: ['ollama', 'chinese', 'poetry', 'fashion', 'history', 'zhouyi', 'code'],
      ollama: {
        baseUrl: 'http://localhost:11434',
        defaultModel: 'llama2',
        timeout: 30000
      },
      poetry: {
        cacheSize: 100,
        defaultDynasty: 'tang'
      },
      fashion: {
        maxRecommendations: 5,
        includePrices: true
      },
      history: {
        defaultRegion: 'china',
        includeMaps: false
      },
      zhouyi: {
        defaultMethod: 'coin',
        includeInterpretation: true
      },
      code: {
        maxTokens: 2048,
        temperature: 0.7
      }
    };
  }

  /**
   * ツールモジュールを動的に読み込む
   */
  private async loadToolModules(): Promise<void> {
    const toolsDir = path.join(__dirname, 'tools');

    try {
      const files = fs.readdirSync(toolsDir)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'))
        .filter(file => !file.startsWith('_'));

      for (const file of files) {
        const moduleName = file.replace(/\.(js|ts)$/, '');
        const filenamePrefix = moduleName.split('-')[0];

        // 設定で無効化されているツールはスキップ
        const isEnabled = this.config.enabledTools.some(tool =>
          moduleName.includes(tool) || filenamePrefix === tool
        );

        if (!isEnabled) {
          console.error(`ℹ ${moduleName} is disabled in config`);
          continue;
        }

        try {
          const modulePath = `./tools/${file}`;
          const module = await import(modulePath);

          // ツールとハンドラーの取得（命名パターンの自動検出）
          const prefix = moduleName.replace(/-/g, '_');
          const shortPrefix = filenamePrefix;

          let tools = module[`${prefix}Tools`] ||
            module[`${shortPrefix}Tools`] ||
            module.tools;

          let handler = module[`handle${this.capitalize(prefix)}Tool`] ||
            module[`handle${this.capitalize(shortPrefix)}Tool`] ||
            module[`handle${this.capitalize(prefix)}`] ||
            module[`handle${this.capitalize(shortPrefix)}`] ||
            module.handleTool ||
            module.default?.handler;

          // 自動検出フォールバック: 任意のTools/handlerを探す
          if (!tools || !handler) {
            for (const key of Object.keys(module)) {
              if (!tools && key.toLowerCase().endsWith('tools') && Array.isArray(module[key])) {
                tools = module[key];
              }
              if (!handler && (key.toLowerCase().startsWith('handle') || key.toLowerCase().endsWith('handler')) && typeof module[key] === 'function') {
                handler = module[key];
              }
            }
          }

          tools = tools || [];

          // ヘルスチェック関数があれば取得
          const check = module[`check${this.capitalize(prefix)}`] ||
            module[`check${this.capitalize(shortPrefix)}`] ||
            module.checkHealth;

          if (tools.length > 0 && handler) {
            // ツールの実際の名称から共通の接頭辞を抽出（例: poetry_generate -> poetry_）
            const firstToolName = tools[0].name;
            const detectedPrefix = firstToolName.includes('_') ?
              firstToolName.split('_')[0] + '_' :
              '';

            this.toolModules.push({
              prefix: detectedPrefix,
              name: moduleName,
              tools,
              handler,
              check
            });
            console.error(`✓ Loaded ${moduleName}: ${tools.length} tools (prefix: ${detectedPrefix})`);
          }
        } catch (error) {
          console.error(`✗ Failed to load ${moduleName}:`, error);
        }
      }
    } catch (error) {
      console.error('ツールモジュールの読み込みに失敗:', error);
    }
  }

  private capitalize(str: string): string {
    return str.split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }

  /**
   * 全ツールのヘルスチェックを実行
   */
  private async validateTools(): Promise<void> {
    console.error('\n🔧 Tool Health Check:');

    for (const module of this.toolModules) {
      if (module.check) {
        try {
          await module.check();
          console.error(`  ✓ ${module.name}: ${module.tools.length} tools ready`);
        } catch (error: any) {
          console.error(`  ✗ ${module.name}: ${error.message}`);
        }
      } else {
        console.error(`  ○ ${module.name}: ${module.tools.length} tools (no health check)`);
      }
    }
    console.error('');
  }

  /**
   * ミドルウェア付きでツールを実行
   */
  private async executeWithMiddleware(
    name: string,
    args: any,
    handler: Function
  ): Promise<any> {
    const requestId = Math.random().toString(36).substring(7);
    const startTime = Date.now();

    // リクエストログ（機密情報はマスク）
    const safeArgs = this.maskSensitiveData(args);
    console.error(`[${requestId}] ➔ ${name}`, safeArgs);

    try {
      const result = await handler(name, args);

      // レスポンスログ
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] ✓ ${name} (${duration}ms)`);

      // 結果のサイズチェック
      const resultSize = JSON.stringify(result).length;
      if (resultSize > 1024 * 1024) { // 1MB以上
        console.error(`[${requestId}] ⚠ Large response: ${(resultSize / 1024 / 1024).toFixed(2)}MB`);
      }

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] ✗ ${name} (${duration}ms):`, error);
      throw error;
    }
  }

  /**
   * 機密情報をマスク
   */
  private maskSensitiveData(args: any): any {
    if (!args || typeof args !== 'object') return args;

    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'key'];
    const masked = { ...args };

    for (const key of Object.keys(masked)) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        masked[key] = '***MASKED***';
      } else if (typeof masked[key] === 'object') {
        masked[key] = this.maskSensitiveData(masked[key]);
      }
    }

    return masked;
  }

  /**
   * ツール名に対応するハンドラーを取得
   */
  private getHandlerForTool(name: string): ToolModule | undefined {
    return this.toolModules.find(module => name.startsWith(module.prefix));
  }

  /**
   * ツールハンドラーのセットアップ
   */
  private setupToolHandlers() {
    // ツール一覧の取得
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const allTools = this.toolModules.flatMap(module => module.tools);

      // システム情報ツールを追加
      const systemTools = [
        {
          name: 'system_health',
          description: 'Get system health information',
          inputSchema: {
            type: 'object',
            properties: {
              detailed: {
                type: 'boolean',
                description: 'Include detailed information',
                default: false
              }
            }
          }
        },
        {
          name: 'system_config',
          description: 'Get current configuration',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ];

      return {
        tools: [...allTools, ...systemTools]
      };
    });

    // ツール実行
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      try {
        // システムツールの処理
        if (name === 'system_health') {
          return await this.handleSystemHealth(args);
        }
        if (name === 'system_config') {
          return await this.handleSystemConfig();
        }

        // 通常ツールの処理
        const module = this.getHandlerForTool(name);
        if (!module) {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
        }

        return await this.executeWithMiddleware(
          name,
          args || {},
          module.handler
        );
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

  /**
   * システムヘルス情報の処理
   */
  private async handleSystemHealth(args: any): Promise<any> {
    const detailed = args?.detailed || false;
    const uptime = process.uptime();
    const memory = process.memoryUsage();
    const now = Date.now();

    const healthInfo: any = {
      status: 'healthy',
      uptime: {
        seconds: uptime,
        formatted: this.formatUptime(uptime)
      },
      tools: this.toolModules.reduce((acc, module) => {
        acc[module.name] = module.tools.length;
        return acc;
      }, {} as Record<string, number>),
      totalTools: this.toolModules.reduce((sum, m) => sum + m.tools.length, 0),
      timestamp: new Date().toISOString()
    };

    if (detailed) {
      healthInfo.memory = {
        rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
        external: `${Math.round(memory.external / 1024 / 1024)} MB`
      };
      healthInfo.process = {
        pid: process.pid,
        version: process.version,
        platform: process.platform,
        arch: process.arch
      };
      healthInfo.config = {
        ...this.config
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(healthInfo, null, 2)
        }
      ]
    };
  }

  /**
   * システム設定情報の処理
   */
  private async handleSystemConfig(): Promise<any> {
    // 機密情報を除去した設定を返す
    const safeConfig = { ...this.config };

    // APIキーなどの機密情報をマスク
    const maskSensitive = (obj: any) => {
      for (const key in obj) {
        if (key.toLowerCase().includes('key') ||
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('token')) {
          obj[key] = '***MASKED***';
        } else if (typeof obj[key] === 'object') {
          maskSensitive(obj[key]);
        }
      }
    };

    maskSensitive(safeConfig);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(safeConfig, null, 2)
        }
      ]
    };
  }

  /**
   * 稼働時間のフォーマット
   */
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }

  /**
   * エラーハンドリングのセットアップ
   */
  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);

      // エラーの種類に応じたログ
      if (error instanceof McpError) {
        console.error(`  Code: ${error.code}`);
        console.error(`  Message: ${error.message}`);
      }
    };

    // プロセス終了時のハンドリング
    process.on('SIGINT', async () => {
      console.error('\n🛑 Shutting down server...');
      await this.server.close();
      console.error('👋 Server stopped');
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      // 重大なエラーでもサーバーは継続
    });

    process.on('unhandledRejection', (reason: any, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    });
  }

  /**
   * サーバー起動
   */
  async run() {
    // ツールモジュールの読み込み
    await this.loadToolModules();

    // ヘルスチェックの実行
    await this.validateTools();

    // サーバー起動
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    // 起動情報の表示
    console.error('\n🚀 Unified MCP Server is running!');
    console.error('================================');
    console.error(`📦 Version: 1.0.0`);
    console.error(`🕒 Started: ${new Date().toLocaleString()}`);
    console.error(`📊 Total tools: ${this.toolModules.reduce((sum, m) => sum + m.tools.length, 0)}`);
    console.error('\n📋 Loaded modules:');

    for (const module of this.toolModules) {
      console.error(`  • ${module.name}: ${module.tools.length} tools`);
    }

    console.error('\n💡 System tools available:');
    console.error('  • system_health - Check server health');
    console.error('  • system_config - View configuration');
    console.error('\n✅ Ready to accept requests\n');
  }
}

function ensureConfigDir() {
  const configDir = path.join(__dirname, 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configPath = path.join(configDir, 'tools.json');
  if (!fs.existsSync(configPath)) {
    // デフォルト設定ファイルの作成
    const defaultConfig = {
      enabledTools: ['ollama', 'chinese', 'poetry', 'fashion', 'history', 'zhouyi', 'code'],
      ollama: {
        baseUrl: 'http://localhost:11434',
        defaultModel: 'llama2',
        timeout: 30000
      },
      poetry: {
        cacheSize: 100,
        defaultDynasty: 'tang'
      },
      fashion: {
        maxRecommendations: 5,
        includePrices: true
      },
      history: {
        defaultRegion: 'china',
        includeMaps: false
      },
      zhouyi: {
        defaultMethod: 'coin',
        includeInterpretation: true
      },
      code: {
        maxTokens: 2048,
        temperature: 0.7
      }
    };

    fs.writeFileSync(
      configPath,
      JSON.stringify(defaultConfig, null, 2)
    );
  }
}

// サーバー起動
async function bootstrap() {
  try {
    ensureConfigDir();
    const server = new UnifiedMcpServer();
    await server.run();
  } catch (error: any) {
    console.error('致命的なエラーが発生しました:', error);
    process.exit(1);
  }
}

bootstrap();