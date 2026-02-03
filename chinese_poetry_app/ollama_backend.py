"""
Ollama Backend Integration for Chinese Poetry App

This module provides functions to interact with Ollama API for:
- Poetry generation
- Poetry explanation
- Poetry continuation
- Q&A about poetry
"""

import requests
import json
from typing import Optional, Dict, Any


class OllamaBackend:
    """Ollama API backend for poetry generation"""
    
    def __init__(self, base_url: str = "http://localhost:11434", model_name: str = "qwen2.5:7b"):
        """
        Initialize Ollama backend
        
        Args:
            base_url: Ollama API endpoint
            model_name: Model to use (default: qwen2.5:7b)
        """
        self.base_url = base_url
        self.model_name = model_name
        self.api_url = f"{base_url}/api/generate"
    
    def _call_ollama(self, prompt: str, temperature: float = 0.7, max_tokens: int = 500) -> str:
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
    
    def generate_poetry(self, theme: str, style: str = "唐诗", length: int = 8) -> str:
        """
        Generate poetry based on theme
        
        Args:
            theme: Poetry theme (e.g., "春天", "思乡")
            style: Poetry style (e.g., "唐诗", "宋词")
            length: Number of lines
            
        Returns:
            Generated poetry
        """
        prompt = f"""你是一位精通中国古典诗词的诗人。请根据以下要求创作一首诗：

主题：{theme}
风格：{style}
长度：约{length}句

要求：
1. 符合{style}的格律和韵律
2. 意境优美，富有诗意
3. 只输出诗词内容，不要额外解释

请开始创作："""
        
        return self._call_ollama(prompt, temperature=0.8, max_tokens=300)
    
    def explain_poetry(self, poetry_text: str) -> str:
        """
        Explain the meaning of a poetry
        
        Args:
            poetry_text: The poetry text to explain
            
        Returns:
            Detailed explanation
        """
        prompt = f"""你是一位古诗词专家。请详细解释以下诗词：

{poetry_text}

请从以下几个方面进行解释：
1. 诗词的字面意思
2. 作者想要表达的情感和意境
3. 使用的修辞手法和艺术特色
4. 历史背景（如果知道的话）

请用通俗易懂的语言解释："""
        
        return self._call_ollama(prompt, temperature=0.5, max_tokens=600)
    
    def continue_poetry(self, first_line: str) -> str:
        """
        Continue poetry from the first line
        
        Args:
            first_line: The first line of poetry
            
        Returns:
            Continuation of the poetry
        """
        prompt = f"""你是一位古诗词专家。请为以下诗句接续下一句，要求：

上句：{first_line}

要求：
1. 保持韵律和格律
2. 意境连贯
3. 只输出下一句，不要解释

下句："""
        
        return self._call_ollama(prompt, temperature=0.7, max_tokens=100)
    
    def answer_question(self, question: str) -> str:
        """
        Answer questions about poetry
        
        Args:
            question: User's question
            
        Returns:
            Answer to the question
        """
        prompt = f"""你是一位古诗词专家。请回答以下关于古诗词的问题：

问题：{question}

请提供专业、详细的回答："""
        
        return self._call_ollama(prompt, temperature=0.6, max_tokens=500)
    
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


def get_ollama_backend(model_name: str = "qwen2.5:7b") -> OllamaBackend:
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
