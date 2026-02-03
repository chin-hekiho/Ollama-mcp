"""
周易算命核心系统
整合起卦、查卦、解卦功能
"""

import random
import time
from datetime import datetime
from knowledge_base import get_hexagram_by_number, get_hexagram_by_binary, HEXAGRAMS
from prompts import get_prompt


class ZhouyiDivination:
    """周易占卜系统"""
    
    def __init__(self):
        self.current_hexagram = None
        self.changing_yao = []
        self.question = ""
        
    def generate_hexagram_random(self):
        """随机起卦（模拟蓍草法）"""
        # 生成6个爻，每个爻随机为阴(0)或阳(1)
        yao_list = []
        changing_yao = []
        
        for i in range(6):
            # 模拟三次投币，计算爻的阴阳和变化
            coins = [random.randint(2, 3) for _ in range(3)]
            total = sum(coins)
            
            # 6=老阴(变), 7=少阳, 8=少阴, 9=老阳(变)
            if total == 6:  # 老阴，会变
                yao_list.append(0)
                changing_yao.append(i)
            elif total == 7:  # 少阳
                yao_list.append(1)
            elif total == 8:  # 少阴
                yao_list.append(0)
            elif total == 9:  # 老阳，会变
                yao_list.append(1)
                changing_yao.append(i)
        
        binary_str = ''.join(map(str, yao_list))
        self.changing_yao = changing_yao
        
        return binary_str
    
    def generate_hexagram_time(self):
        """时间起卦法"""
        now = datetime.now()
        
        # 使用年月日时计算
        year = now.year
        month = now.month
        day = now.day
        hour = now.hour
        
        # 上卦 = (年 + 月 + 日) % 8
        upper = (year + month + day) % 8
        if upper == 0:
            upper = 8
            
        # 下卦 = (年 + 月 + 日 + 时) % 8
        lower = (year + month + day + hour) % 8
        if lower == 0:
            lower = 8
            
        # 动爻 = (年 + 月 + 日 + 时) % 6
        dong_yao = (year + month + day + hour) % 6
        if dong_yao == 0:
            dong_yao = 6
            
        self.changing_yao = [dong_yao - 1]  # 转换为0-5索引
        
        # 将八卦序号转换为二进制
        bagua_to_binary = {
            1: "111", 2: "000", 3: "001", 4: "011",
            5: "010", 6: "101", 7: "100", 8: "110"
        }
        
        binary_str = bagua_to_binary[upper] + bagua_to_binary[lower]
        return binary_str
    
    def generate_hexagram_manual(self, binary_str):
        """手动输入卦象"""
        if len(binary_str) != 6 or not all(c in '01' for c in binary_str):
            raise ValueError("请输入6位二进制数字（0或1）")
        return binary_str
    
    def cast_hexagram(self, method="random", manual_input=None):
        """
        起卦
        
        Args:
            method: 起卦方式 ('random', 'time', 'manual')
            manual_input: 手动输入的二进制字符串
        
        Returns:
            卦象信息字典
        """
        if method == "random":
            binary_str = self.generate_hexagram_random()
        elif method == "time":
            binary_str = self.generate_hexagram_time()
        elif method == "manual":
            binary_str = self.generate_hexagram_manual(manual_input)
        else:
            raise ValueError("不支持的起卦方式")
        
        # 简化处理：使用卦序号1-64随机选择
        # 实际应用中应该有完整的二进制到卦序号映射
        hex_num = random.randint(1, min(64, len(HEXAGRAMS)))
        self.current_hexagram = get_hexagram_by_number(hex_num)
        
        return self.current_hexagram
    
    def interpret(self, question, prompt_type="cot", use_llm=False):
        """
        解卦
        
        Args:
            question: 占卜的问题
            prompt_type: 提示类型
            use_llm: 是否使用大语言模型（需要API）
        
        Returns:
            解卦结果
        """
        self.question = question
        
        if not self.current_hexagram:
            return "请先起卦"
        
        # 生成提示
        prompt = get_prompt(
            prompt_type,
            question,
            self.current_hexagram,
            self.changing_yao
        )
        
        if use_llm:
            # 这里可以调用实际的LLM API（如通义千问、ChatGPT等）
            # 参考Chapter 2的API调用方式
            result = self._call_llm(prompt)
        else:
            # 不使用LLM时，返回传统解读
            result = self._traditional_interpretation()
        
        return {
            "question": question,
            "hexagram": self.current_hexagram,
            "changing_yao": self.changing_yao,
            "prompt": prompt,
            "interpretation": result
        }
    
    def _call_llm(self, prompt):
        """调用大语言模型API"""
        # 这里可以集成实际的API调用
        # 例如：通义千问、智谱AI等
        # 参考dive-into-llms/documents/chapter2中的API调用示例
        
        try:
            # 示例：使用通义千问API
            # import dashscope
            # response = dashscope.Generation.call(
            #     model='qwen-turbo',
            #     prompt=prompt
            # )
            # return response.output.text
            
            return "（需要配置LLM API才能使用智能解读功能）"
        except Exception as e:
            return f"API调用失败: {str(e)}"
    
    def _traditional_interpretation(self):
        """传统解读（基于卦辞和爻辞）"""
        interpretation = f"""
【卦象】{self.current_hexagram['name']} - {self.current_hexagram['description']}

【卦辞】{self.current_hexagram['gua_ci']}

【象辞】{self.current_hexagram['xiang_ci']}

【解读】
{self._get_basic_interpretation()}

【爻辞参考】
"""
        for i, yao in enumerate(self.current_hexagram['yao_ci']):
            marker = " ← 动爻" if i in self.changing_yao else ""
            interpretation += f"{yao}{marker}\n"
        
        if self.changing_yao:
            interpretation += f"\n【动爻提示】\n"
            for yao_pos in self.changing_yao:
                interpretation += f"第{yao_pos+1}爻发动，需特别关注此爻的含义。\n"
        
        return interpretation
    
    def _get_basic_interpretation(self):
        """获取基础解读"""
        name = self.current_hexagram['name']
        
        # 简单的吉凶判断逻辑
        auspicious = ["乾", "坤", "泰", "既济", "大有", "谦"]
        moderate = ["屯", "蒙", "需", "讼"]
        
        if name in auspicious:
            return "此卦象征吉祥，事情发展顺利，但仍需谨慎行事，把握时机。"
        elif name in moderate:
            return "此卦提示需要耐心等待，不宜急进，顺应时势方为上策。"
        else:
            return "此卦需要仔细分析具体情况，结合卦辞和爻辞综合判断。"
    
    def display_hexagram(self):
        """显示卦象图形"""
        if not self.current_hexagram:
            return "尚未起卦"
        
        binary = self.current_hexagram.get('binary', '111111')
        lines = []
        
        yao_names = ["初", "二", "三", "四", "五", "上"]
        
        for i in range(5, -1, -1):  # 从上到下显示
            yao_type = "阳爻" if binary[i] == '1' else "阴爻"
            line = "━━━" if binary[i] == '1' else "━ ━"
            marker = " ← 动" if i in self.changing_yao else ""
            lines.append(f"{yao_names[i]}爻: {line} ({yao_type}){marker}")
        
        display = f"""
╔═══════════════════════╗
║   {self.current_hexagram['name']}卦 {self.current_hexagram['symbol']}   ║
║   {self.current_hexagram['description']}   ║
╠═══════════════════════╣
"""
        for line in lines:
            display += f"║ {line.ljust(20, ' ')} ║\n"
        
        display += "╚═══════════════════════╝"
        
        return display


def main():
    """主程序示例"""
    print("=" * 50)
    print("周易算命系统".center(46))
    print("=" * 50)
    
    divination = ZhouyiDivination()
    
    # 示例1: 随机起卦
    print("\n【示例1：随机起卦】")
    question = "我的事业发展如何？"
    print(f"问题：{question}")
    
    hexagram = divination.cast_hexagram(method="random")
    print(divination.display_hexagram())
    
    result = divination.interpret(question, prompt_type="cot")
    print(f"\n{result['interpretation']}")
    
    # 示例2: 时间起卦
    print("\n" + "=" * 50)
    print("\n【示例2：时间起卦】")
    question2 = "这次投资是否可行？"
    print(f"问题：{question2}")
    
    divination2 = ZhouyiDivination()
    hexagram2 = divination2.cast_hexagram(method="time")
    print(divination2.display_hexagram())
    
    result2 = divination2.interpret(question2, prompt_type="simple")
    print(f"\n{result2['interpretation']}")
    
    # 显示生成的提示（用于LLM调用）
    print("\n" + "=" * 50)
    print("\n【生成的思维链提示（可用于LLM）】")
    print(result['prompt'][:500] + "...")


if __name__ == "__main__":
    main()
