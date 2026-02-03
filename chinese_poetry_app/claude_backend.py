"""
Claude API Backend Integration for Chinese Poetry App

This module provides functions to interact with Anthropic Claude API for:
- Poetry generation
- Poetry explanation
- Poetry continuation
- Q&A about poetry
"""

import os
from typing import Optional
from anthropic import Anthropic


class ClaudeBackend:
    """Claude API backend for poetry generation"""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-5-sonnet-20241022"):
        """
        Initialize Claude backend
        
        Args:
            api_key: Anthropic API key (if None, reads from ANTHROPIC_API_KEY env var)
            model: Claude model to use
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model = model
        
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not found. Please set it in environment or config.")
        
        self.client = Anthropic(api_key=self.api_key)
    
    def _call_claude(self, prompt: str, temperature: float = 0.7, max_tokens: int = 1024) -> str:
        """
        Internal method to call Claude API
        
        Args:
            prompt: The prompt to send
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text response
        """
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return message.content[0].text.strip()
            
        except Exception as e:
            return f"❌ Claude API 错误: {str(e)}"
    
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
1. 严格符合{style}的格律和韵律
2. 意境优美，富有诗意
3. 用词典雅，符合古典诗词风格
4. 只输出诗词内容，不要额外解释

请开始创作："""
        
        return self._call_claude(prompt, temperature=0.8, max_tokens=500)
    
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
1. **字面意思**：逐句解释诗词的表面含义
2. **情感意境**：作者想要表达的情感和营造的意境
3. **艺术手法**：使用的修辞手法、意象、对仗等艺术特色
4. **文化背景**：相关的历史背景或文化典故（如果有的话）

请用通俗易懂但不失专业的语言解释："""
        
        return self._call_claude(prompt, temperature=0.5, max_tokens=1500)
    
    def continue_poetry(self, first_line: str) -> str:
        """
        Continue poetry from the first line
        
        Args:
            first_line: The first line of poetry
            
        Returns:
            Continuation of the poetry
        """
        prompt = f"""你是一位古诗词专家。请为以下诗句接续下一句：

上句：{first_line}

要求：
1. 保持韵律和格律
2. 意境连贯自然
3. 符合古典诗词的对仗和平仄规则
4. 只输出下一句诗，不要解释

下句："""
        
        return self._call_claude(prompt, temperature=0.7, max_tokens=100)
    
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

请提供专业、详细且易懂的回答。如果涉及具体诗词，请举例说明。"""
        
        return self._call_claude(prompt, temperature=0.6, max_tokens=1500)
    
    def check_connection(self) -> bool:
        """
        Check if Claude API is available
        
        Returns:
            True if connected, False otherwise
        """
        try:
            # Simple test call
            self.client.messages.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "test"}]
            )
            return True
        except:
            return False


# Singleton instance
_claude_backend: Optional[ClaudeBackend] = None


def get_claude_backend(api_key: Optional[str] = None, model: str = "claude-3-5-sonnet-20241022") -> ClaudeBackend:
    """
    Get or create Claude backend instance
    
    Args:
        api_key: Anthropic API key
        model: Claude model to use
        
    Returns:
        ClaudeBackend instance
    """
    global _claude_backend
    if _claude_backend is None:
        _claude_backend = ClaudeBackend(api_key=api_key, model=model)
    return _claude_backend
