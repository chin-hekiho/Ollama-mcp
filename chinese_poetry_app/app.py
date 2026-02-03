import streamlit as st
import json
import random
from pathlib import Path

# Import configuration
from config import BACKEND, CLAUDE_API_KEY, CLAUDE_MODEL, OLLAMA_MODEL, APP_TITLE, APP_ICON

# Import backends
if BACKEND == "claude":
    from claude_backend import get_claude_backend
    backend = None  # Will initialize after API key check
else:
    from ollama_backend import get_ollama_backend
    backend = get_ollama_backend(model_name=OLLAMA_MODEL)

# 页面配置
st.set_page_config(
    page_title=APP_TITLE,
    page_icon=APP_ICON,
    layout="wide",
    initial_sidebar_state="expanded"
)

# 导入诗词数据
from poetry_data import POETRY_DATABASE, POETRY_THEMES, POETS_INFO, POETRY_RULES
from poetry_data import get_poetry_by_theme, get_poetry_by_author, get_random_poetry, search_poetry

def check_backend_connection():
    """检查后端连接状态"""
    global backend
    
    if BACKEND == "claude":
        # Check for API key
        api_key = CLAUDE_API_KEY or st.session_state.get("claude_api_key", "")
        
        if not api_key:
            st.sidebar.error("❌ 未设置 Claude API Key")
            st.sidebar.info("请在侧边栏输入您的 API Key")
            
            # API Key input in sidebar
            with st.sidebar:
                st.markdown("---")
                st.markdown("### 🔑 Claude API 设置")
                input_key = st.text_input(
                    "Anthropic API Key",
                    type="password",
                    help="从 https://console.anthropic.com/ 获取"
                )
                if st.button("保存 API Key"):
                    if input_key:
                        st.session_state.claude_api_key = input_key
                        st.rerun()
                    else:
                        st.error("请输入有效的 API Key")
            return False
        else:
            try:
                if backend is None:
                    backend = get_claude_backend(api_key=api_key, model=CLAUDE_MODEL)
                st.sidebar.success(f"✅ Claude 已连接 (模型: {CLAUDE_MODEL})")
                return True
            except Exception as e:
                st.sidebar.error(f"❌ Claude 连接失败: {str(e)}")
                return False
    else:
        # Ollama backend
        if backend.check_connection():
            st.sidebar.success(f"✅ Ollama 已连接 (模型: {OLLAMA_MODEL})")
            return True
        else:
            st.sidebar.error("❌ Ollama 未运行")
            st.sidebar.info("请在终端运行: `ollama serve`")
            return False

def main():
    # 检查后端连接
    backend_connected = check_backend_connection()
    
    # 侧边栏
    st.sidebar.title(f"{APP_ICON} {APP_TITLE}")
    st.sidebar.caption(f"后端: {BACKEND.upper()}")
    
    # 功能选择
    function = st.sidebar.selectbox(
        "选择功能",
        ["🏠 首页", "📝 诗词生成", "📖 诗词解释", "🔗 诗词接龙", "❓ 诗词问答", "📚 学习模式"]
    )
    
    # 主要内容区域
    if function == "🏠 首页":
        show_homepage()
    elif function == "📝 诗词生成":
        show_poetry_generation(backend_connected)
    elif function == "📖 诗词解释":
        show_poetry_explanation(backend_connected)
    elif function == "🔗 诗词接龙":
        show_poetry_continuation(backend_connected)
    elif function == "❓ 诗词问答":
        show_poetry_qa(backend_connected)
    elif function == "📚 学习模式":
        show_learning_mode()

def show_homepage():
    """显示首页"""
    st.title(f"{APP_ICON} {APP_TITLE}")
    st.markdown("---")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        backend_name = "Claude AI" if BACKEND == "claude" else "Ollama"
        st.markdown(f"""
        ## 欢迎来到{APP_TITLE}！
        
        这是一个基于 **{backend_name}** 的古诗词学习应用，旨在帮助您更好地学习和欣赏中国古典诗词。
        
        ### 🎯 主要功能：
        - **📝 诗词生成**：根据主题生成古诗词
        - **📖 诗词解释**：解释诗词含义和背景
        - **🔗 诗词接龙**：根据上句接续下句
        - **❓ 诗词问答**：回答关于古诗词的问题
        - **📚 学习模式**：交互式学习体验
        
        ### 🚀 开始使用：
        请从左侧边栏选择您想要使用的功能！
        
        ### 🤖 技术栈：
        - **AI 后端**: {backend_name}
        - **框架**: Streamlit
        """)
    
    with col2:
        st.markdown("""
        ### 📊 诗词统计
        - 唐诗：300首
        - 宋词：200首
        - 元曲：100首
        - 明清诗词：150首
        """)
        
        # 显示随机诗词
        st.markdown("### 🌟 今日推荐")
        poetry = get_random_poetry()
        
        st.markdown(f"""
        **{poetry['title']}** - {poetry['author']}
        
        {poetry['content']}
        """)

