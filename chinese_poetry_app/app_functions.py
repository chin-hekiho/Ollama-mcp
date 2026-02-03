import streamlit as st
from poetry_data import POETRY_DATABASE, POETRY_THEMES, POETS_INFO, POETRY_RULES
from poetry_data import get_poetry_by_theme, get_poetry_by_author, get_random_poetry, search_poetry

def show_enhanced_homepage():
    """显示增强版首页"""
    st.title("🌸 古诗词学习助手 - 增强版")
    st.markdown("---")
    
    # 顶部统计卡片
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("已读诗词", st.session_state.learning_progress['poems_read'])
    with col2:
        st.metric("已回答问题", st.session_state.learning_progress['questions_answered'])
    with col3:
        st.metric("收藏诗词", st.session_state.learning_progress['favorites_added'])
    with col4:
        total_poems = sum(len(poems) for poems in POETRY_DATABASE.values())
        st.metric("总诗词数", total_poems)
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown("""
        ## 欢迎来到古诗词学习助手！
        
        这是一个基于AI的古诗词学习应用，旨在帮助您更好地学习和欣赏中国古典诗词。
        
        ### 🎯 主要功能：
        - **📝 诗词生成**：根据主题生成古诗词
        - **📖 诗词解释**：解释诗词含义和背景
        - **🔗 诗词接龙**：根据上句接续下句
        - **❓ 诗词问答**：回答关于古诗词的问题
        - **📚 学习模式**：交互式学习体验
        - **💬 智能对话**：与AI进行古诗词对话
        - **❤️ 我的收藏**：管理您喜欢的诗词
        - **📊 学习统计**：查看学习进度
        
        ### 🚀 开始使用：
        请从左侧边栏选择您想要使用的功能！
        """)
    
    with col2:
        st.markdown("### 🌟 今日推荐")
        poetry = get_random_poetry()
        
        st.markdown(f"""
        **{poetry['title']}** - {poetry['author']}
        
        {poetry['content']}
        """)

def show_enhanced_poetry_generation(tokenizer, model, config, generate_poetry_response):
    """增强版诗词生成功能"""
    st.title("📝 诗词生成")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 生成参数")
        
        theme = st.text_input("主题", placeholder="例如：春天、思乡、爱情...")
        style = st.selectbox("风格", ["唐诗", "宋词", "元曲", "自由发挥"])
        length = st.slider("长度", 4, 20, 8)
        
        # 高级选项
        with st.expander("⚙️ 高级选项"):
            temperature = st.slider("创造性", 0.1, 2.0, 0.8)
            rhyme_requirement = st.checkbox("要求押韵", value=True)
        
        if st.button("🎨 生成诗词", type="primary"):
            if theme:
                with st.spinner("正在生成诗词..."):
                    prompt = f"请以'{theme}'为主题，创作一首{style}风格的诗词，长度约{length}句。"
                    if rhyme_requirement:
                        prompt += "要求押韵。"
                    
                    response = generate_poetry_response(prompt, tokenizer, model, config)
                    
                    with col2:
                        st.markdown("### 生成的诗词")
                        st.markdown(f"**主题：** {theme}")
                        st.markdown(f"**风格：** {style}")
                        st.markdown("---")
                        st.markdown(response)
            else:
                st.warning("请输入主题！")

def show_enhanced_poetry_explanation(tokenizer, model, config, generate_poetry_response):
    """增强版诗词解释功能"""
    st.title("📖 诗词解释")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 输入诗词")
        
        # 快速选择
        quick_select = st.selectbox("快速选择", ["", "静夜思", "春晓", "登鹳雀楼", "咏鹅", "悯农"])
        
        if quick_select:
            # 查找对应的诗词
            found_poetry = None
            for category, poems in POETRY_DATABASE.items():
                for poem in poems:
                    if poem['title'] == quick_select:
                        found_poetry = poem
                        break
                if found_poetry:
                    break
            
            if found_poetry:
                poetry_input = found_poetry['content']
                st.text_area("诗词内容", poetry_input, height=100)
            else:
                poetry_input = st.text_area("请输入要解释的诗词", height=100)
        else:
            poetry_input = st.text_area(
                "请输入要解释的诗词",
                placeholder="例如：床前明月光，疑是地上霜。举头望明月，低头思故乡。",
                height=150
            )
        
        if st.button("🔍 解释诗词", type="primary"):
            if poetry_input:
                with st.spinner("正在分析诗词..."):
                    prompt = f"请详细解释这首诗词的含义、背景和艺术特色：{poetry_input}"
                    response = generate_poetry_response(prompt, tokenizer, model, config)
                    
                    with col2:
                        st.markdown("### 诗词解释")
                        st.markdown(response)
                        
                        # 显示相关诗词
                        st.markdown("### 📚 相关诗词")
                        related_poems = search_poetry(poetry_input[:10])  # 搜索前10个字符
                        if related_poems:
                            for poem in related_poems[:3]:  # 显示前3首
                                with st.expander(f"{poem['title']} - {poem['author']}"):
                                    st.markdown(poem['content'])
            else:
                st.warning("请输入诗词内容！")

