"""
Ollama Backend Integration for Zhouyi Divination App

This module provides functions to interact with Ollama API for:
- Hexagram casting and interpretation
- Divination Q&A
- Traditional Zhouyi wisdom
"""

import requests
import json
from typing import Optional, Dict, Any, List


class OllamaBackend:
    """Ollama API backend for Zhouyi divination"""
    
    def __init__(self, base_url: str = "http://localhost:11434", model_name: str = "qwen2.5:latest"):
        """
        Initialize Ollama backend
        
        Args:
            base_url: Ollama API endpoint
            model_name: Model to use (default: qwen2.5:latest)
        """
        self.base_url = base_url
        self.model_name = model_name
        self.api_url = f"{base_url}/api/generate"
    
    def _call_ollama(self, prompt: str, temperature: float = 0.7, max_tokens: int = 1500) -> str:
        """
        Internal method to call Ollama API
        
        Args:
            prompt: The prompt to send
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text response
        """
        try:
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens
                }
            }
            
            response = requests.post(self.api_url, json=payload, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            return result.get("response", "").strip()
            
        except requests.exceptions.ConnectionError:
            return "❌ 无法连接到 Ollama 服务。请确保 Ollama 正在运行 (ollama serve)"
        except requests.exceptions.Timeout:
            return "⏱️ 请求超时，请重试"
        except Exception as e:
            return f"❌ 错误: {str(e)}"
    
    def cast_and_interpret(self, question: str, method: str = "random", 
                          prompt_type: str = "cot") -> str:
        """
        Cast hexagram and provide interpretation
        
        Args:
            question: The question for divination
            method: Casting method ('random', 'time', 'manual')
            prompt_type: Prompt type ('zero_shot', 'few_shot', 'cot', 'simple')
            
        Returns:
            Complete divination result with interpretation
        """
        # Import here to avoid circular dependency
        from zhouyi_system import ZhouyiDivination
        
        divination = ZhouyiDivination()
        hexagram = divination.cast_hexagram(method=method)
        
        # Get the prompt from the system
        from prompts import get_prompt
        prompt = get_prompt(prompt_type, question, hexagram, divination.changing_yao)
        
        # Call Ollama for interpretation
        interpretation = self._call_ollama(prompt, temperature=0.7, max_tokens=1500)
        
        # Format the complete result
        result = f"""【问题】{question}

【起卦方式】{method}

{divination.display_hexagram()}

【AI解读】
{interpretation}

【传统解读】
{divination._traditional_interpretation()}
"""
        return result
    
    def interpret_hexagram(self, question: str, hexagram_info: Dict[str, Any], 
                          changing_yao: List[int], prompt_type: str = "cot") -> str:
        """
        Interpret an existing hexagram
        
        Args:
            question: The question for divination
            hexagram_info: Hexagram information dictionary
            changing_yao: List of changing yao positions
            prompt_type: Prompt type for interpretation
            
        Returns:
            Interpretation result
        """
        from prompts import get_prompt
        prompt = get_prompt(prompt_type, question, hexagram_info, changing_yao)
        
        return self._call_ollama(prompt, temperature=0.7, max_tokens=1500)
    
    def answer_question(self, question: str) -> str:
        """
        Answer questions about Zhouyi
        
        Args:
            question: User's question about Zhouyi
            
        Returns:
            Answer to the question
        """
        prompt = f"""你是一位精通《周易》的专家。请回答以下关于周易的问题：

问题：{question}

请提供专业、详细的回答，包括：
1. 直接回答问题
2. 相关的周易知识背景
3. 实际应用建议（如适用）

请用通俗易懂的语言解释："""
        
        return self._call_ollama(prompt, temperature=0.6, max_tokens=1000)
    
    def explain_hexagram(self, hexagram_name: str) -> str:
        """
        Explain a specific hexagram in detail
        
        Args:
            hexagram_name: Name of the hexagram
            
        Returns:
            Detailed explanation
        """
        from knowledge_base import HEXAGRAMS
        
        # Find hexagram by name
        hexagram = None
        for hex_info in HEXAGRAMS.values():
            if hex_info['name'] == hexagram_name:
                hexagram = hex_info
                break
        
        if not hexagram:
            return f"未找到名为'{hexagram_name}'的卦象"
        
        prompt = f"""你是一位周易专家。请详细解释以下卦象：

卦名：{hexagram['name']} - {hexagram['description']}
卦辞：{hexagram['gua_ci']}
象辞：{hexagram['xiang_ci']}

请从以下方面进行解释：
1. 卦象的基本含义和象征
2. 卦辞的深层含义
3. 象辞给出的人生智慧
4. 这个卦在不同情况下的应用
5. 历史上的经典案例（如果知道）

请用通俗易懂但专业的语言解释："""
        
        return self._call_ollama(prompt, temperature=0.6, max_tokens=1500)
    
    def check_connection(self) -> bool:
        """
        Check if Ollama service is available
        
        Returns:
            True if connected, False otherwise
        """
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False


# Singleton instance
_ollama_backend: Optional[OllamaBackend] = None


def get_ollama_backend(model_name: str = "qwen2.5:latest") -> OllamaBackend:
    """
    Get or create Ollama backend instance
    
    Args:
        model_name: Model to use
        
    Returns:
        OllamaBackend instance
    """
    global _ollama_backend
    if _ollama_backend is None:
        _ollama_backend = OllamaBackend(model_name=model_name)
    return _ollama_backend
