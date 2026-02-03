# 🌸 古诗词学习助手

基于 MCP (Model Context Protocol) 的中国古诗词学习工具

## 🎯 项目简介

这是一个通过 **MCP 工具**集成到 Claude Desktop 的古诗词学习助手。您可以在 Claude Desktop 中直接使用古诗词相关功能,无需任何 API Key。

## ✨ 主要功能 (MCP 工具)

### 📝 诗词生成 (`poetry_generate`)
- 根据主题生成古诗词
- 支持不同风格(唐诗、宋词、元曲等)
- 可调节诗词长度

### 📖 诗词解释 (`poetry_explain`)
- 详细解释诗词含义
- 分析诗词背景和艺术特色
- 提供文学知识

### 🔗 诗词接龙 (`poetry_continue`)
- 根据上句接续下句
- 保持韵律和意境
- 增强创作能力

### ❓ 诗词问答 (`poetry_qa`)
- 回答古诗词相关问题
- 提供诗人信息
- 解释诗词格律

## 🚀 快速开始

### 前置要求

1. **Claude Desktop** (Windows/macOS)
2. **Node.js** (用于运行 MCP 服务器)
3. **Ollama** (可选,用于本地 LLM)

### 使用步骤

#### 1. 确认统一 MCP 服务器已构建

```bash
cd /home/chinhekiho/mhd/dev/Ollama-mcp
npm run build
```

#### 2. 配置 Claude Desktop

编辑 Claude Desktop 配置文件:


#### 3. 安装 Python 依赖

```bash
pip install -r requirements.txt
```

#### 4. 启动 Ollama 服务

```bash
ollama serve
```

#### 5. 运行应用

方式一:使用启动脚本
```bash
python run_app.py
```

方式二:直接使用 Streamlit
```bash
streamlit run app.py
```

#### 6. 访问应用

应用将在浏览器中自动打开,地址:`http://localhost:8501`

## ⚙️ 配置说明

默认配置文件 [`config.py`](file:///home/chinhekiho/mhd/dev/Ollama-mcp/chinese_poetry_app/config.py):

```python
BACKEND = "ollama"  # 使用 Ollama (无需 API key)
OLLAMA_MODEL = "qwen2.5:latest"  # 推荐的中文模型
```

### 切换模型

如果想使用不同的 Ollama 模型,修改 `config.py`:

```python
OLLAMA_MODEL = "qwen2.5:7b"   # 或其他模型
```

### 可选:使用 Claude API

如果您有 Claude API Key:

```python
BACKEND = "claude"
CLAUDE_API_KEY = "your-api-key"
```

详细配置说明请查看 [CONFIG_UPDATE.md](file:///home/chinhekiho/mhd/dev/Ollama-mcp/chinese_poetry_app/CONFIG_UPDATE.md)

## 📁 项目结构

```
chinese_poetry_app/
├── app.py              # 主应用文件
├── poetry_data.py      # 诗词数据
├── requirements.txt    # 依赖文件
├── run_app.py         # 启动脚本
└── README.md          # 项目说明
```

## 🛠️ 技术栈

- **前端框架**: Streamlit
- **AI模型**: 基于LLMs-from-scratch项目的GPT模型
- **数据处理**: Python + Pandas
- **机器学习**: PyTorch

## 📊 数据来源

应用包含丰富的古诗词数据：
- 唐诗：经典作品
- 宋词：名家词作
- 元曲：代表性作品
- 诗人信息：详细背景
- 格律知识：诗词规则

## 🎨 界面特色

- 🎨 美观的现代化界面
- 📱 响应式设计，支持移动端
- 🌸 中国风主题设计
- 🚀 流畅的用户体验

## 🔧 开发说明

### 添加新功能

1. 在 `app.py` 中添加新的功能函数
2. 在侧边栏中添加功能选项
3. 更新 `poetry_data.py` 中的相关数据

### 扩展数据集

1. 在 `poetry_data.py` 中添加新的诗词数据
2. 更新相关的查询函数
3. 测试新功能

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

本项目基于原LLMs-from-scratch项目的Apache License 2.0许可证。

## 🙏 致谢

- 感谢原LLMs-from-scratch项目提供的AI模型基础
- 感谢所有古诗词作者和研究者
- 感谢Streamlit团队提供的优秀框架

---

**享受古诗词之美，感受中华文化之韵！** 🌸 