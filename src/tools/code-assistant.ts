import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Code Assistant tool definitions
export const codeAssistantTools: Tool[] = [
    {
        name: 'code_analyze',
        description: '分析Python或JavaScript代码的结构、复杂度、质量问题和潜在改进点。提供详细的代码分析报告，包括性能、可读性、最佳实践等方面的评估。',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: '要分析的代码内容',
                },
                language: {
                    type: 'string',
                    description: '代码语言',
                    enum: ['python', 'javascript'],
                },
                focus: {
                    type: 'string',
                    description: '分析重点(可选)',
                    enum: ['performance', 'readability', 'security', 'all'],
                },
            },
            required: ['code', 'language'],
        },
    },
    {
        name: 'code_generate',
        description: '根据自然语言描述生成Python或JavaScript代码。支持生成函数、类、组件等各种代码结构，可指定代码风格。',
        inputSchema: {
            type: 'object',
            properties: {
                description: {
                    type: 'string',
                    description: '代码需求描述，详细说明要实现的功能',
                },
                language: {
                    type: 'string',
                    description: '目标编程语言',
                    enum: ['python', 'javascript'],
                },
                style: {
                    type: 'string',
                    description: '代码风格(可选)',
                    enum: ['functional', 'object-oriented', 'clean'],
                },
            },
            required: ['description', 'language'],
        },
    },
    {
        name: 'code_improve',
        description: '优化和重构现有代码，提供性能改进、可读性提升、安全性增强等方面的具体建议和优化后的代码。',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: '需要优化的代码',
                },
                language: {
                    type: 'string',
                    description: '代码语言',
                    enum: ['python', 'javascript'],
                },
                goal: {
                    type: 'string',
                    description: '优化目标',
                    enum: ['performance', 'readability', 'security', 'maintainability'],
                },
            },
            required: ['code', 'language', 'goal'],
        },
    },
    {
        name: 'code_explain',
        description: '详细解释代码的工作原理、逻辑流程和实现细节。适合学习理解复杂代码或向他人讲解代码功能。',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: '要解释的代码',
                },
                language: {
                    type: 'string',
                    description: '代码语言',
                    enum: ['python', 'javascript'],
                },
                level: {
                    type: 'string',
                    description: '解释详细程度',
                    enum: ['beginner', 'intermediate', 'expert'],
                    default: 'intermediate',
                },
            },
            required: ['code', 'language'],
        },
    },
    {
        name: 'code_debug',
        description: '识别代码中的Bug、逻辑错误或潜在问题，提供详细的问题分析和修复建议。支持调试运行时错误和逻辑错误。',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: '有问题的代码',
                },
                language: {
                    type: 'string',
                    description: '代码语言',
                    enum: ['python', 'javascript'],
                },
                error_message: {
                    type: 'string',
                    description: '错误信息(如果有)',
                },
                expected_behavior: {
                    type: 'string',
                    description: '期望的行为(可选)',
                },
            },
            required: ['code', 'language'],
        },
    },
    {
        name: 'code_test_generate',
        description: '为给定代码自动生成单元测试。支持pytest、unittest(Python)和Jest、Mocha(JavaScript)等测试框架。',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: '要生成测试的代码',
                },
                language: {
                    type: 'string',
                    description: '代码语言',
                    enum: ['python', 'javascript'],
                },
                framework: {
                    type: 'string',
                    description: '测试框架(可选)',
                    enum: ['pytest', 'unittest', 'jest', 'mocha'],
                },
            },
            required: ['code', 'language'],
        },
    },
    {
        name: 'code_review',
        description: '全面审查代码质量，包括最佳实践遵循度、安全漏洞、性能问题、代码异味等。提供优先级排序的改进建议。',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: '要审查的代码',
                },
                language: {
                    type: 'string',
                    description: '代码语言',
                    enum: ['python', 'javascript'],
                },
                focus: {
                    type: 'string',
                    description: '审查重点(可选)',
                },
            },
            required: ['code', 'language'],
        },
    },
    {
        name: 'code_complete',
        description: '智能补全未完成的代码，根据上下文和代码意图生成后续代码。适用于函数补全、逻辑补全等场景。',
        inputSchema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: '未完成的代码',
                },
                language: {
                    type: 'string',
                    description: '代码语言',
                    enum: ['python', 'javascript'],
                },
                context: {
                    type: 'string',
                    description: '额外的上下文信息(可选)',
                },
            },
            required: ['code', 'language'],
        },
    },
];

