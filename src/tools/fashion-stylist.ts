import { Tool } from '@modelcontextprotocol/sdk/types.js';
import {
    getOutfitSuggestions,
    getColorCombinations,
    getAccessoryMatches,
    getStyleAnalysis,
} from '../data/fashion-data.js';

// Fashion Stylist tool definitions
export const fashionTools: Tool[] = [
    {
        name: 'fashion_outfit_suggestions',
        description: 'Get outfit suggestions based on style and occasion',
        inputSchema: {
            type: 'object',
            properties: {
                style: {
                    type: 'string',
                    description: 'Style preference (e.g., 休闲, 商务, 甜美, 酷炫, 复古)',
                },
                occasion: {
                    type: 'string',
                    description: 'Occasion (e.g., 日常, 工作, 约会, 聚会)',
                },
            },
            required: ['style', 'occasion'],
        },
    },
    {
        name: 'fashion_color_combinations',
        description: 'Get color combination suggestions for a base color',
        inputSchema: {
            type: 'object',
            properties: {
                base_color: {
                    type: 'string',
                    description: 'Base color (e.g., 黑色, 白色, 红色, 蓝色)',
                },
                style_preference: {
                    type: 'string',
                    description: 'Style preference for color palette (default: 经典)',
                },
            },
            required: ['base_color'],
        },
    },
    {
        name: 'fashion_accessory_matches',
        description: 'Get accessory (bags/shoes) matching suggestions',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['bags', 'shoes'],
                    description: "Type of accessory: 'bags' or 'shoes'",
                },
                style: {
                    type: 'string',
                    description: 'Outfit style to match',
                },
                color_preference: {
                    type: 'string',
                    description: 'Color preference',
                },
            },
            required: ['type', 'style', 'color_preference'],
        },
    },
    {
        name: 'fashion_style_analysis',
        description: 'Get analysis and advice for a specific style',
        inputSchema: {
            type: 'object',
            properties: {
                style: {
                    type: 'string',
                    description: 'Style to analyze (e.g., casual, business, sweet)',
                },
            },
            required: ['style'],
        },
    },
];

// Fashion tool handlers
export async function handleFashionTool(name: string, args: any) {
    switch (name) {
        case 'fashion_outfit_suggestions': {
            const { style, occasion } = args;
            const suggestions = getOutfitSuggestions(style, occasion);
            return {
                content: [{ type: 'text', text: JSON.stringify(suggestions, null, 2) }],
            };
        }

        case 'fashion_color_combinations': {
            const { base_color, style_preference } = args;
            const combinations = getColorCombinations(base_color, style_preference);
            return {
                content: [{ type: 'text', text: JSON.stringify(combinations, null, 2) }],
            };
        }

        case 'fashion_accessory_matches': {
            const { type, style, color_preference } = args;
            const matches = getAccessoryMatches(type, style, color_preference);
            return {
                content: [{ type: 'text', text: JSON.stringify(matches, null, 2) }],
            };
        }

        case 'fashion_style_analysis': {
            const { style } = args;
            const analysis = getStyleAnalysis(style);
            return {
                content: [{ type: 'text', text: analysis }],
            };
        }

        default:
            throw new Error(`Unknown fashion tool: ${name}`);
    }
}
