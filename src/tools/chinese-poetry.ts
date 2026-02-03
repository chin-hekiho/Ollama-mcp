import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Chinese Poetry tool definitions
export const poetryTools: Tool[] = [
    {
        name: 'poetry_generate',
        description: '根据主题、风格和长度生成中国古典诗词。可以生成唐诗、宋词、元曲等不同风格的诗词。',
        inputSchema: {
            type: 'object',
            properties: {
                theme: {
                    type: 'string',
                    description: '诗词主题,例如:春天、思乡、爱情、山水等',
                },
                style: {
                    type: 'string',
                    description: '诗词风格',
                    enum: ['唐诗', '宋词', '元曲', '自由发挥'],
                },
                length: {
                    type: 'number',
                    description: '诗词长度(句数)',
                    minimum: 4,
                    maximum: 20,
                },
            },
            required: ['theme'],
        },
    },
    {
        name: 'poetry_explain',
        description: '详细解释一首中国古典诗词的含义、背景、艺术手法和文化内涵。',
        inputSchema: {
            type: 'object',
            properties: {
                poetry_text: {
                    type: 'string',
                    description: '要解释的诗词内容(完整文本)',
                },
            },
            required: ['poetry_text'],
        },
    },
    {
        name: 'poetry_continue',
        description: '根据给定的诗句接续下一句,保持韵律和意境的连贯性。',
        inputSchema: {
            type: 'object',
            properties: {
                first_line: {
                    type: 'string',
                    description: '诗词的上一句',
                },
            },
            required: ['first_line'],
        },
    },
    {
        name: 'poetry_qa',
        description: '回答关于中国古典诗词的问题,包括诗人生平、诗词流派、创作背景、格律知识等。',
        inputSchema: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: '关于古诗词的问题',
                },
            },
            required: ['question'],
        },
    },
];

// Helper function to get poetry context
function getPoetryContext(theme?: string): string {
    const contexts: Record<string, any> = {
        春天: {
            examples: [
                { title: '春晓', author: '孟浩然', content: '春眠不觉晓,处处闻啼鸟。\n夜来风雨声,花落知多少。' },
                { title: '咏柳', author: '贺知章', content: '碧玉妆成一树高,万条垂下绿丝绦。\n不知细叶谁裁出,二月春风似剪刀。' },
            ],
            keywords: ['春光', '花开', '鸟鸣', '新绿', '生机'],
            rules: '五言绝句或七言绝句,注意平仄和押韵',
        },
        思乡: {
            examples: [
                { title: '静夜思', author: '李白', content: '床前明月光,疑是地上霜。\n举头望明月,低头思故乡。' },
                { title: '九月九日忆山东兄弟', author: '王维', content: '独在异乡为异客,每逢佳节倍思亲。\n遥知兄弟登高处,遍插茱萸少一人。' },
            ],
            keywords: ['明月', '故乡', '亲人', '孤独', '思念'],
            rules: '情感真挚,意境深远',
        },
    };

    if (theme && contexts[theme]) {
        const ctx = contexts[theme];
        return `【参考示例】\n${ctx.examples.map((e: any) => `《${e.title}》- ${e.author}\n${e.content}`).join('\n\n')}\n\n【关键词】${ctx.keywords.join('、')}\n【创作要求】${ctx.rules}`;
    }

    return '【通用要求】\n1. 符合古典诗词格律\n2. 意境优美,用词典雅\n3. 注意平仄和押韵\n4. 表达真挚情感';
}

// Poetry tool handlers
export async function handlePoetryTool(name: string, args: any) {
    switch (name) {
        case 'poetry_generate': {
            const { theme, style = '唐诗', length = 8 } = args;
            const context = getPoetryContext(theme);
            return {
                content: [
                    {
                        type: 'text',
                        text: `【诗词生成任务】
主题:${theme}
风格:${style}
长度:${length}句

${context}

请你作为一位精通中国古典诗词的诗人,根据以上要求创作一首诗。要求:
1. 严格符合${style}的格律和韵律
2. 意境优美,富有诗意
3. 用词典雅,符合古典诗词风格
4. 直接输出诗词内容,可以加上标题`,
                    },
                ],
            };
        }

        case 'poetry_explain': {
            const { poetry_text } = args;
            return {
                content: [
                    {
                        type: 'text',
                        text: `【诗词解释任务】
请详细解释以下诗词:

${poetry_text}

请从以下几个方面进行解释:
1. **字面意思**:逐句解释诗词的表面含义
2. **情感意境**:分析诗人想要表达的情感和营造的意境
3. **艺术手法**:讲解使用的修辞手法、意象、对仗等艺术特色
4. **文化背景**:介绍相关的历史背景或文化典故(如果有的话)

请用通俗易懂但不失专业的语言进行解释。`,
                    },
                ],
            };
        }

        case 'poetry_continue': {
            const { first_line } = args;
            return {
                content: [
                    {
                        type: 'text',
                        text: `【诗词接龙任务】
上句:${first_line}

请为这句诗接续下一句,要求:
1. 保持韵律和格律的连贯性
2. 意境自然衔接
3. 符合古典诗词的对仗和平仄规则
4. 只输出下一句诗

请思考上句的韵脚、意境和格律,然后创作出恰当的下句。`,
                    },
                ],
            };
        }

        case 'poetry_qa': {
            const { question } = args;
            return {
                content: [
                    {
                        type: 'text',
                        text: `【古诗词问答任务】
问题:${question}

请作为一位古诗词专家,提供专业、详细且易懂的回答。如果涉及具体诗词,请举例说明。`,
                    },
                ],
            };
        }

        default:
            throw new Error(`Unknown poetry tool: ${name}`);
    }
}
