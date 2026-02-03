#!/usr/bin/env python3
"""
快速启动脚本 - 自动检查和安装依赖
"""

import subprocess
import sys
import os
from pathlib import Path

def install_package(package):
    """安装单个包"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def check_and_install_dependencies():
    """检查并安装依赖"""
    print("🔍 检查依赖包...")
    
    required_packages = [
        "streamlit",
        "torch", 
        "tiktoken",
        "numpy",
        "pandas",
        "matplotlib",
        "plotly"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} 已安装")
        except ImportError:
            print(f"❌ {package} 未安装")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n📦 需要安装 {len(missing_packages)} 个包...")
        for package in missing_packages:
            print(f"正在安装 {package}...")
            if install_package(package):
                print(f"✅ {package} 安装成功")
            else:
                print(f"❌ {package} 安装失败")
                return False
    else:
        print("🎉 所有依赖包都已安装！")
    
    return True

def start_app():
    """启动应用"""
    print("\n🚀 启动时尚搭配师应用...")
    
    try:
        # 启动Streamlit应用
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", 
            "app.py", "--server.port", "8501", "--server.headless", "false"
        ])
    except KeyboardInterrupt:
        print("\n👋 应用已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")

def main():
    """主函数"""
    print("👗 时尚搭配师 - 快速启动")
    print("=" * 50)
    
    # 检查并安装依赖
    if not check_and_install_dependencies():
        print("❌ 依赖安装失败，请手动安装")
        return
    
    # 启动应用
    start_app()

if __name__ == "__main__":
    main() 