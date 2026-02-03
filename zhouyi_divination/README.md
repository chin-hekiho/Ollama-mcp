# 周易算命系统

基于《动手学大模型》教程核心技术构建的周易占卜系统

## 项目简介

本项目应用了dive-into-llms教程中学到的核心技术：
- **提示学习** (Chapter 2): 零样本、少样本、思维链推理
- **知识库管理**: 整合周易64卦传统文献
- **模块化设计**: 清晰的代码结构，易于扩展

## 功能特色

### 1. 多种起卦方式
- **随机起卦**: 模拟传统蓍草法
- **时间起卦**: 基于年月日时计算
- **手动输入**: 支持自定义卦象

### 2. 智能解读
- **传统解读**: 基于卦辞、爻辞的经典解释
- **思维链分析**: 逐步推理的解卦过程
- **LLM增强**: 可接入大语言模型API

### 3. 知识库
- 64卦完整信息
- 卦辞、爻辞、象辞、彖辞
- 动爻识别和解读

## 文件结构

```
zhouyi_divination/
├── knowledge_base.py    # 周易知识库
├── prompts.py          # 提示工程模板
├── zhouyi_system.py    # 核心系统
└── README.md           # 说明文档
```

## 快速开始

### 运行示例

```bash
cd /home/chinhekiho/mhd/dev/dive-into-llms/zhouyi_divination
python zhouyi_system.py
```

### 基本使用

```python
from zhouyi_system import ZhouyiDivination

# 创建占卜实例
divination = ZhouyiDivination()

# 起卦
question = "我的事业发展如何？"
hexagram = divination.cast_hexagram(method="random")

# 显示卦象
print(divination.display_hexagram())

# 解卦
result = divination.interpret(question, prompt_type="cot")
print(result['interpretation'])
```

## 提示类型说明

### 1. zero_shot (零样本)
直接让模型根据卦象信息进行解读，无需示例。

### 2. few_shot (少样本)
提供经典解卦案例作为参考，提高解读质量。

### 3. cot (思维链)
引导模型逐步分析：
1. 分析卦象结构
2. 解读卦辞含义
3. 分析象辞指引
4. 考察动爻
5. 结合问题情境

### 4. pot (程序思维链)
用结构化代码的方式组织解卦思路。

### 5. simple (简洁版)
快速解读，适合简单问题。

## 接入LLM API

### 通义千问示例

```python
import dashscope

def call_qwen(prompt):
    response = dashscope.Generation.call(
        model='qwen-turbo',
        prompt=prompt,
        api_key='your-api-key'
    )
    return response.output.text

# 在zhouyi_system.py中修改_call_llm方法
divination = ZhouyiDivination()
result = divination.interpret(question, use_llm=True)
```

### 其他模型
- 智谱AI (GLM)
- OpenAI (GPT)
- 文心一言

参考 `dive-into-llms/documents/chapter2/README.md` 中的API调用示例。

## 应用技术

### Chapter 2: 提示学习与思维链
- ✅ 零样本提示
- ✅ 少样本提示（包含经典案例）
- ✅ 思维链推理（逐步分析）
- ✅ 程序思维链（结构化）

### Chapter 1: 模型部署
- ✅ 模块化代码设计
- ✅ 清晰的接口定义
- 🔄 Gradio界面（可选）

## 示例输出

```
==================================================
              周易算命系统
==================================================

【示例1：随机起卦】
问题：我的事业发展如何？

╔═══════════════════════╗
║   乾卦 ☰   ║
║   乾为天   ║
╠═══════════════════════╣
║ 上爻: ━━━ (阳爻)      ║
║ 五爻: ━━━ (阳爻)      ║
║ 四爻: ━━━ (阳爻)      ║
║ 三爻: ━━━ (阳爻)      ║
║ 二爻: ━━━ (阳爻) ← 动 ║
║ 初爻: ━━━ (阳爻)      ║
╚═══════════════════════╝

【卦象】乾 - 乾为天

【卦辞】乾：元，亨，利，贞。

【象辞】天行健，君子以自强不息。

【解读】
此卦象征吉祥，事情发展顺利，但仍需谨慎行事，把握时机。

【爻辞参考】
初九：潜龙勿用。
九二：见龙在田，利见大人。 ← 动爻
九三：君子终日乾乾，夕惕若厉，无咎。
九四：或跃在渊，无咎。
九五：飞龙在天，利见大人。
上九：亢龙有悔。

【动爻提示】
第2爻发动，需特别关注此爻的含义。
```

## 扩展建议

1. **完善知识库**: 添加完整的64卦信息
2. **接入LLM**: 配置API实现智能解读
3. **添加界面**: 使用Gradio构建Web界面
4. **历史记录**: 保存占卜历史
5. **多语言**: 支持英文等其他语言

## 注意事项

> ⚠️ **免责声明**
> 
> 本系统仅供娱乐和传统文化学习使用，不应作为重大决策的唯一依据。
> 占卜结果仅供参考，实际决策应结合理性分析。

## 技术参考

- 《动手学大模型》教程: [dive-into-llms](https://github.com/Lordog/dive-into-llms)
- Chapter 2: 提示学习与思维链
- Chapter 1: 微调与部署

## 许可证

本项目基于教育目的开发，遵循原教程的开源精神。
