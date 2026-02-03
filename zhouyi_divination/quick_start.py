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
        "requests",
        "streamlit"
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

def check_ollama():
    """检查Ollama服务"""
    print("\n🔍 检查 Ollama 服务...")
    try:
        import requests
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            print("✅ Ollama 服务正在运行")
            return True
        else:
            print("⚠️  Ollama 服务未响应")
            return False
    except:
        print("❌ 无法连接到 Ollama 服务")
        print("   请先启动 Ollama: ollama serve")
        return False

def run_demo():
    """运行演示程序"""
    print("\n🚀 运行周易占卜演示...")
    
    try:
        subprocess.run([sys.executable, "zhouyi_system.py"])
    except KeyboardInterrupt:
        print("\n👋 演示已停止")
    except Exception as e:
        print(f"❌ 运行失败: {e}")

def main():
    """主函数"""
    print("☯️  周易占卜助手 - 快速启动")
    print("=" * 50)
    
    # 检查并安装依赖
    if not check_and_install_dependencies():
        print("❌ 依赖安装失败，请手动安装")
        return
    
    # 检查Ollama服务
    ollama_running = check_ollama()
    if not ollama_running:
        print("\n⚠️  提示：Ollama 服务未运行")
        print("   系统将使用传统解读模式")
        print("   如需AI增强解读，请先启动 Ollama")
    
    # 运行演示
    run_demo()

if __name__ == "__main__":
    main()
