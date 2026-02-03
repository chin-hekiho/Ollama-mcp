# 周易占卜 MCP 工具使用指南

## 概述

周易占卜工具已集成到统一的 MCP 服务器中，可以在 Claude Desktop 中直接使用。

## 可用工具

### 1. zhouyi_cast_hexagram - 起卦并解读

根据问题进行周易占卜，生成卦象并提供详细解读。

**参数：**
- `question` (必需): 占卜的问题
- `method` (可选): 起卦方式
  - `random`: 随机起卦（默认）
  - `time`: 时间起卦
  - `manual`: 手动输入
- `prompt_type` (可选): 解读方式
  - `cot`: 思维链推理（默认）
  - `zero_shot`: 零样本
  - `few_shot`: 少样本
  - `simple`: 简洁版

**示例：**
```
请使用 zhouyi_cast_hexagram 工具，问题是"我的事业发展如何？"
```

### 2. zhouyi_interpret - 解读卦象

对特定的卦象进行深入分析和解读。

**参数：**
- `question` (必需): 要解读的问题
- `hexagram_name` (必需): 卦象名称（如：乾、坤、屯等）
- `prompt_type` (可选): 解读方式（同上）

**示例：**
```
请使用 zhouyi_interpret 工具解读"乾"卦，我的问题是"这次投资是否可行？"
```

### 3. zhouyi_explain_hexagram - 详解卦象

详细解释某个卦象的含义、卦辞、象辞等传统文献内容。

**参数：**
- `hexagram_name` (必需): 要解释的卦象名称

**示例：**
```
请使用 zhouyi_explain_hexagram 工具详细解释"坤"卦
```

### 4. zhouyi_qa - 周易问答

回答关于周易的各种问题。

**参数：**
- `question` (必需): 关于周易的问题

**示例：**
```
请使用 zhouyi_qa 工具回答"什么是动爻？动爻在占卜中有什么意义？"
```

## 使用场景

### 场景1：日常占卜
```
我想问一下最近的感情运势如何，请帮我占卜一下。
```

Claude 会自动调用 `zhouyi_cast_hexagram` 工具，生成卦象并给出解读。

### 场景2：学习周易
```
我想了解"既济"卦的含义，请详细解释一下。
```

Claude 会调用 `zhouyi_explain_hexagram` 工具，提供详细的卦象解释。

### 场景3：深入解读
```
我得到了"屯"卦，我的问题是关于新项目的启动，请帮我详细解读。
```

Claude 会调用 `zhouyi_interpret` 工具，结合具体问题进行深入分析。

## 工作原理

1. **工具调用**: Claude Desktop 识别用户意图，调用相应的 zhouyi 工具
2. **提示生成**: MCP 服务器返回结构化的提示词给 Claude
3. **AI 解读**: Claude 基于提示词和其知识库进行解读
4. **结果呈现**: 用户获得详细的占卜结果和建议

## 技术特点

- **无需 API Key**: 使用 Ollama 本地模型（qwen2.5）
- **提示工程**: 应用零样本、少样本、思维链等技术
- **传统知识**: 整合周易64卦传统文献
- **灵活解读**: 支持多种起卦和解读方式

## 注意事项

> ⚠️ **免责声明**
> 
> 周易占卜仅供娱乐和传统文化学习使用，不应作为重大决策的唯一依据。
> 占卜结果仅供参考，实际决策应结合理性分析。

## 相关文件

- 配置文件: `zhouyi_divination/config.py`
- 后端实现: `zhouyi_divination/ollama_backend.py`
- 核心系统: `zhouyi_divination/zhouyi_system.py`
- 知识库: `zhouyi_divination/knowledge_base.py`
- 提示模板: `zhouyi_divination/prompts.py`
