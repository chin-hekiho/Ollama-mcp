# Unified MCP Server

🚀 **一个统一的 MCP 服务器入口**,整合了 Ollama、古诗词学习、时尚搭配和会议记录 AI 的所有功能。

> **重要**: 本项目现在只有**一个** MCP 服务器入口点。所有独立的服务器实现已被整合。如果您之前使用过独立服务器,请查看 [MIGRATION.md](./MIGRATION.md)。

## 🌟 特性

### 完整功能整合
- **26 个工具**集成在**单一服务器**中
- **一次构建**,所有功能可用
- **统一配置**,只需配置一个 MCP 服务器
- **模块化设计**,易于维护和扩展

### 核心能力

#### 🤖 Ollama 工具 (10个)
- 完整的 Ollama API 集成
- OpenAI 兼容的聊天完成接口
- 模型管理 (pull, push, list, create, copy, remove)
- 本地 LLM 执行

#### 🌸 古诗词学习 (4个)
- 诗词生成 (唐诗、宋词、元曲)
- 诗词解释和赏析
- 诗词接龙
- 古诗词问答

#### 👗 时尚搭配 (4个)
- 穿搭建议
- 配色方案
- 配饰搭配 (包包、鞋子)
- 风格分析

#### 📚 历史知识 (4个)
- 历史人物查询
- 历史事件查询
- 朝代信息查询
- 历史文化查询

#### ☯️ 周易占卜 (4个)
- 起卦并解读 (支持随机、时间、手动起卦)
- 卦象解读 (结合具体问题)
- 卦象详解 (卦辞、象辞、爻辞)
- 周易问答 (周易理论、占卜方法)

---

## 🚀 快速开始

### 前置要求
- [Ollama](https://ollama.ai) 已安装
- Node.js 和 npm

### 安装

1. **安装依赖**:
```bash
npm install
```

2. **构建服务器**:
```bash
npm run build
```

3. **配置 Claude Desktop**:

**Windows**: 编辑 `%APPDATA%/Claude/claude_desktop_config.json`  
**macOS**: 编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "unified-mcp": {
      "command": "wsl",
      "args": [
        "node",
        "/home/chinhekiho/mhd/dev/Ollama-mcp/build/index.js"
      ],
      "env": {
        "OLLAMA_HOST": "http://127.0.0.1:11434"
      }
    }
  }
}
```

> **注意**: 如果项目在 WSL 中,使用 `wsl` 命令。如果在 macOS/Linux 原生环境,直接使用 `node`。

4. **重启 Claude Desktop**

---

## 📚 使用指南

详细使用说明请查看 [USAGE_GUIDE.md](./USAGE_GUIDE.md)

### 快速示例

#### 使用 Ollama
```javascript
// 列出模型
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "ollama_list"
})
```

#### 生成古诗词
```javascript
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "poetry_generate",
  arguments: {
    theme: "春天",
    style: "唐诗"
  }
})
```

#### 获取穿搭建议
```javascript
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "fashion_outfit_suggestions",
  arguments: {
    style: "休闲",
    occasion: "约会"
  }
})
```

#### 提取会议纪要
```javascript
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "meeting_extract_summary",
  arguments: {
    meeting_text: "会议内容..."
  }
})
```

#### 查询历史知识
```javascript
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "history_person_query",
  arguments: {
    person_name: "李白"
  }
})
```

---

## 📁 项目结构

```
Ollama-mcp/
├── src/
│   ├── index.ts                    # 🎯 统一 MCP 服务器入口 (唯一入口)
│   ├── tools/
│   │   ├── ollama.ts               # Ollama 工具 (10个)
│   │   ├── chinese-poetry.ts       # 古诗词工具 (4个)
│   │   ├── fashion-stylist.ts      # 时尚搭配工具 (4个)
│   │   ├── history-knowledge.ts    # 历史知识工具 (4个)
│   │   └── zhouyi-divination.ts    # 周易占卜工具 (4个)
│   └── data/
│       └── fashion-data.ts         # 时尚数据
├── build/                          # 构建输出
├── chinese_poetry_app/             # 古诗词 Python/Streamlit 应用
├── fashion_stylist_app/            # 时尚搭配 Python 应用
├── zhouyi_divination/              # 周易占卜 Python 应用
├── package.json
├── tsconfig.json
├── README.md
├── USAGE_GUIDE.md
└── MIGRATION.md                    # 迁移指南
```

> **注意**: `chinese_poetry_app` 和 `fashion_stylist_app` 目录中的 Python 应用仍然保留,但它们的独立 MCP 服务器已被移除并整合到统一服务器中。

---

## 🛠️ 开发

### 监听模式
```bash
npm run watch
```

### 调试
```bash
npm run inspector
```

### 添加新工具

1. 在 `src/tools/` 创建新模块
2. 定义工具和处理函数
3. 在 `src/index.ts` 中导入并注册
4. 重新构建: `npm run build`

---

## 🔧 高级配置

### 自定义 Ollama 端点
```json
{
  "mcpServers": {
    "unified-mcp": {
      "env": {
        "OLLAMA_HOST": "http://custom-host:11434"
      }
    }
  }
}
```

### Meeting Notes Python 环境
```bash
cd meeting_notes_ai
pip install -r requirements.txt
```

---

## 📊 架构优势

| 特性 | 旧架构 (分散) | 新架构 (统一) ✅ |
|------|--------------|--------------| 
| MCP 服务器数量 | 3 个独立服务器 | **1 个统一服务器** |
| 工具总数 | 18 个 | **26 个** |
| 构建次数 | 3 次 | **1 次** |
| Claude Desktop 配置 | 3 个条目 | **1 个条目** |
| 维护复杂度 | 高 | **低** |
| 代码复用 | 低 | **高** |
| 资源占用 | 3 个进程 | **1 个进程** |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Ollama](https://ollama.ai) - 本地 LLM 运行时
- [MCP SDK](https://github.com/modelcontextprotocol) - Model Context Protocol
- Streamlit - Web 应用框架

---

**让 AI 工具更简单,更强大!** 🚀
