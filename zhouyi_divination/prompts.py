"""
提示工程模板
应用Chapter 2学到的零样本、少样本和思维链技术
"""

# 零样本提示模板
ZERO_SHOT_PROMPT = """你是一位精通《周易》的占卜大师。请根据以下信息进行解卦：

问题：{question}
卦象：{hexagram_name} ({hexagram_desc})
卦辞：{gua_ci}
象辞：{xiang_ci}
{yao_info}

请给出专业的解读和建议。
"""

# 少样本提示模板（包含示例）
FEW_SHOT_PROMPT = """你是一位精通《周易》的占卜大师。以下是一些解卦示例：

【示例1】
问题：我最近的事业发展如何？
卦象：乾为天
解读：乾卦六爻皆阳，象征天道刚健，事业正处于上升期。卦辞"元亨利贞"表示大吉大利。但需注意"亢龙有悔"，凡事不可过于刚猛，应当把握分寸。建议：积极进取，但要保持谦逊，避免锋芒太露。

【示例2】
问题：这次投资是否可行？
卦象：坤为地
解读：坤卦象征大地，以柔顺为德。卦辞提示"利牝马之贞"，宜采取稳健策略。此时不宜冒进，应当顺势而为，厚积薄发。建议：谨慎行事，多听取他人意见，稳扎稳打为上策。

---

现在请解读以下卦象：

问题：{question}
卦象：{hexagram_name} ({hexagram_desc})
卦辞：{gua_ci}
象辞：{xiang_ci}
{yao_info}

请参考上述示例的风格，给出专业的解读和建议。
"""

# 思维链提示模板（Chain of Thought）
COT_PROMPT = """你是一位精通《周易》的占卜大师。请按照以下步骤逐步分析卦象：

问题：{question}
卦象：{hexagram_name} ({hexagram_desc})
卦辞：{gua_ci}
象辞：{xiang_ci}
{yao_info}

请按以下思路逐步分析：

第一步：分析卦象结构
- 上卦和下卦分别是什么？
- 它们的组合有什么象征意义？

第二步：解读卦辞含义
- 卦辞的核心要义是什么？
- 对当前问题有何启示？

第三步：分析象辞指引
- 象辞给出了什么行为准则？
- 如何应用到实际情况中？

第四步：考察动爻（如有）
- 哪些爻位发生变化？
- 爻辞有何特殊含义？

第五步：结合问题情境
- 将卦象分析与具体问题结合
- 给出切实可行的建议

请逐步思考并给出完整的解读。
"""

# 程序思维链模板（Program of Thought）
POT_PROMPT = """你是一位精通《周易》的占卜大师。请用结构化的方式分析卦象：

问题：{question}
卦象：{hexagram_name} ({hexagram_desc})
卦辞：{gua_ci}
象辞：{xiang_ci}
{yao_info}

请按以下结构化格式分析：

```
# 卦象分析
def analyze_hexagram():
    # 1. 识别卦象组成
    upper_trigram = "{upper}"
    lower_trigram = "{lower}"
    combination_meaning = "分析上下卦组合的意义"
    
    # 2. 解读卦辞
    gua_ci_core = "提取卦辞核心要义"
    relevance_to_question = "与问题的关联性"
    
    # 3. 应用象辞
    xiang_ci_guidance = "象辞给出的行为准则"
    practical_application = "如何应用到实际"
    
    # 4. 分析动爻（如有）
    changing_yao = {changing_yao}
    yao_meaning = "爻辞的特殊含义"
    
    # 5. 综合判断
    overall_assessment = "整体吉凶判断"
    specific_advice = "具体建议"
    
    return overall_assessment, specific_advice
```

请填充上述结构并给出最终解读。
"""

# 简洁版提示（用于快速解卦）
SIMPLE_PROMPT = """根据周易卦象解读：

问题：{question}
卦象：{hexagram_name}
卦辞：{gua_ci}

请简要解读此卦象对问题的启示。
"""


def format_yao_info(yao_list, changing_yao=None):
    """格式化爻辞信息"""
    yao_text = "爻辞：\n"
    for i, yao in enumerate(yao_list):
        marker = " ← 动爻" if changing_yao and i in changing_yao else ""
        yao_text += f"  {yao}{marker}\n"
    return yao_text


def get_prompt(prompt_type, question, hexagram_info, changing_yao=None):
    """
    获取格式化的提示
    
    Args:
        prompt_type: 提示类型 ('zero_shot', 'few_shot', 'cot', 'pot', 'simple')
        question: 用户问题
        hexagram_info: 卦象信息字典
        changing_yao: 动爻位置列表 (0-5)
    """
    yao_info = format_yao_info(hexagram_info.get("yao_ci", []), changing_yao)
    
    template_map = {
        "zero_shot": ZERO_SHOT_PROMPT,
        "few_shot": FEW_SHOT_PROMPT,
        "cot": COT_PROMPT,
        "pot": POT_PROMPT,
        "simple": SIMPLE_PROMPT
    }
    
    template = template_map.get(prompt_type, ZERO_SHOT_PROMPT)
    
    # 准备格式化参数
    format_args = {
        "question": question,
        "hexagram_name": hexagram_info.get("name", ""),
        "hexagram_desc": hexagram_info.get("description", ""),
        "gua_ci": hexagram_info.get("gua_ci", ""),
        "xiang_ci": hexagram_info.get("xiang_ci", ""),
        "yao_info": yao_info,
        "upper": "上卦",
        "lower": "下卦",
        "changing_yao": changing_yao if changing_yao else []
    }
    
    return template.format(**format_args)
