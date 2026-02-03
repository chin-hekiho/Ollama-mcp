#!/usr/bin/env python3
"""
古诗词学习助手启动脚本
"""

import subprocess
import sys
import os
from pathlib import Path

def check_dependencies():
    """检查依赖是否安装"""
    try:
        import streamlit
        import torch
        import tiktoken
        print("✅ 依赖检查通过")
        return True
    except ImportError as e:
        print(f"❌ 缺少依赖: {e}")
        print("请运行: pip install -r requirements.txt")
        return False

def main():
    """主函数"""
    print("🌸 古诗词学习助手")
    print("=" * 50)
    
    # 检查依赖
    if not check_dependencies():
        return
    
    # 获取当前目录
    current_dir = Path(__file__).parent
    app_file = current_dir / "app.py"
    
    if not app_file.exists():
        print(f"❌ 找不到应用文件: {app_file}")
        return
    
    print("🚀 启动应用...")
    print("📱 应用将在浏览器中打开")
    print("🔗 地址: http://localhost:8501")
    print("⏹️  按 Ctrl+C 停止应用")
    print("-" * 50)
    
    try:
        # 启动Streamlit应用
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            str(app_file), "--server.port", "8501"
        ])
    except KeyboardInterrupt:
        print("\n👋 应用已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")

if __name__ == "__main__":
    main() 