def show_enhanced_poetry_continuation(tokenizer, model, config, generate_poetry_response):
    """增强版诗词接龙功能"""
    st.title("🔗 诗词接龙")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 输入上句")
        
        first_line = st.text_input("请输入诗词的上句", placeholder="例如：床前明月光")
        
        # 接龙模式
        continuation_mode = st.selectbox("接龙模式", ["单句接龙", "多句接龙", "对联接龙"])
        
        if st.button("🔄 接续下句", type="primary"):
            if first_line:
                with st.spinner("正在生成接续..."):
                    if continuation_mode == "单句接龙":
                        prompt = f"请为这句诗接续下句，保持韵律和意境：{first_line}"
                    elif continuation_mode == "多句接龙":
                        prompt = f"请为这句诗接续完整的诗句（4-8句），保持韵律和意境：{first_line}"
                    else:  # 对联接龙
                        prompt = f"请为这句诗创作对联，要求对仗工整：{first_line}"
                    
                    response = generate_poetry_response(prompt, tokenizer, model, config)
                    
                    with col2:
                        st.markdown("### 接续结果")
                        st.markdown(f"**上句：** {first_line}")
                        st.markdown(f"**接续：** {response}")
            else:
                st.warning("请输入上句！")

def show_enhanced_poetry_qa(tokenizer, model, config, generate_poetry_response):
    """增强版诗词问答功能"""
    st.title("❓ 诗词问答")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 提出问题")
        
        # 预设问题
        preset_questions = [
            "",
            "李白的代表作有哪些？",
            "什么是格律诗？",
            "唐诗和宋词有什么区别？",
            "如何欣赏古诗词？",
            "古诗词的押韵规则是什么？"
        ]
        
        selected_question = st.selectbox("选择预设问题", preset_questions)
        
        if selected_question:
            question = st.text_area("您的问题", selected_question, height=100)
        else:
            question = st.text_area(
                "请输入您的问题",
                placeholder="例如：李白的代表作有哪些？什么是格律诗？",
                height=100
            )
        
        if st.button("💡 获取答案", type="primary"):
            if question:
                with st.spinner("正在思考答案..."):
                    response = generate_poetry_response(question, tokenizer, model, config)
                    
                    with col2:
                        st.markdown("### AI回答")
                        st.markdown(response)
                        
                        # 更新学习进度
                        st.session_state.learning_progress['questions_answered'] += 1
                        
                        # 相关推荐
                        st.markdown("### 📚 相关推荐")
                        if "李白" in question:
                            li_bai_poems = get_poetry_by_author("李白")
                            if li_bai_poems:
                                for poem in li_bai_poems[:2]:
                                    with st.expander(f"{poem['title']}"):
                                        st.markdown(poem['content'])
            else:
                st.warning("请输入问题！")