// Helper function to get language-specific rules
function getLanguageRules(language: 'python' | 'javascript'): string {
    if (language === 'python') {
        return `   - **PEP 8代码风格**：命名规范、缩进、空格使用
   - **类型注解**：函数参数和返回值的类型提示
   - **异常处理**：适当的try-except使用
   - **Pythonic写法**：列表推导、生成器、装饰器等特性
   - **标准库利用**：充分使用内置函数和标准库
   - **文档字符串**：函数和类的docstring完整性`;
    } else {
        return `   - **ESLint规则**：代码风格和质量规范
   - **现代JavaScript**：ES6+特性使用(箭头函数、解构、模板字符串等)
   - **异步处理**：Promise、async/await的正确使用
   - **错误处理**：try-catch和错误边界
   - **函数式编程**：map、filter、reduce等高阶函数
   - **模块化**：import/export的合理组织`;
    }
}

// Helper function to get style guide
function getStyleGuide(language: string, style?: string): string {
    const guides: Record<string, Record<string, string>> = {
        python: {
            functional: '使用纯函数、不可变数据结构、高阶函数等函数式编程范式',
            'object-oriented': '使用类、继承、封装等面向对象设计原则',
            clean: '遵循Clean Code原则：简洁、可读、单一职责',
        },
        javascript: {
            functional: '使用纯函数、不可变性、组合等函数式编程风格',
            'object-oriented': '使用ES6类、原型链、设计模式',
            clean: '遵循Clean Code和SOLID原则',
        },
    };

    if (style && guides[language] && guides[language][style]) {
        return guides[language][style];
    }
    return '遵循该语言的最佳实践和通用编程规范';
}

// Helper function to get code examples
function getCodeExample(language: string, type: string): string {
    const examples: Record<string, Record<string, string>> = {
        python: {
            good: `# 良好示例
def calculate_average(numbers: list[float]) -> float:
    """计算数字列表的平均值
    
    Args:
        numbers: 数字列表
        
    Returns:
        平均值
        
    Raises:
        ValueError: 如果列表为空
    """
    if not numbers:
        raise ValueError("列表不能为空")
    return sum(numbers) / len(numbers)`,
            bad: `# 不良示例
def calc(n):
    return sum(n)/len(n)  # 缺少类型注解、文档、错误处理`,
        },
        javascript: {
            good: `// 良好示例
const calculateAverage = (numbers) => {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        throw new Error('数组不能为空');
    }
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};`,
            bad: `// 不良示例
function calc(n) {
    return n.reduce((a,b)=>a+b)/n.length;  // 缺少验证、可读性差
}`,
        },
    };

    return examples[language]?.[type] || '';
}

