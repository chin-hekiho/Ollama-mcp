export interface Outfit {
    name: string;
    style: string;
    clothing: string[];
    colors: string[];
    bags: string[];
    shoes: string[];
    occasions: string[];
}

export const FASHION_DATABASE: { outfits: Outfit[] } = {
    outfits: [
        {
            name: "经典商务套装",
            style: "商务",
            clothing: ["白色衬衫", "黑色西装外套", "黑色西装裤"],
            colors: ["白色", "黑色"],
            bags: ["黑色手提包", "棕色单肩包"],
            shoes: ["黑色高跟鞋", "棕色乐福鞋"],
            occasions: ["工作", "正式场合", "商务会议"]
        },
        {
            name: "甜美约会装",
            style: "甜美",
            clothing: ["粉色连衣裙", "白色针织开衫"],
            colors: ["粉色", "白色"],
            bags: ["白色小包", "粉色斜挎包"],
            shoes: ["白色平底鞋", "粉色高跟鞋"],
            occasions: ["约会", "聚会", "日常"]
        },
        {
            name: "休闲日常装",
            style: "休闲",
            clothing: ["白色T恤", "蓝色牛仔裤", "灰色卫衣"],
            colors: ["白色", "蓝色", "灰色"],
            bags: ["帆布包", "双肩包"],
            shoes: ["白色运动鞋", "帆布鞋"],
            occasions: ["日常", "休闲", "购物"]
        },
        {
            name: "酷炫街头装",
            style: "酷炫",
            clothing: ["黑色皮夹克", "白色T恤", "黑色紧身裤"],
            colors: ["黑色", "白色"],
            bags: ["黑色斜挎包", "链条包"],
            shoes: ["黑色靴子", "白色运动鞋"],
            occasions: ["聚会", "街头", "休闲"]
        },
        {
            name: "复古文艺装",
            style: "复古",
            clothing: ["碎花连衣裙", "棕色针织开衫"],
            colors: ["碎花", "棕色"],
            bags: ["棕色复古包", "编织包"],
            shoes: ["棕色平底鞋", "玛丽珍鞋"],
            occasions: ["约会", "日常", "文艺活动"]
        }
    ]
};

export const COLOR_PALETTES: Record<string, Record<string, string[]>> = {
    "经典": {
        "黑色": ["白色", "灰色", "米色"],
        "白色": ["黑色", "灰色", "蓝色"],
        "红色": ["黑色", "白色", "灰色"],
        "蓝色": ["白色", "灰色", "黑色"],
        "绿色": ["白色", "棕色", "米色"],
        "黄色": ["白色", "黑色", "蓝色"],
        "紫色": ["白色", "黑色", "灰色"],
        "粉色": ["白色", "灰色", "黑色"],
        "棕色": ["白色", "米色", "黑色"],
        "灰色": ["白色", "黑色", "蓝色"]
    },
    "时尚": {
        "黑色": ["红色", "粉色", "紫色"],
        "白色": ["蓝色", "绿色", "黄色"],
        "红色": ["蓝色", "绿色", "黄色"],
        "蓝色": ["橙色", "黄色", "粉色"],
        "绿色": ["紫色", "粉色", "橙色"],
        "黄色": ["紫色", "蓝色", "绿色"],
        "紫色": ["黄色", "绿色", "橙色"],
        "粉色": ["绿色", "蓝色", "紫色"],
        "棕色": ["蓝色", "绿色", "粉色"],
        "灰色": ["黄色", "橙色", "粉色"]
    },
    "简约": {
        "黑色": ["白色", "灰色"],
        "白色": ["黑色", "灰色"],
        "红色": ["白色", "黑色"],
        "蓝色": ["白色", "灰色"],
        "绿色": ["白色", "灰色"],
        "黄色": ["白色", "黑色"],
        "紫色": ["白色", "灰色"],
        "粉色": ["白色", "灰色"],
        "棕色": ["白色", "米色"],
        "灰色": ["白色", "黑色"]
    }
};

export interface AccessoryItem {
    name: string;
    description: string;
    colors: string[];
    occasions: string[];
    price_range: string;
}

export const BAGS_DATABASE: Record<string, AccessoryItem[]> = {
    "手提包": [
        {
            name: "经典黑色手提包",
            description: "百搭实用的商务包",
            colors: ["黑色", "棕色", "深蓝色"],
            occasions: ["工作", "商务", "正式场合"],
            price_range: "中档"
        },
        {
            name: "白色简约手提包",
            description: "清新简约的日常包",
            colors: ["白色", "米色", "浅色"],
            occasions: ["日常", "休闲", "约会"],
            price_range: "中档"
        }
    ],
    "单肩包": [
        {
            name: "棕色单肩包",
            description: "经典百搭的单肩包",
            colors: ["棕色", "黑色", "深色"],
            occasions: ["日常", "工作", "约会"],
            price_range: "中档"
        },
        {
            name: "粉色斜挎包",
            description: "甜美可爱的斜挎包",
            colors: ["粉色", "白色", "浅色"],
            occasions: ["约会", "聚会", "日常"],
            price_range: "中档"
        }
    ],
    "双肩包": [
        {
            name: "帆布双肩包",
            description: "实用舒适的休闲包",
            colors: ["白色", "米色", "浅色"],
            occasions: ["日常", "休闲", "运动"],
            price_range: "经济型"
        }
    ]
};