def show_enhanced_learning_mode():
    """增强版学习模式"""
    st.title("📚 学习模式")
    st.markdown("---")
    
    tab1, tab2, tab3 = st.tabs(["📖 诗词欣赏", "🎯 练习测试", "👨‍🏫 诗人介绍"])
    
    with tab1:
        st.markdown("### 诗词欣赏")
        
        # 筛选选项
        col1, col2 = st.columns(2)
        with col1:
            poetry_type = st.selectbox("选择诗词类型", list(POETRY_DATABASE.keys()))
        with col2:
            theme_filter = st.selectbox("按主题筛选", ["全部"] + list(POETRY_THEMES.keys()))
        
        if poetry_type in POETRY_DATABASE:
            poems_to_show = POETRY_DATABASE[poetry_type]
            
            # 按主题筛选
            if theme_filter != "全部":
                theme_keywords = POETRY_THEMES[theme_filter]
                poems_to_show = [poem for poem in poems_to_show 
                               if any(keyword in poem.get('tags', []) for keyword in theme_keywords)]
            
            for i, poetry in enumerate(poems_to_show):
                with st.expander(f"{poetry['title']} - {poetry['author']}"):
                    st.markdown(f"**诗词内容：**\n{poetry['content']}")
                    st.markdown(f"**解释：**\n{poetry['explanation']}")
                    if poetry.get('tags'):
                        st.markdown(f"**标签：** {', '.join(poetry['tags'])}")
                    st.session_state.learning_progress['poems_read'] += 1
    
    with tab2:
        st.markdown("### 练习测试")
        st.info("练习测试功能正在开发中...")
    
    with tab3:
        st.markdown("### 诗人介绍")
        
        poet_name = st.selectbox("选择诗人", list(POETS_INFO.keys()))
        
        if poet_name in POETS_INFO:
            poet_info = POETS_INFO[poet_name]
            
            col1, col2 = st.columns([1, 2])
            
            with col1:
                st.markdown(f"""
                ### {poet_name}
                **时代：** {poet_info['era']}
                **称号：** {poet_info['title']}
                **风格：** {poet_info['style']}
                """)
            
            with col2:
                st.markdown(f"**简介：** {poet_info['description']}")
                
                st.markdown("**代表作品：**")
                for work in poet_info['representative_works']:
                    st.markdown(f"- {work}")

def show_chat_interface(tokenizer, model, config, generate_poetry_response):
    """智能对话界面"""
    st.title("💬 智能对话")
    st.markdown("---")
    
    # 显示聊天历史
    for message in st.session_state.chat_history:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # 用户输入
    if prompt := st.chat_input("与AI助手对话..."):
        # 添加用户消息
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # 生成AI回复
        with st.chat_message("assistant"):
            with st.spinner("AI正在思考..."):
                response = generate_poetry_response(prompt, tokenizer, model, config)
                st.markdown(response)
                st.session_state.chat_history.append({"role": "assistant", "content": response})
        
        # 更新学习进度
        st.session_state.learning_progress['questions_answered'] += 1
    
    # 清空聊天记录
    if st.button("🗑️ 清空聊天记录"):
        st.session_state.chat_history = []
        st.rerun()

def show_favorites():
    """显示收藏"""
    st.title("❤️ 我的收藏")
    st.markdown("---")
    
    if not st.session_state.favorites:
        st.info("您还没有收藏任何诗词。快去发现您喜欢的诗词吧！")
    else:
        st.markdown(f"### 共收藏 {len(st.session_state.favorites)} 首诗词")
        
        # 显示收藏的诗词
        for i, poetry in enumerate(st.session_state.favorites):
            with st.expander(f"{poetry['title']} - {poetry['author']}"):
                st.markdown(f"**诗词内容：**\n{poetry['content']}")
                st.markdown(f"**解释：**\n{poetry['explanation']}")
                if poetry.get('tags'):
                    st.markdown(f"**标签：** {', '.join(poetry['tags'])}")

def show_learning_statistics():
    """显示学习统计"""
    st.title("📊 学习统计")
    st.markdown("---")
    
    # 总体统计
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("已读诗词", st.session_state.learning_progress['poems_read'])
    with col2:
        st.metric("已回答问题", st.session_state.learning_progress['questions_answered'])
    with col3:
        st.metric("收藏诗词", st.session_state.learning_progress['favorites_added'])
    with col4:
        total_poems = sum(len(poems) for poems in POETRY_DATABASE.values())
        completion_rate = (st.session_state.learning_progress['poems_read'] / total_poems * 100) if total_poems > 0 else 0
        st.metric("完成率", f"{completion_rate:.1f}%")
    
    # 学习建议
    st.markdown("### 💡 学习建议")
    
    if st.session_state.learning_progress['poems_read'] < 10:
        st.info("建议多读一些经典诗词，培养语感。")
    elif st.session_state.learning_progress['poems_read'] < 30:
        st.success("您已经读了不少诗词，建议尝试创作一些简单的诗句。")
    else:
        st.success("您已经是诗词爱好者了！建议深入研究诗词格律和创作技巧。") 