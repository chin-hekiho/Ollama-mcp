# 统一 MCP 服务器使用指南

## 🎉 概述

统一 MCP 服务器已成功创建!现在所有 22 个工具都集成在一个服务器中。

## 📦 已集成的工具

### Ollama 工具 (10个)
- `ollama_serve` - 启动 Ollama 服务器
- `ollama_create` - 创建模型
- `ollama_show` - 显示模型信息
- `ollama_run` - 运行模型
- `ollama_pull` - 拉取模型
- `ollama_push` - 推送模型
- `ollama_list` - 列出模型
- `ollama_cp` - 复制模型
- `ollama_rm` - 删除模型
- `ollama_chat_completion` - OpenAI 兼容聊天

### Chinese Poetry 工具 (4个)
- `poetry_generate` - 生成古诗词
- `poetry_explain` - 解释古诗词
- `poetry_continue` - 诗词接龙
- `poetry_qa` - 古诗词问答

### Fashion Stylist 工具 (4个)
- `fashion_outfit_suggestions` - 获取穿搭建议
- `fashion_color_combinations` - 获取配色方案
- `fashion_accessory_matches` - 获取配饰搭配
- `fashion_style_analysis` - 风格分析

### Meeting Notes 工具 (3个)
- `meeting_extract_summary` - 提取会议纪要
- `meeting_save_record` - 保存会议记录
- `meeting_list_records` - 列出历史记录

### History Knowledge 工具 (4个)
- `history_person_query` - 查询历史人物
- `history_event_query` - 查询历史事件
- `history_dynasty_query` - 查询朝代信息
- `history_culture_query` - 查询历史文化

## 🚀 快速开始

### 1. 构建服务器

```bash
cd /home/chinhekiho/mhd/dev/Ollama-mcp
npm install
npm run build
```

### 2. 配置 Claude Desktop

**配置文件位置**: `%APPDATA%/Claude/claude_desktop_config.json`

**配置内容**:
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

### 3. 重启 Claude Desktop

配置更改后需要重启 Claude Desktop。

## 📝 使用示例

### Ollama 工具

```typescript
// 列出可用模型
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "ollama_list"
})

// 运行模型
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "ollama_run",
  arguments: {
    name: "llama2",
    prompt: "介绍一下中国古诗词"
  }
})
```

### Chinese Poetry 工具

```typescript
// 生成古诗词
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "poetry_generate",
  arguments: {
    theme: "春天",
    style: "唐诗",
    length: 8
  }
})

// 解释古诗词
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "poetry_explain",
  arguments: {
    poetry_text: "床前明月光,疑是地上霜。举头望明月,低头思故乡。"
  }
})
```

### Fashion Stylist 工具

```typescript
// 获取穿搭建议
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "fashion_outfit_suggestions",
  arguments: {
    style: "休闲",
    occasion: "约会"
  }
})

// 获取配色方案
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "fashion_color_combinations",
  arguments: {
    base_color: "黑色",
    style_preference: "经典"
  }
})
```

### Meeting Notes 工具

```typescript
// 提取会议纪要
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "meeting_extract_summary",
  arguments: {
    meeting_text: "今天的会议讨论了项目进度..."
  }
})

// 保存会议记录
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "meeting_save_record",
  arguments: {
    content: "会议原始内容",
    summary: "会议纪要"
  }
})

// 列出历史记录
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "meeting_list_records"
})
```

### History Knowledge 工具

```typescript
// 查询历史人物
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "history_person_query",
  arguments: {
    person_name: "李白"
  }
})

// 查询历史事件
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "history_event_query",
  arguments: {
    event_name: "赤壁之战"
  }
})

// 查询朝代信息
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "history_dynasty_query",
  arguments: {
    dynasty_name: "唐朝"
  }
})

// 查询历史文化
use_mcp_tool({
  server_name: "unified-mcp",
  tool_name: "history_culture_query",
  arguments: {
    culture_topic: "科举制度"
  }
})
```

## ⚙️ 环境要求

### Meeting Notes AI 工具

Meeting Notes 工具需要 Python 环境:

```bash
cd meeting_notes_ai
pip install -r requirements.txt
```

确保 Python 模型文件正确配置。

## 🔧 故障排除

### 工具无法调用

1. 检查 Ollama 服务是否运行: `ollama list`
2. 检查 Claude Desktop 配置文件路径是否正确
3. 查看 Claude Desktop 日志

### Meeting Notes 工具错误

1. 确保 Python 环境已安装依赖
2. 检查模型文件路径
3. 查看错误日志

### 构建错误

```bash
# 清理并重新构建
rm -rf build node_modules
npm install
npm run build
```

## 📊 对比旧架构

| 项目 | 旧架构 | 新架构 |
|------|--------|--------|
| **MCP 服务器数量** | 3 个 | 1 个 |
| **构建命令** | 3 次 | 1 次 |
| **Claude Desktop 配置** | 3 个条目 | 1 个条目 |
| **维护复杂度** | 高 | 低 |

## 🎯 优势

✅ **简化部署**: 一次构建,所有工具可用  
✅ **统一管理**: 所有工具在一个命名空间下  
✅ **易于维护**: 代码复用,统一错误处理  
✅ **扩展方便**: 添加新工具只需创建新模块  

---

**享受统一 MCP 服务器带来的便利!** 🚀
