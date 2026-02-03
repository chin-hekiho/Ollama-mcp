import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Zhouyi Divination tool definitions
export const zhouyiTools: Tool[] = [
    {
        name: 'zhouyi_cast_hexagram',
        description: '起卦并解读。根据问题进行周易占卜，生成卦象并提供详细解读。支持多种起卦方式（随机、时间、手动）。',
        inputSchema: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: '占卜的问题，例如：我的事业发展如何？这次投资是否可行？',
                },
                method: {
                    type: 'string',
                    description: '起卦方式',
                    enum: ['random', 'time', 'manual'],
                    default: 'random',
                },
                prompt_type: {
                    type: 'string',
                    description: '解读方式：zero_shot(零样本)、few_shot(少样本)、cot(思维链)、simple(简洁)',
                    enum: ['zero_shot', 'few_shot', 'cot', 'simple'],
                    default: 'cot',
                },
            },
            required: ['question'],
        },
    },
    {
        name: 'zhouyi_interpret',
        description: '解读已有的卦象。对特定的卦象进行深入分析和解读，结合用户的问题给出建议。',
        inputSchema: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: '要解读的问题',
                },
                hexagram_name: {
                    type: 'string',
                    description: '卦象名称，例如：乾、坤、屯、蒙等64卦之一',
                },
                prompt_type: {
                    type: 'string',
                    description: '解读方式',
                    enum: ['zero_shot', 'few_shot', 'cot', 'pot', 'simple'],
                    default: 'cot',
                },
            },
            required: ['question', 'hexagram_name'],
        },
    },
    {
        name: 'zhouyi_explain_hexagram',
        description: '详细解释某个卦象的含义、卦辞、象辞、爻辞等传统文献内容，以及其在不同情况下的应用。',
        inputSchema: {
            type: 'object',
            properties: {
                hexagram_name: {
                    type: 'string',
                    description: '要解释的卦象名称，例如：乾、坤、屯等',
                },
            },
            required: ['hexagram_name'],
        },
    },
    {
        name: 'zhouyi_qa',
        description: '回答关于周易的问题，包括周易理论、卦象知识、占卜方法、历史背景等各方面的问题。',
        inputSchema: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: '关于周易的问题',
                },
            },
            required: ['question'],
        },
    },
];

// Helper function to get hexagram context
function getHexagramContext(hexagramName: string): string {
    // Import knowledge base data (simplified version for TypeScript)
    const hexagramExamples: Record<string, any> = {
        '乾': {
            description: '乾为天',
            gua_ci: '乾：元，亨，利，贞。',
            xiang_ci: '天行健，君子以自强不息。',
            meaning: '象征天道刚健，事业正处于上升期',
        },
        '坤': {
            description: '坤为地',
            gua_ci: '坤：元，亨，利牝马之贞。',
            xiang_ci: '地势坤，君子以厚德载物。',
            meaning: '象征大地，以柔顺为德，宜采取稳健策略',
        },
    };

    const hexagram = hexagramExamples[hexagramName];
    if (hexagram) {
        return `【卦象信息】
卦名：${hexagramName} - ${hexagram.description}
卦辞：${hexagram.gua_ci}
象辞：${hexagram.xiang_ci}
基本含义：${hexagram.meaning}`;
    }

    return `【卦象】${hexagramName}`;
}

