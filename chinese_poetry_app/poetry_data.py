# 古诗词数据集
POETRY_DATABASE = {
    "唐诗": [
        {
            "title": "静夜思",
            "author": "李白",
            "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
            "explanation": "这首诗描写了诗人在月夜思乡的情景，语言清新自然，意境优美。诗人运用比喻手法，将月光比作霜，营造出清冷孤寂的氛围。",
            "tags": ["思乡", "月亮", "夜晚"]
        },
        {
            "title": "春晓",
            "author": "孟浩然",
            "content": "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
            "explanation": "这首诗描写了春天早晨的景象，表达了诗人对春天的喜爱之情。通过听觉感受来描写春天的美好，构思巧妙。",
            "tags": ["春天", "早晨", "鸟鸣"]
        },
        {
            "title": "登鹳雀楼",
            "author": "王之涣",
            "content": "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
            "explanation": "这首诗描写了诗人登楼远望的壮丽景象，表达了积极向上的人生态度。前两句写景，后两句抒情，结构严谨。",
            "tags": ["登高", "黄河", "壮志"]
        },
        {
            "title": "咏鹅",
            "author": "骆宾王",
            "content": "鹅，鹅，鹅，曲项向天歌。白毛浮绿水，红掌拨清波。",
            "explanation": "这首诗生动地描写了鹅的外形特征和动作，语言简洁明快，形象鲜明。是儿童学习古诗的经典作品。",
            "tags": ["动物", "鹅", "儿童"]
        },
        {
            "title": "悯农",
            "author": "李绅",
            "content": "锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。",
            "explanation": "这首诗描写了农民劳动的辛苦，表达了诗人对农民的同情和对粮食的珍惜。语言朴实，寓意深刻。",
            "tags": ["农民", "劳动", "珍惜"]
        }
    ],
    "宋词": [
        {
            "title": "水调歌头·明月几时有",
            "author": "苏轼",
            "content": "明月几时有，把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。",
            "explanation": "这首词表达了诗人对月亮的向往和对人生的思考。通过想象和对比，展现了诗人豁达的人生态度。",
            "tags": ["月亮", "人生", "豁达"]
        },
        {
            "title": "如梦令·昨夜雨疏风骤",
            "author": "李清照",
            "content": "昨夜雨疏风骤，浓睡不消残酒。试问卷帘人，却道海棠依旧。知否，知否？应是绿肥红瘦。",
            "explanation": "这首词描写了女词人对海棠花的关心，通过对话形式展现了细腻的情感。语言清新，意境优美。",
            "tags": ["海棠", "春天", "女性"]
        },
        {
            "title": "声声慢·寻寻觅觅",
            "author": "李清照",
            "content": "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急？",
            "explanation": "这首词表达了女词人晚年孤独凄凉的心境，通过叠字和对比手法，营造出悲凉的氛围。",
            "tags": ["孤独", "凄凉", "晚年"]
        }
    ],
    "元曲": [
        {
            "title": "天净沙·秋思",
            "author": "马致远",
            "content": "枯藤老树昏鸦，小桥流水人家，古道西风瘦马。夕阳西下，断肠人在天涯。",
            "explanation": "这首小令通过一系列意象的排列，描绘了一幅秋日黄昏的凄凉景象，表达了游子的思乡之情。",
            "tags": ["秋天", "思乡", "游子"]
        }
    ]
}

# 诗词主题分类
POETRY_THEMES = {
    "自然风光": ["春天", "秋天", "月亮", "山水", "花鸟"],
    "情感表达": ["思乡", "爱情", "友情", "孤独", "豁达"],
    "人生感悟": ["壮志", "珍惜", "人生", "哲理"],
    "社会生活": ["农民", "劳动", "战争", "和平"]
}

# 诗人信息
POETS_INFO = {
    "李白": {
        "era": "唐代",
        "title": "诗仙",
        "style": "浪漫主义",
        "representative_works": ["静夜思", "将进酒", "望庐山瀑布", "早发白帝城"],
        "description": "李白是唐代伟大的浪漫主义诗人，被后人誉为'诗仙'。他的诗歌想象丰富，语言清新，意境优美。"
    },
    "杜甫": {
        "era": "唐代", 
        "title": "诗圣",
        "style": "现实主义",
        "representative_works": ["茅屋为秋风所破歌", "春望", "登高", "闻官军收河南河北"],
        "description": "杜甫是唐代伟大的现实主义诗人，被后人誉为'诗圣'。他的诗歌反映了当时的社会现实，被称为'诗史'。"
    },
    "苏轼": {
        "era": "宋代",
        "title": "东坡居士",
        "style": "豪放派",
        "representative_works": ["水调歌头·明月几时有", "念奴娇·赤壁怀古", "江城子·密州出猎"],
        "description": "苏轼是宋代著名的文学家，豪放派词人的代表。他的作品题材广泛，风格多样，影响深远。"
    },
    "李清照": {
        "era": "宋代",
        "title": "易安居士", 
        "style": "婉约派",
        "representative_works": ["如梦令·昨夜雨疏风骤", "声声慢·寻寻觅觅", "醉花阴·薄雾浓云愁永昼"],
        "description": "李清照是宋代著名的女词人，婉约派的代表。她的词作情感真挚，语言优美，在中国文学史上占有重要地位。"
    }
}

# 诗词格律知识
POETRY_RULES = {
    "五言绝句": {
        "lines": 4,
        "characters_per_line": 5,
        "rhyme_scheme": "AABA",
        "description": "五言绝句是近体诗的一种，每句五个字，共四句。通常第一、二、四句押韵。"
    },
    "七言绝句": {
        "lines": 4,
        "characters_per_line": 7,
        "rhyme_scheme": "AABA", 
        "description": "七言绝句是近体诗的一种，每句七个字，共四句。通常第一、二、四句押韵。"
    },
    "五言律诗": {
        "lines": 8,
        "characters_per_line": 5,
        "rhyme_scheme": "AABBCCDD",
        "description": "五言律诗是近体诗的一种，每句五个字，共八句。要求对仗工整，韵律严格。"
    },
    "七言律诗": {
        "lines": 8,
        "characters_per_line": 7,
        "rhyme_scheme": "AABBCCDD",
        "description": "七言律诗是近体诗的一种，每句七个字，共八句。要求对仗工整，韵律严格。"
    }
}

def get_poetry_by_theme(theme):
    """根据主题获取诗词"""
    result = []
    for category, poems in POETRY_DATABASE.items():
        for poem in poems:
            if theme in poem.get("tags", []):
                result.append(poem)
    return result

def get_poetry_by_author(author):
    """根据作者获取诗词"""
    result = []
    for category, poems in POETRY_DATABASE.items():
        for poem in poems:
            if poem["author"] == author:
                result.append(poem)
    return result

def get_random_poetry():
    """获取随机诗词"""
    import random
    category = random.choice(list(POETRY_DATABASE.keys()))
    return random.choice(POETRY_DATABASE[category])

def search_poetry(keyword):
    """搜索诗词"""
    result = []
    for category, poems in POETRY_DATABASE.items():
        for poem in poems:
            if (keyword in poem["title"] or 
                keyword in poem["content"] or 
                keyword in poem["author"] or
                keyword in poem.get("tags", [])):
                result.append(poem)
    return result 