def show_poetry_generation(backend_connected):
    """诗词生成功能"""
    st.title("📝 诗词生成")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 生成参数")
        
        theme = st.text_input("主题", placeholder="例如：春天、思乡、爱情...")
        style = st.selectbox("风格", ["唐诗", "宋词", "元曲", "自由发挥"])
        length = st.slider("长度", 4, 20, 8)
        
        if st.button("🎨 生成诗词", type="primary"):
            if not backend_connected:
                st.error(f"请先配置 {BACKEND.upper()} 后端！")
            elif theme:
                with st.spinner("正在创作中..."):
                    response = backend.generate_poetry(theme, style, length)
                
                with col2:
                    st.markdown("### 生成的诗词")
                    st.markdown(f"**主题：** {theme}")
                    st.markdown(f"**风格：** {style}")
                    st.markdown("---")
                    st.markdown(response)
            else:
                st.warning("请输入主题！")

def show_poetry_explanation(backend_connected):
    """诗词解释功能"""
    st.title("📖 诗词解释")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 输入诗词")
        
        poetry_input = st.text_area(
            "请输入要解释的诗词",
            placeholder="例如：床前明月光，疑是地上霜。举头望明月，低头思故乡。",
            height=150
        )
        
        if st.button("🔍 解释诗词", type="primary"):
            if not backend_connected:
                st.error(f"请先配置 {BACKEND.upper()} 后端！")
            elif poetry_input:
                with st.spinner("正在分析中..."):
                    response = backend.explain_poetry(poetry_input)
                
                with col2:
                    st.markdown("### 诗词解释")
                    st.markdown(response)
            else:
                st.warning("请输入诗词内容！")

def show_poetry_continuation(backend_connected):
    """诗词接龙功能"""
    st.title("🔗 诗词接龙")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 输入上句")
        
        first_line = st.text_input("请输入诗词的上句", placeholder="例如：床前明月光")
        
        if st.button("🔄 接续下句", type="primary"):
            if not backend_connected:
                st.error(f"请先配置 {BACKEND.upper()} 后端！")
            elif first_line:
                with st.spinner("正在思考中..."):
                    response = backend.continue_poetry(first_line)
                
                with col2:
                    st.markdown("### 接续结果")
                    st.markdown(f"**上句：** {first_line}")
                    st.markdown(f"**下句：** {response}")
            else:
                st.warning("请输入上句！")

def show_poetry_qa(backend_connected):
    """诗词问答功能"""
    st.title("❓ 诗词问答")
    st.markdown("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 提出问题")
        
        question = st.text_area(
            "请输入您的问题",
            placeholder="例如：李白的代表作有哪些？什么是格律诗？",
            height=100
        )
        
        if st.button("💡 获取答案", type="primary"):
            if not backend_connected:
                st.error(f"请先配置 {BACKEND.upper()} 后端！")
            elif question:
                with st.spinner("正在查找答案..."):
                    response = backend.answer_question(question)
                
                with col2:
                    st.markdown("### AI回答")
                    st.markdown(response)
            else:
                st.warning("请输入问题！")

def show_learning_mode():
    """学习模式"""
    st.title("📚 学习模式")
    st.markdown("---")
    
    tab1, tab2, tab3 = st.tabs(["📖 诗词欣赏", "🎯 练习测试", "📊 学习进度"])
    
    with tab1:
        st.markdown("### 诗词欣赏")
        
        poetry_type = st.selectbox("选择诗词类型", list(POETRY_DATABASE.keys()))
        
        if poetry_type in POETRY_DATABASE:
            for i, poetry in enumerate(POETRY_DATABASE[poetry_type]):
                with st.expander(f"{poetry['title']} - {poetry['author']}"):
                    st.markdown(f"**诗词内容：**\n{poetry['content']}")
                    st.markdown(f"**解释：**\n{poetry['explanation']}")
                    if poetry.get('tags'):
                        st.markdown(f"**标签：** {', '.join(poetry['tags'])}")
    
    with tab2:
        st.markdown("### 练习测试")
        st.info("练习测试功能正在开发中...")
    
    with tab3:
        st.markdown("### 学习进度")
        st.info("学习进度功能正在开发中...")

if __name__ == "__main__":
    main()