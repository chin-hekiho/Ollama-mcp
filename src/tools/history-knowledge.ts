import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Historical Knowledge tool definitions
export const historyTools: Tool[] = [
    {
        name: 'history_person_query',
        description: '查询中国历史人物的详细信息,包括生平、主要成就、历史影响等。',
        inputSchema: {
            type: 'object',
            properties: {
                person_name: {
                    type: 'string',
                    description: '历史人物姓名,例如:李白、诸葛亮、武则天等',
                },
            },
            required: ['person_name'],
        },
    },
    {
        name: 'history_event_query',
        description: '查询中国历史事件的详细信息,包括事件背景、经过、影响等。',
        inputSchema: {
            type: 'object',
            properties: {
                event_name: {
                    type: 'string',
                    description: '历史事件名称或时间范围,例如:赤壁之战、安史之乱、戊戌变法等',
                },
            },
            required: ['event_name'],
        },
    },
    {
        name: 'history_dynasty_query',
        description: '查询中国历史朝代的详细信息,包括朝代时间、重要事件、文化特点等。',
        inputSchema: {
            type: 'object',
            properties: {
                dynasty_name: {
                    type: 'string',
                    description: '朝代名称,例如:唐朝、宋朝、明朝、清朝等',
                },
            },
            required: ['dynasty_name'],
        },
    },
    {
        name: 'history_culture_query',
        description: '查询中国历史文化知识,包括制度、科技、艺术、风俗等方面的历史背景和发展。',
        inputSchema: {
            type: 'object',
            properties: {
                culture_topic: {
                    type: 'string',
                    description: '文化主题,例如:科举制度、丝绸之路、四大发明、书法艺术等',
                },
            },
            required: ['culture_topic'],
        },
    },
];

// History tool handlers
export async function handleHistoryTool(name: string, args: any) {
    switch (name) {
        case 'history_person_query': {
            const { person_name } = args;
            return {
                content: [
                    {
                        type: 'text',
                        text: `【历史人物查询任务】
请详细介绍中国历史人物"${person_name}"的相关信息,包括:

1. **基本信息**:生卒年代、籍贯、字号等
2. **生平经历**:主要人生阶段和重要经历
3. **主要成就**:在政治、军事、文化等方面的贡献
4. **历史影响**:对当时和后世的影响
5. **相关典故**:与该人物相关的著名故事或典故

请用专业但通俗易懂的语言进行介绍,内容要准确、全面。`,
                    },
                ],
            };
        }

        case 'history_event_query': {
            const { event_name } = args;
            return {
                content: [
                    {
                        type: 'text',
                        text: `【历史事件查询任务】
请详细介绍中国历史事件"${event_name}"的相关信息,包括:

1. **事件背景**:发生的历史背景和原因
2. **时间地点**:具体发生的时间和地点
3. **主要人物**:参与的重要人物及其角色
4. **事件经过**:事件的发展过程和关键节点
5. **历史影响**:对当时和后世的影响
6. **历史评价**:后人对该事件的评价和认识

请用专业但通俗易懂的语言进行介绍,内容要准确、全面。`,
                    },
                ],
            };
        }

        case 'history_dynasty_query': {
            const { dynasty_name } = args;
            return {
                content: [
                    {
                        type: 'text',
                        text: `【历史朝代查询任务】
请详细介绍中国历史朝代"${dynasty_name}"的相关信息,包括:

1. **基本信息**:朝代起止时间、都城、开国皇帝等
2. **政治制度**:主要的政治制度和行政体系
3. **重要事件**:该朝代的重要历史事件
4. **经济发展**:经济状况和主要经济政策
5. **文化成就**:文学、艺术、科技等方面的成就
6. **社会风貌**:社会结构、民风民俗等
7. **历史地位**:在中国历史上的地位和影响

请用专业但通俗易懂的语言进行介绍,内容要准确、全面。`,
                    },
                ],
            };
        }

        case 'history_culture_query': {
            const { culture_topic } = args;
            return {
                content: [
                    {
                        type: 'text',
                        text: `【历史文化查询任务】
请详细介绍中国历史文化"${culture_topic}"的相关知识,包括:

1. **基本概念**:该文化现象或制度的基本定义和特点
2. **历史起源**:起源时间、背景和原因
3. **发展历程**:在不同历史时期的发展和演变
4. **主要内容**:核心内容、特征和表现形式
5. **历史作用**:在历史上发挥的作用和影响
6. **文化意义**:对中国文化和社会的深远意义
7. **相关典故**:与之相关的著名故事或事例

请用专业但通俗易懂的语言进行介绍,内容要准确、全面。`,
                    },
                ],
            };
        }

        default:
            throw new Error(`Unknown history tool: ${name}`);
    }
}

