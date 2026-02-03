# 古诗词学习助手 - 配置更新说明

## 🎉 重要更新

**不再需要 Claude API Key!** 

本应用现在默认使用 **Ollama** 作为后端,通过本地运行的 LLM 提供所有功能,完全免费且无需任何 API 密钥。

## 📋 配置变更

### 之前 ❌
- 需要 Claude API Key
- 需要设置 `ANTHROPIC_API_KEY` 环境变量
- 使用云端 API (可能产生费用)

### 现在 ✅
- **无需任何 API Key**
- 使用本地 Ollama 服务
- 完全免费
- 数据隐私更好

## 🚀 快速开始

### 1. 安装 Ollama

如果还没有安装 Ollama:

```bash
# 访问 https://ollama.ai 下载安装
# 或使用以下命令 (Linux/macOS)
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. 下载中文模型

推荐使用 **Qwen2.5** 模型,它对中文支持非常好:

```bash
ollama pull qwen2.5:latest
```

其他可选的中文模型:
```bash
# 或者使用其他中文模型
ollama pull qwen2.5:7b
ollama pull qwen2.5:14b
```

### 3. 启动 Ollama 服务

```bash
ollama serve
```

### 4. 运行应用

```bash
cd chinese_poetry_app
python run_app.py
```

或者:

```bash
streamlit run app.py
```

## ⚙️ 配置说明

配置文件: [`config.py`](file:///home/chinhekiho/mhd/dev/Ollama-mcp/chinese_poetry_app/config.py)

```python
# 默认配置 (无需修改)
BACKEND = "ollama"  # 使用 Ollama (无需 API key)
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "qwen2.5:latest"
```

### 切换模型

如果想使用不同的模型,修改 `config.py`:

```python
# 使用更大的模型 (更好的效果,但需要更多资源)
OLLAMA_MODEL = "qwen2.5:14b"

# 或使用其他模型
OLLAMA_MODEL = "qwen2.5:7b"
```

### 可选: 使用 Claude API

如果您有 Claude API Key 并希望使用它:

1. 修改 `config.py`:
```python
BACKEND = "claude"
CLAUDE_API_KEY = "your-api-key-here"
```

2. 或设置环境变量:
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

## 🔧 故障排除

### 问题: 无法连接到 Ollama

**解决方案**:
1. 确认 Ollama 正在运行: `ollama serve`
2. 检查端口是否正确: `http://localhost:11434`
3. 测试连接: `ollama list`

### 问题: 模型未找到

**解决方案**:
```bash
# 查看已安装的模型
ollama list

# 下载需要的模型
ollama pull qwen2.5:latest
```

### 问题: 生成速度慢

**解决方案**:
1. 使用更小的模型: `qwen2.5:7b`
2. 确保有足够的内存和 CPU/GPU 资源
3. 调整 `config.py` 中的 `DEFAULT_MAX_TOKENS`

## 📊 模型对比

| 模型 | 大小 | 内存需求 | 速度 | 质量 | 推荐用途 |
|------|------|----------|------|------|----------|
| qwen2.5:latest | ~4.7GB | 8GB | 快 | 优秀 | **推荐** |
| qwen2.5:7b | ~4.7GB | 8GB | 快 | 优秀 | 日常使用 |
| qwen2.5:14b | ~8.5GB | 16GB | 中等 | 极佳 | 高质量需求 |

## 🎯 功能说明

所有功能都可以在**无需 API Key** 的情况下使用:

- ✅ 诗词生成
- ✅ 诗词解释
- ✅ 诗词接龙
- ✅ 诗词问答
- ✅ 学习模式
- ✅ 智能对话

## 💡 性能优化建议

1. **使用 GPU**: 如果有 NVIDIA GPU,Ollama 会自动使用
2. **调整温度**: 在 `config.py` 中调整 `DEFAULT_TEMPERATURE`
3. **限制输出长度**: 调整 `DEFAULT_MAX_TOKENS` 以提高速度

## 🔗 相关链接

- [Ollama 官网](https://ollama.ai)
- [Qwen2.5 模型介绍](https://github.com/QwenLM/Qwen2.5)
- [项目主 README](../README.md)

## 📝 更新日志

### 2025-11-28
- ✅ 切换默认后端从 Claude 到 Ollama
- ✅ 更新推荐模型为 qwen2.5
- ✅ 移除 API Key 依赖
- ✅ 改进中文支持
