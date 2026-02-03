#!/usr/bin/env python3
"""
古诗词学习助手演示脚本
"""

import sys
from pathlib import Path

def print_banner():
    """打印应用横幅"""
    print("=" * 60)
    print("🌸 古诗词学习助手 - 演示版")
    print("=" * 60)
    print("基于LLMs-from-scratch项目的中国古诗词学习AI应用")
    print("=" * 60)

def show_menu():
    """显示主菜单"""
    print("\n📋 功能菜单：")
    print("1. 📝 诗词生成演示")
    print("2. 📖 诗词解释演示")
    print("3. 🔗 诗词接龙演示")
    print("4. ❓ 诗词问答演示")
    print("5. 📚 学习模式演示")
    print("6. 💬 智能对话演示")
    print("7. 📊 数据统计")
    print("8. 🚀 启动Web应用")
    print("0. 退出")
    print("-" * 40)

def demo_poetry_generation():
    """诗词生成演示"""
    print("\n📝 诗词生成演示")
    print("-" * 30)
    
    # 模拟AI生成
    print("主题：春天")
    print("风格：唐诗")
    print("长度：4句")
    print("\n生成的诗词：")
    print("春风吹绿柳，花开满枝头。")
    print("燕子归来早，蝴蝶舞不休。")
    print("溪水潺潺流，山色青如油。")
    print("游人踏青去，美景不胜收。")

def demo_poetry_explanation():
    """诗词解释演示"""
    print("\n📖 诗词解释演示")
    print("-" * 30)
    
    poem = "床前明月光，疑是地上霜。举头望明月，低头思故乡。"
    print(f"诗词：{poem}")
    print("\n解释：")
    print("这首诗描写了诗人在月夜思乡的情景。")
    print("诗人运用比喻手法，将月光比作霜，营造出清冷孤寂的氛围。")
    print("通过'举头'和'低头'的动作对比，表达了思乡之情。")

def demo_poetry_continuation():
    """诗词接龙演示"""
    print("\n🔗 诗词接龙演示")
    print("-" * 30)
    
    first_line = "床前明月光"
    print(f"上句：{first_line}")
    print("接续：疑是地上霜")
    print("继续：举头望明月")
    print("继续：低头思故乡")

def demo_poetry_qa():
    """诗词问答演示"""
    print("\n❓ 诗词问答演示")
    print("-" * 30)
    
    question = "李白的代表作有哪些？"
    print(f"问题：{question}")
    print("\nAI回答：")
    print("李白的代表作包括：")
    print("- 《静夜思》：思乡名作")
    print("- 《将进酒》：豪放诗篇")
    print("- 《望庐山瀑布》：山水诗")
    print("- 《早发白帝城》：行旅诗")
    print("- 《蜀道难》：古风长诗")

def demo_learning_mode():
    """学习模式演示"""
    print("\n📚 学习模式演示")
    print("-" * 30)
    
    print("1. 诗词欣赏")
    print("   - 唐诗：静夜思、春晓、登鹳雀楼")
    print("   - 宋词：水调歌头、如梦令")
    print("   - 元曲：天净沙·秋思")
    
    print("\n2. 诗人介绍")
    print("   - 李白：诗仙，浪漫主义")
    print("   - 杜甫：诗圣，现实主义")
    print("   - 苏轼：豪放派词人")
    print("   - 李清照：婉约派词人")

def demo_chat():
    """智能对话演示"""
    print("\n💬 智能对话演示")
    print("-" * 30)
    
    conversations = [
        ("用户", "你好，我想学习古诗词"),
        ("AI", "您好！很高兴为您介绍古诗词。古诗词是中华文化的瑰宝，包括唐诗、宋词、元曲等。"),
        ("用户", "能推荐一些适合初学者的诗词吗？"),
        ("AI", "当然可以！我推荐从这些经典作品开始：\n- 李白的《静夜思》\n- 孟浩然的《春晓》\n- 王之涣的《登鹳雀楼》")
    ]
    
    for role, content in conversations:
        print(f"{role}: {content}")
        print()

def show_statistics():
    """显示数据统计"""
    print("\n📊 数据统计")
    print("-" * 30)
    
    stats = {
        "唐诗": 5,
        "宋词": 3,
        "元曲": 1,
        "诗人信息": 4,
        "主题分类": 4
    }
    
    for category, count in stats.items():
        print(f"{category}: {count}")
    
    total = sum(stats.values())
    print(f"\n总计: {total} 个数据项")

def show_web_app_info():
    """显示Web应用信息"""
    print("\n🚀 Web应用启动信息")
    print("-" * 30)
    print("要启动Web应用，请运行以下命令：")
    print()
    print("1. 安装依赖：")
    print("   pip install -r requirements.txt")
    print()
    print("2. 启动应用：")
    print("   streamlit run app.py")
    print("   或者")
    print("   python run_app.py")
    print()
    print("3. 访问地址：")
    print("   http://localhost:8501")
    print()
    print("4. 功能特色：")
    print("   - 🌸 美观的中国风界面")
    print("   - 📱 响应式设计")
    print("   - 🤖 AI智能对话")
    print("   - 📊 学习进度跟踪")
    print("   - ❤️ 收藏管理")

def main():
    """主函数"""
    print_banner()
    
    while True:
        show_menu()
        
        try:
            choice = input("请选择功能 (0-8): ").strip()
            
            if choice == "0":
                print("\n👋 感谢使用古诗词学习助手！")
                break
            elif choice == "1":
                demo_poetry_generation()
            elif choice == "2":
                demo_poetry_explanation()
            elif choice == "3":
                demo_poetry_continuation()
            elif choice == "4":
                demo_poetry_qa()
            elif choice == "5":
                demo_learning_mode()
            elif choice == "6":
                demo_chat()
            elif choice == "7":
                show_statistics()
            elif choice == "8":
                show_web_app_info()
            else:
                print("❌ 无效选择，请重新输入！")
                
        except KeyboardInterrupt:
            print("\n\n👋 程序已退出")
            break
        except Exception as e:
            print(f"❌ 发生错误: {e}")
        
        input("\n按回车键继续...")

if __name__ == "__main__":
    main() 