// Code Assistant tool handlers
export async function handleCodeAssistantTool(name: string, args: any) {
    switch (name) {
        case 'code_analyze': {
            const { code, language, focus = 'all' } = args;
            const rules = getLanguageRules(language);

            return {
                content: [
                    {
                        type: 'text',
                        text: `【代码分析任务】

你是一位精通${language === 'python' ? 'Python' : 'JavaScript'}的资深软件工程师。请对以下代码进行深入分析：

\`\`\`${language}
${code}
\`\`\`

分析重点：${focus === 'all' ? '全方位分析' : focus}

请从以下方面进行详细分析：

1. **代码结构分析**：
   - 整体架构和组织方式
   - 模块化程度和代码复用
   - 设计模式的使用(如有)
   - 函数/类的职责划分

2. **代码质量评估**：
   - 可读性和可维护性
   - 命名规范(变量、函数、类等)
   - 注释和文档完整性
   - 代码复杂度(圈复杂度、认知复杂度)

3. **性能分析**：
   - 时间复杂度分析
   - 空间复杂度分析
   - 潜在性能瓶颈
   - 优化建议

4. **潜在问题识别**：
   - Bug风险点
   - 边界条件处理
   - 错误处理机制
   - 资源管理(内存泄漏、文件句柄等)
   - 并发安全性(如适用)

5. **最佳实践符合度**：
${rules}

6. **安全性审查**：
   - 输入验证
   - SQL注入/XSS等常见漏洞(如适用)
   - 敏感数据处理
   - 依赖安全

7. **改进建议**：
   - 按优先级排序的具体改进点
   - 每个建议包含：问题描述、影响、改进方案
   - 代码示例(如需要)

请提供专业、详细且可操作的分析报告。`,
                    },
                ],
            };
        }

        case 'code_generate': {
            const { description, language, style } = args;
            const styleGuide = getStyleGuide(language, style);

            return {
                content: [
                    {
                        type: 'text',
                        text: `【代码生成任务】

你是一位经验丰富的${language === 'python' ? 'Python' : 'JavaScript'}开发者。请根据以下需求生成高质量代码：

**需求描述**：
${description}

**目标语言**：${language}
**代码风格**：${styleGuide}

请按照以下要求生成代码：

1. **功能完整性**：
   - 完全实现描述的功能
   - 考虑边界情况和异常处理
   - 提供必要的辅助函数

2. **代码质量**：
   - 清晰的命名(变量、函数、类)
   - 适当的注释和文档字符串
   - 遵循${language}最佳实践
   - 代码结构清晰，易于维护

3. **技术要求**：
${getLanguageRules(language)}

4. **输出格式**：
   - 完整的可运行代码
   - 必要的导入/引用语句
   - 使用示例(如适用)
   - 简要说明

${getCodeExample(language, 'good')}

请开始生成代码：`,
                    },
                ],
            };
        }

        case 'code_improve': {
            const { code, language, goal } = args;
            const goalDescriptions: Record<string, string> = {
                performance: '性能优化 - 减少时间/空间复杂度，提高执行效率',
                readability: '可读性提升 - 改善代码结构，增强可维护性',
                security: '安全性增强 - 修复安全漏洞，加强防护',
                maintainability: '可维护性改进 - 降低耦合，提高内聚性',
            };

            return {
                content: [
                    {
                        type: 'text',
                        text: `【代码优化任务】

你是一位代码重构专家。请优化以下${language}代码：

\`\`\`${language}
${code}
\`\`\`

**优化目标**：${goalDescriptions[goal]}

请按照以下步骤进行优化：

1. **现状分析**：
   - 识别当前代码在${goal}方面的问题
   - 分析问题的根本原因
   - 评估优化的必要性和影响

2. **优化方案**：
   - 提出具体的优化策略
   - 说明为什么这些改进有效
   - 权衡优化的利弊

3. **优化后的代码**：
   - 提供完整的重构代码
   - 突出显示关键改进点
   - 保持功能等价性

4. **改进对比**：
   - Before vs After 关键指标对比
   - 量化改进效果(如可能)
   - 说明改进的具体体现

5. **注意事项**：
   - 可能的副作用
   - 需要额外的测试点
   - 部署或迁移建议

请确保优化后的代码遵循${language}最佳实践，并保持原有功能不变。`,
                    },
                ],
            };
        }

        case 'code_explain': {
            const { code, language, level = 'intermediate' } = args;
            const levelDescriptions: Record<string, string> = {
                beginner: '初学者 - 详细解释每个概念，使用简单语言',
                intermediate: '中级开发者 - 解释核心逻辑和技术要点',
                expert: '专家级 - 深入分析设计思想和高级技巧',
            };

            return {
                content: [
                    {
                        type: 'text',
                        text: `【代码讲解任务】

你是一位善于讲解的编程导师。请为${levelDescriptions[level]}解释以下${language}代码：

\`\`\`${language}
${code}
\`\`\`

**讲解层次**：${levelDescriptions[level]}

请按照以下结构进行讲解：

1. **整体概述** (30秒电梯演讲)：
   - 这段代码做什么？
   - 主要解决什么问题？
   - 核心思想是什么？

2. **逐行/逐块解释**：
   - 代码的执行流程
   - 每个重要部分的作用
   - 关键变量和数据结构
   ${level === 'beginner' ? '   - 涉及的基础概念解释' : ''}

3. **技术要点**：
   - 使用的${language}特性或语法
   - 算法或数据结构(如有)
   - 设计模式(如有)
   ${level === 'expert' ? '   - 高级技巧和优化策略\n   - 可能的替代实现方式' : ''}

4. **示例说明**：
   - 通过具体输入输出示例演示
   - 边界情况的处理
   - 常见使用场景

5. **知识扩展** (如适用)：
   - 相关的编程概念
   - 进一步学习的方向
   ${level === 'expert' ? '   - 性能特性和权衡考虑' : ''}

请用${level === 'beginner' ? '通俗易懂' : level === 'expert' ? '专业深入' : '清晰明了'}的语言进行讲解。`,
                    },
                ],
            };
        }

        case 'code_debug': {
            const { code, language, error_message, expected_behavior } = args;

            return {
                content: [
                    {
                        type: 'text',
                        text: `【代码调试任务】

你是一位经验丰富的调试专家。请帮助诊断和修复以下${language}代码的问题：

\`\`\`${language}
${code}
\`\`\`

${error_message ? `**错误信息**：\n${error_message}\n` : ''}
${expected_behavior ? `**期望行为**：\n${expected_behavior}\n` : ''}

请按照以下步骤进行调试：

1. **问题诊断**：
   - 分析错误的根本原因
   - 识别问题发生的位置
   - 理解为什么会出现这个问题
   ${error_message ? '   - 解读错误信息的含义' : ''}

2. **问题重现**：
   - 描述问题的触发条件
   - 可能的输入导致错误
   - 边界情况分析

3. **修复方案**：
   - 提供修复后的完整代码
   - 突出显示修改的部分
   - 解释为什么这样修复有效

4. **验证建议**：
   - 如何测试修复是否成功
   - 需要测试的场景
   - 预防类似问题的建议

5. **根因分析** (如适用)：
   - 为什么会写出有问题的代码
   - 常见的陷阱和误区
   - 如何避免未来犯类似错误

请提供清晰的问题分析和可靠的修复方案。`,
                    },
                ],
            };
        }

        case 'code_test_generate': {
            const { code, language, framework } = args;
            const defaultFramework = language === 'python' ? 'pytest' : 'jest';
            const testFramework = framework || defaultFramework;

            return {
                content: [
                    {
                        type: 'text',
                        text: `【测试生成任务】

你是一位测试驱动开发(TDD)专家。请为以下${language}代码生成全面的单元测试：

\`\`\`${language}
${code}
\`\`\`

**测试框架**：${testFramework}

请生成包含以下内容的测试代码：

1. **测试结构**：
   - 使用${testFramework}框架
   - 清晰的测试组织(describe/test或class/method)
   - 适当的test fixture和setup/teardown

2. **测试覆盖**：
   - **正常流程测试**：典型使用场景
   - **边界条件测试**：空值、极值、临界点
   - **异常情况测试**：错误输入、异常抛出
   - **性能测试**(如适用)：时间/空间复杂度验证

3. **测试用例设计**：
   - 每个测试用例有明确的目的
   - 使用AAA模式(Arrange-Act-Assert)
   - 测试名称清晰描述测试内容
   - 包含必要的断言(assertions)

4. **测试数据**：
   - 提供多样化的测试数据
   - 包含正常值、边界值、异常值
   - 使用参数化测试(如适用)

5. **Mock和Stub**(如需要)：
   - 外部依赖的模拟
   - 副作用的隔离

示例测试结构：
${language === 'python'
                                ? `\`\`\`python
import pytest

def test_function_normal_case():
    # Arrange
    input_data = ...
    expected = ...
    
    # Act
    result = function(input_data)
    
    # Assert
    assert result == expected

def test_function_edge_case():
    ...

def test_function_error_handling():
    with pytest.raises(ValueError):
        function(invalid_input)
\`\`\``
                                : `\`\`\`javascript
describe('functionName', () => {
    test('should handle normal case', () => {
        // Arrange
        const input = ...;
        const expected = ...;
        
        // Act
        const result = functionName(input);
        
        // Assert
        expect(result).toBe(expected);
    });
    
    test('should handle edge case', () => {
        ...
    });
    
    test('should throw error for invalid input', () => {
        expect(() => functionName(invalid)).toThrow();
    });
});
\`\`\``
                            }

请生成完整的、可直接运行的测试代码。`,
                    },
                ],
            };
        }

        case 'code_review': {
            const { code, language, focus } = args;

            return {
                content: [
                    {
                        type: 'text',
                        text: `【代码审查任务】

你是一位资深代码审查专家。请对以下${language}代码进行全面的代码审查：

\`\`\`${language}
${code}
\`\`\`

${focus ? `**审查重点**：${focus}\n` : ''}

请按照以下维度进行详细审查：

1. **代码质量** ⭐⭐⭐⭐⭐：
   - [ ] 可读性和可维护性
   - [ ] 命名规范(变量、函数、类)
   - [ ] 代码组织和结构
   - [ ] 注释和文档质量
   - [ ] DRY原则遵循(不重复代码)

2. **功能正确性** ⭐⭐⭐⭐⭐：
   - [ ] 逻辑正确性
   - [ ] 边界条件处理
   - [ ] 错误处理机制
   - [ ] 输入验证
   - [ ] 预期行为实现

3. **性能** ⭐⭐⭐⭐：
   - [ ] 算法效率
   - [ ] 资源使用(内存、CPU)
   - [ ] 潜在性能瓶颈
   - [ ] 不必要的计算

4. **安全性** ⭐⭐⭐⭐⭐：
   - [ ] 输入验证和清理
   - [ ] SQL注入/XSS等漏洞
   - [ ] 敏感数据处理
   - [ ] 权限和访问控制
   - [ ] 依赖安全性

5. **最佳实践** ⭐⭐⭐⭐：
${getLanguageRules(language)}
   - [ ] SOLID原则遵循
   - [ ] 错误处理模式
   - [ ] 测试覆盖

6. **设计** ⭐⭐⭐：
   - [ ] 单一职责原则
   - [ ] 耦合度评估
   - [ ] 可扩展性
   - [ ] 设计模式使用

7. **代码异味识别**：
   - 过长的函数/类
   - 过多的参数
   - 重复代码
   - 魔法数字/字符串
   - 不当的注释

**审查报告格式**：

📋 **审查总结**
- 总体评分：X/10
- 关键问题数：X个
- 建议改进数：X个

🔴 **严重问题** (必须修复)：
1. [问题描述]
   - 位置：[代码行]
   - 影响：[说明影响]
   - 修复建议：[具体方案]

🟡 **需要改进** (强烈建议)：
...

🟢 **优化建议** (可选)：
...

✅ **优点**：
- [列出代码的优秀之处]

📝 **总体建议**：
[综合改进建议和下一步行动]

请提供客观、建设性的审查意见。`,
                    },
                ],
            };
        }

        case 'code_complete': {
            const { code, language, context } = args;

            return {
                content: [
                    {
                        type: 'text',
                        text: `【代码补全任务】

你是一位智能代码助手。请补全以下${language}代码：

\`\`\`${language}
${code}
\`\`\`

${context ? `**上下文信息**：\n${context}\n` : ''}

请按照以下要求进行代码补全：

1. **理解意图**：
   - 分析现有代码的逻辑和目的
   - 推断缺失部分应该实现的功能
   - 考虑代码的整体上下文

2. **补全策略**：
   - 保持与现有代码风格一致
   - 遵循${language}最佳实践
   - 实现合理的默认行为
   - 考虑边界条件和错误处理

3. **输出格式**：
   - 提供完整的补全后代码
   - 用注释标注补全的部分
   - 简要说明补全的逻辑
   - 多个可能的补全方案(如适用)

4. **质量保证**：
   - 补全代码应该是可运行的
   - 逻辑完整且合理
   - 符合编码规范
   - 类型安全(如适用)

示例：
如果输入是未完成的函数：
\`\`\`${language}
def process_data(data):
    # TODO: 实现数据处理逻辑
\`\`\`

则应该提供完整的实现，包括：
- 参数验证
- 核心处理逻辑
- 错误处理
- 返回值

请提供智能的、符合代码意图的补全方案。`,
                    },
                ],
            };
        }

        default:
            throw new Error(`Unknown code assistant tool: ${name}`);
    }
}
