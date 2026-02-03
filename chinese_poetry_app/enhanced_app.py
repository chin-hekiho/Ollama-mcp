import streamlit as st
import torch
import tiktoken
import json
import random
import time
from pathlib import Path
import sys
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# 添加项目路径
sys.path.append(str(Path(__file__).parent.parent))

try:
    from llms_from_scratch.ch04 import GPTModel
    from llms_from_scratch.ch05 import generate, text_to_token_ids, token_ids_to_text
except ImportError:
    st.error("请先安装项目依赖：pip install -r requirements.txt")
    st.stop()

# 导入诗词数据
from poetry_data import POETRY_DATABASE, POETRY_THEMES, POETS_INFO, POETRY_RULES
from poetry_data import get_poetry_by_theme, get_poetry_by_author, get_random_poetry, search_poetry

# 导入功能函数
from app_functions import (
    show_enhanced_homepage, show_enhanced_poetry_generation, show_enhanced_poetry_explanation,
    show_enhanced_poetry_continuation, show_enhanced_poetry_qa, show_enhanced_learning_mode,
    show_chat_interface, show_favorites, show_learning_statistics
)

# 页面配置
st.set_page_config(
    page_title="古诗词学习助手 - 增强版",
    page_icon="🌸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 设置设备
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 初始化会话状态
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'favorites' not in st.session_state:
    st.session_state.favorites = []
if 'learning_progress' not in st.session_state:
    st.session_state.learning_progress = {
        'poems_read': 0,
        'questions_answered': 0,
        'favorites_added': 0
    }

def load_model():
    """加载模型"""
    try:
        GPT_CONFIG_355M = {
            "vocab_size": 50257,
            "context_length": 1024,
            "emb_dim": 1024,
            "n_heads": 16,
            "n_layers": 24,
            "drop_rate": 0.0,
            "qkv_bias": True
        }

        tokenizer = tiktoken.get_encoding("gpt2")
        
        # 尝试加载训练好的模型
        model_path = Path("../ch07/01_main-chapter-code/gpt2-medium355M-sft.pth")
        if model_path.exists():
            checkpoint = torch.load(model_path, weights_only=True)
            model = GPTModel(GPT_CONFIG_355M)
            model.load_state_dict(checkpoint)
            model.to(device)
            return tokenizer, model, GPT_CONFIG_355M
        else:
            st.warning("未找到训练好的模型，将使用演示模式")
            return None, None, None
    except Exception as e:
        st.error(f"模型加载失败: {e}")
        return None, None, None

def generate_poetry_response(prompt, tokenizer, model, config):
    """生成诗词相关回复"""
    if model is None:
        return "演示模式：这是一个基于AI的古诗词学习助手，可以帮您学习古诗词。"
    
    try:
        torch.manual_seed(123)
        
        full_prompt = f"""你是一个古诗词专家，请根据用户的问题提供专业的回答。

用户问题：{prompt}

回答："""
        
        token_ids = generate(
            model=model,
            idx=text_to_token_ids(full_prompt, tokenizer).to(device),
            max_new_tokens=100,
            context_size=config["context_length"],
            eos_id=50256
        )
        
        text = token_ids_to_text(token_ids, tokenizer)
        response = text[len(full_prompt):].strip()
        return response if response else "抱歉，我暂时无法回答这个问题。"
    except Exception as e:
        return f"生成回复时出错: {e}"

def add_to_favorites(poetry):
    """添加到收藏"""
    if poetry not in st.session_state.favorites:
        st.session_state.favorites.append(poetry)
        st.session_state.learning_progress['favorites_added'] += 1
        st.success("已添加到收藏！")

def show_poetry_card(poetry, show_favorite_button=True):
    """显示诗词卡片"""
    with st.container():
        st.markdown(f"""
        ### {poetry['title']} - {poetry['author']}
        """)
        
        # 诗词内容
        st.markdown(f"**诗词内容：**")
        st.markdown(f"```\n{poetry['content']}\n```")
        
        # 解释
        with st.expander("📖 查看解释"):
            st.markdown(poetry['explanation'])
        
        # 标签
        if poetry.get('tags'):
            st.markdown(f"**标签：** {', '.join(poetry['tags'])}")
        
        # 收藏按钮
        if show_favorite_button:
            col1, col2 = st.columns([1, 4])
            with col1:
                if poetry in st.session_state.favorites:
                    if st.button("💔 取消收藏", key=f"unfav_{poetry['title']}"):
                        st.session_state.favorites.remove(poetry)
                        st.session_state.learning_progress['favorites_added'] -= 1
                        st.success("已从收藏中移除！")
                else:
                    if st.button("❤️ 收藏", key=f"fav_{poetry['title']}"):
                        add_to_favorites(poetry)

def main():
    # 加载模型
    tokenizer, model, config = load_model()
    
    # 侧边栏
    st.sidebar.title("🌸 古诗词学习助手")
    
    # 功能选择
    function = st.sidebar.selectbox(
        "选择功能",
        ["🏠 首页", "📝 诗词生成", "📖 诗词解释", "🔗 诗词接龙", "❓ 诗词问答", 
         "📚 学习模式", "💬 智能对话", "❤️ 我的收藏", "📊 学习统计"]
    )
    
    # 主要内容区域
    if function == "🏠 首页":
        show_enhanced_homepage()
    elif function == "📝 诗词生成":
        show_enhanced_poetry_generation(tokenizer, model, config, generate_poetry_response)
    elif function == "📖 诗词解释":
        show_enhanced_poetry_explanation(tokenizer, model, config, generate_poetry_response)
    elif function == "🔗 诗词接龙":
        show_enhanced_poetry_continuation(tokenizer, model, config, generate_poetry_response)
    elif function == "❓ 诗词问答":
        show_enhanced_poetry_qa(tokenizer, model, config, generate_poetry_response)
    elif function == "📚 学习模式":
        show_enhanced_learning_mode()
    elif function == "💬 智能对话":
        show_chat_interface(tokenizer, model, config, generate_poetry_response)
    elif function == "❤️ 我的收藏":
        show_favorites()
    elif function == "📊 学习统计":
        show_learning_statistics()

if __name__ == "__main__":
    main() 