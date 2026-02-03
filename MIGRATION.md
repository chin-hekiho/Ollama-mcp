# 迁移指南 - 统一 MCP 服务器

## 概述

本项目已从三个独立的 MCP 服务器整合为一个统一的入口点。本指南将帮助您从旧配置迁移到新的统一服务器。

## 变更内容

### 之前的架构 ❌

```
Ollama-mcp/
├── src/index.ts                          # 统一服务器
├── chinese_poetry_app/mcp-server/        # 独立古诗词服务器 (已删除)
└── fashion_stylist_app/src/              # 独立时尚搭配服务器 (已删除)
```

### 现在的架构 ✅

```
Ollama-mcp/
├── src/
│   ├── index.ts                    # 唯一的 MCP 服务器入口
│   ├── tools/
│   │   ├── ollama.ts               # Ollama 工具 (10个)
│   │   ├── chinese-poetry.ts       # 古诗词工具 (4个)
│   │   └── fashion-stylist.ts      # 时尚搭配工具 (4个)
│   └── data/
│       └── fashion-data.ts         # 时尚数据
└── build/                          # 构建输出
```

## 迁移步骤

### 1. 更新 Claude Desktop 配置

**旧配置** (如果您之前使用独立服务器):

```json
{
  "mcpServers": {
    "chinese-poetry": {
      "command": "node",
      "args": ["/path/to/chinese_poetry_app/mcp-server/build/index.js"]
    },
    "fashion-stylist": {
      "command": "node",
      "args": ["/path/to/fashion_stylist_app/build/index.js"]
    }
  }
}
```

**新配置** (统一服务器):

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

> **注意**: 
> - 如果在 WSL 中运行,使用 `wsl` 命令
> - 如果在 macOS/Linux 原生环境,使用 `node` 命令
> - 路径需要根据您的实际安装位置调整

### 2. 重新构建项目

```bash
cd /home/chinhekiho/mhd/dev/Ollama-mcp
npm install
npm run build
```

### 3. 重启 Claude Desktop

完全退出并重新启动 Claude Desktop 以加载新配置。

## 工具名称变更

所有工具现在都有统一的命名前缀:

### 古诗词工具

| 旧名称 | 新名称 |
|--------|--------|
| `generate_poetry` | `poetry_generate` |
| `explain_poetry` | `poetry_explain` |
| `continue_poetry` | `poetry_continue` |
| `answer_poetry_question` | `poetry_qa` |

### 时尚搭配工具

| 旧名称 | 新名称 |
|--------|--------|
| `get_outfit_suggestions` | `fashion_outfit_suggestions` |
| `get_color_combinations` | `fashion_color_combinations` |
| `get_accessory_matches` | `fashion_accessory_matches` |
| `get_style_analysis` | `fashion_style_analysis` |

### Ollama 工具

所有 Ollama 工具保持 `ollama_` 前缀不变。

## 验证迁移

在 Claude Desktop 中测试以下命令:

```javascript
// 1. 列出所有可用工具
// 应该看到 18 个工具 (10 Ollama + 4 古诗词 + 4 时尚搭配)

// 2. 测试古诗词工具
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "poetry_generate",
  arguments: {
    theme: "春天",
    style: "唐诗"
  }
})

// 3. 测试时尚搭配工具
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "fashion_outfit_suggestions",
  arguments: {
    style: "休闲",
    occasion: "日常"
  }
})

// 4. 测试 Ollama 工具
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "ollama_list"
})
```

## 优势

✅ **简化配置**: 只需配置一个 MCP 服务器  
✅ **统一管理**: 所有工具在一个地方维护  
✅ **减少资源**: 只运行一个服务器进程  
✅ **一致命名**: 所有工具遵循统一的命名规范  
✅ **易于扩展**: 添加新工具更简单  

## 常见问题

### Q: 旧的独立服务器还能用吗?

A: 不能。独立服务器的代码已被删除。所有功能现在都通过统一服务器提供。

### Q: Python 应用还能运行吗?

A: 可以! `chinese_poetry_app` 和 `fashion_stylist_app` 中的 Python/Streamlit 应用仍然保留,可以独立运行。只是它们的 MCP 服务器部分被整合了。

### Q: 如何添加新工具?

A: 在 `src/tools/` 目录下创建新的工具模块,然后在 `src/index.ts` 中导入并注册即可。

### Q: 遇到问题怎么办?

A: 
1. 检查 Claude Desktop 配置文件路径是否正确
2. 确认已运行 `npm run build`
3. 完全重启 Claude Desktop
4. 查看 Claude Desktop 的日志文件

## 需要帮助?

如有问题,请查看:
- [README.md](./README.md) - 完整使用指南
- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - 详细工具说明