export const SHOES_DATABASE: Record<string, AccessoryItem[]> = {
    "高跟鞋": [
        {
            name: "黑色经典高跟鞋",
            description: "百搭实用的商务鞋",
            colors: ["黑色", "棕色", "深色"],
            occasions: ["工作", "商务", "正式场合"],
            price_range: "中档"
        },
        {
            name: "粉色甜美高跟鞋",
            description: "甜美可爱的约会鞋",
            colors: ["粉色", "白色", "浅色"],
            occasions: ["约会", "聚会", "日常"],
            price_range: "中档"
        }
    ],
    "平底鞋": [
        {
            name: "白色平底鞋",
            description: "舒适百搭的日常鞋",
            colors: ["白色", "米色", "浅色"],
            occasions: ["日常", "休闲", "约会"],
            price_range: "中档"
        },
        {
            name: "棕色乐福鞋",
            description: "经典复古的商务鞋",
            colors: ["棕色", "黑色", "深色"],
            occasions: ["工作", "商务", "日常"],
            price_range: "中档"
        }
    ],
    "运动鞋": [
        {
            name: "白色运动鞋",
            description: "舒适实用的运动鞋",
            colors: ["白色", "黑色", "灰色"],
            occasions: ["日常", "运动", "休闲"],
            price_range: "中档"
        }
    ]
};

export const STYLE_GUIDES: Record<string, any> = {
    "休闲": {
        description: "舒适、轻松、实用的搭配风格",
        key_elements: ["宽松剪裁", "舒适面料", "实用包包", "平底鞋"],
        colors: ["中性色", "柔和色", "自然色"],
        occasions: ["日常", "购物", "休闲活动"]
    },
    "商务": {
        description: "专业、正式、得体的职场搭配风格",
        key_elements: ["合身剪裁", "优质面料", "手提包", "高跟鞋"],
        colors: ["中性色", "深色系", "经典色"],
        occasions: ["工作", "商务会议", "正式场合"]
    },
    "甜美": {
        description: "温柔、可爱、女性化的搭配风格",
        key_elements: ["柔和色彩", "女性化设计", "小包", "平底鞋"],
        colors: ["粉色系", "柔和色", "浅色"],
        occasions: ["约会", "聚会", "日常"]
    },
    "酷炫": {
        description: "个性、时尚、前卫的搭配风格",
        key_elements: ["个性设计", "亮色搭配", "时尚包包", "特色鞋子"],
        colors: ["亮色系", "对比色", "个性色"],
        occasions: ["聚会", "街头", "时尚活动"]
    },
    "复古": {
        description: "经典、优雅、怀旧的搭配风格",
        key_elements: ["经典设计", "复古元素", "复古包包", "经典鞋子"],
        colors: ["经典色", "复古色", "暖色系"],
        occasions: ["约会", "文艺活动", "日常"]
    }
};

export const SEASONAL_TRENDS: Record<string, any> = {
    "春季": {
        colors: ["粉色", "浅蓝色", "嫩绿色", "米色"],
        styles: ["甜美", "清新", "简约"],
        key_items: ["针织开衫", "碎花裙", "浅色包包", "平底鞋"]
    },
    "夏季": {
        colors: ["白色", "蓝色", "黄色", "绿色"],
        styles: ["清新", "休闲", "甜美"],
        key_items: ["连衣裙", "T恤", "帆布包", "凉鞋"]
    },
    "秋季": {
        colors: ["棕色", "橙色", "深红色", "灰色"],
        styles: ["复古", "商务", "简约"],
        key_items: ["针织衫", "外套", "手提包", "靴子"]
    },
    "冬季": {
        colors: ["黑色", "白色", "深蓝色", "灰色"],
        styles: ["经典", "商务", "酷炫"],
        key_items: ["大衣", "毛衣", "深色包包", "靴子"]
    }
};

// Helper Functions
export function getOutfitSuggestions(style: string, occasion: string): Outfit[] {
    return FASHION_DATABASE.outfits.filter(outfit =>
        outfit.style.includes(style) && outfit.occasions.includes(occasion)
    ).slice(0, 3);
}

export function getColorCombinations(baseColor: string, stylePreference: string = "经典"): { name: string, description: string }[] {
    const combinations: { name: string, description: string }[] = [];
    const palette = COLOR_PALETTES[stylePreference];
    if (palette && palette[baseColor]) {
        palette[baseColor].slice(0, 3).forEach((color, i) => {
            combinations.push({
                name: `配色方案 ${i + 1}`,
                description: `${baseColor} + ${color} 的经典搭配`
            });
        });
    }
    return combinations;
}

export function getAccessoryMatches(accessoryType: 'bags' | 'shoes', outfitStyle: string, colorPreference: string): AccessoryItem[] {
    const database = accessoryType === 'bags' ? BAGS_DATABASE : SHOES_DATABASE;
    const matches: AccessoryItem[] = [];

    Object.values(database).forEach(items => {
        items.forEach(item => {
            if (item.occasions.some(occ => outfitStyle.includes(occ) || occ.includes(outfitStyle)) && // Fuzzy match for style/occasion mapping
                item.colors.includes(colorPreference)) {
                matches.push(item);
            }
        });
    });

    return matches.slice(0, 3);
}

export function getStyleAnalysis(style: string): string {
    if (style === 'casual' || style === '休闲') return "您偏好休闲风格，建议多尝试舒适的面料和宽松的剪裁。";
    if (style === 'business' || style === '商务') return "您偏好商务风格，建议注重剪裁和质感的搭配。";
    if (style === 'sweet' || style === '甜美') return "您偏好甜美风格，建议多使用柔和的色彩和女性化的设计。";
    return "建议选择适合自己体型的剪裁和色彩";
}