// Zhouyi tool handlers
export async function handleZhouyiTool(name: string, args: any) {
    switch (name) {
        case 'zhouyi_cast_hexagram': {
            const { question, method = 'random', prompt_type = 'cot' } = args;

            return {
                content: [
                    {
                        type: 'text',
                        text: `【周易占卜任务】

你是一位精通《周易》的占卜大师。请为用户进行占卜解读。

问题：${question}
起卦方式：${method}
解读方式：${prompt_type}

请按照以下步骤进行：

1. **起卦说明**：
   - 使用${method}方式起卦
   - 生成六爻卦象（从下到上：初爻、二爻、三爻、四爻、五爻、上爻）
   - 标注动爻（如有）

2. **卦象展示**：
   - 显示卦象图形（使用 ━━━ 表示阳爻，━ ━ 表示阴爻）
   - 说明卦名和基本含义

3. **详细解读**：
${prompt_type === 'cot' ? `   按思维链方式逐步分析：
   - 分析卦象结构（上卦、下卦）
   - 解读卦辞含义
   - 分析象辞指引
   - 考察动爻（如有）
   - 结合问题给出建议` :
                                prompt_type === 'few_shot' ? `   参考经典案例进行解读：
   - 引用相似卦象的历史案例
   - 结合传统解读方法
   - 给出具体建议` :
                                    `   简要解读卦象对问题的启示`}

4. **行动建议**：
   - 给出具体的行动建议
   - 提示注意事项

请开始占卜解读：`,
                    },
                ],
            };
        }

        case 'zhouyi_interpret': {
            const { question, hexagram_name, prompt_type = 'cot' } = args;
            const context = getHexagramContext(hexagram_name);

            return {
                content: [
                    {
                        type: 'text',
                        text: `【卦象解读任务】

你是一位精通《周易》的占卜大师。请解读以下卦象：

${context}

用户问题：${question}

请按照${prompt_type}方式进行详细解读：

1. **卦象分析**：
   - 解释卦象的基本含义
   - 分析上下卦的组合意义

2. **卦辞解读**：
   - 详细解释卦辞的含义
   - 说明其对当前问题的启示

3. **象辞应用**：
   - 解释象辞给出的行为准则
   - 如何应用到实际情况

4. **综合建议**：
   - 结合问题给出具体建议
   - 提示吉凶和注意事项

请开始解读：`,
                    },
                ],
            };
        }

        case 'zhouyi_explain_hexagram': {
            const { hexagram_name } = args;
            const context = getHexagramContext(hexagram_name);

            return {
                content: [
                    {
                        type: 'text',
                        text: `【卦象详解任务】

你是一位周易专家。请详细解释以下卦象：

${context}

请从以下方面进行全面解释：

1. **卦象基本信息**：
   - 卦象的组成（上卦、下卦）
   - 卦象的符号和象征意义
   - 在64卦中的位置和重要性

2. **卦辞深度解析**：
   - 逐字解释卦辞
   - 卦辞的深层含义和哲学思想
   - 历代易学家的不同解读

3. **象辞的人生智慧**：
   - 象辞给出的行为准则
   - 如何在现代生活中应用
   - 相关的人生哲理

4. **爻辞解读**（如果知道）：
   - 六个爻位的含义
   - 不同爻位的吉凶判断
   - 动爻的特殊意义

5. **实际应用**：
   - 在事业、感情、健康等方面的应用
   - 历史上的经典案例
   - 现代解读和应用建议

请用通俗易懂但专业的语言进行详细解释：`,
                    },
                ],
            };
        }

        case 'zhouyi_qa': {
            const { question } = args;

            return {
                content: [
                    {
                        type: 'text',
                        text: `【周易问答任务】

你是一位精通《周易》的专家。请回答以下问题：

问题：${question}

请提供专业、详细的回答，包括：

1. **直接回答**：
   - 清晰回答用户的问题
   - 给出准确的信息

2. **背景知识**：
   - 相关的周易理论背景
   - 历史渊源和发展
   - 重要概念解释

3. **深入分析**：
   - 从不同角度分析问题
   - 引用经典文献（如适用）
   - 举例说明

4. **实际应用**（如适用）：
   - 如何在实际生活中应用
   - 现代意义和价值
   - 具体建议

请用通俗易懂的语言，结合专业知识进行回答：`,
                    },
                ],
            };
        }

        default:
            throw new Error(`Unknown zhouyi tool: ${name}`);
    }
}
