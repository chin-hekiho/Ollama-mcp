import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_TIMEOUT = 60000;

interface OllamaGenerateResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

// Ollama tool definitions
export const ollamaTools: Tool[] = [
    {
        name: 'ollama_serve',
        description: 'Start Ollama server',
        inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_create',
        description: 'Create a model from a Modelfile',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name for the model' },
                modelfile: { type: 'string', description: 'Path to Modelfile' },
            },
            required: ['name', 'modelfile'],
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_show',
        description: 'Show information for a model',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the model' },
            },
            required: ['name'],
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_run',
        description: 'Run a model',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the model' },
                prompt: { type: 'string', description: 'Prompt to send to the model' },
                timeout: {
                    type: 'number',
                    description: 'Timeout in milliseconds (default: 60000)',
                    minimum: 1000,
                },
            },
            required: ['name', 'prompt'],
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_pull',
        description: 'Pull a model from a registry',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the model to pull' },
            },
            required: ['name'],
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_push',
        description: 'Push a model to a registry',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the model to push' },
            },
            required: ['name'],
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_list',
        description: 'List models',
        inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_cp',
        description: 'Copy a model',
        inputSchema: {
            type: 'object',
            properties: {
                source: { type: 'string', description: 'Source model name' },
                destination: { type: 'string', description: 'Destination model name' },
            },
            required: ['source', 'destination'],
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_rm',
        description: 'Remove a model',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the model to remove' },
            },
            required: ['name'],
            additionalProperties: true,
        },
    },
    {
        name: 'ollama_chat_completion',
        description: 'OpenAI-compatible chat completion API',
        inputSchema: {
            type: 'object',
            properties: {
                model: { type: 'string', description: 'Name of the Ollama model to use' },
                messages: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            role: { type: 'string', enum: ['system', 'user', 'assistant'] },
                            content: { type: 'string' },
                        },
                        required: ['role', 'content'],
                    },
                    description: 'Array of messages in the conversation',
                },
                temperature: {
                    type: 'number',
                    description: 'Sampling temperature (0-2)',
                    minimum: 0,
                    maximum: 2,
                },
                timeout: {
                    type: 'number',
                    description: 'Timeout in milliseconds (default: 60000)',
                    minimum: 1000,
                },
            },
            required: ['model', 'messages'],
            additionalProperties: true,
        },
    },
];

// Ollama tool handlers
export async function handleOllamaTool(name: string, args: any) {
    const formatError = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        return String(error);
    };

    switch (name) {
        case 'ollama_serve': {
            try {
                const { stdout, stderr } = await execAsync('ollama serve');
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to start Ollama server: ${formatError(error)}`);
            }
        }

        case 'ollama_create': {
            try {
                const { stdout, stderr } = await execAsync(`ollama create ${args.name} -f ${args.modelfile}`);
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to create model: ${formatError(error)}`);
            }
        }

        case 'ollama_show': {
            try {
                const { stdout, stderr } = await execAsync(`ollama show ${args.name}`);
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to show model info: ${formatError(error)}`);
            }
        }

        case 'ollama_run': {
            try {
                const response = await axios.post<OllamaGenerateResponse>(
                    `${OLLAMA_HOST}/api/generate`,
                    {
                        model: args.name,
                        prompt: args.prompt,
                        stream: false,
                    },
                    {
                        timeout: args.timeout || DEFAULT_TIMEOUT,
                    }
                );
                return { content: [{ type: 'text', text: response.data.response }] };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new McpError(
                        ErrorCode.InternalError,
                        `Ollama API error: ${error.response?.data?.error || error.message}`
                    );
                }
                throw new McpError(ErrorCode.InternalError, `Failed to run model: ${formatError(error)}`);
            }
        }

        case 'ollama_pull': {
            try {
                const { stdout, stderr } = await execAsync(`ollama pull ${args.name}`);
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to pull model: ${formatError(error)}`);
            }
        }

        case 'ollama_push': {
            try {
                const { stdout, stderr } = await execAsync(`ollama push ${args.name}`);
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to push model: ${formatError(error)}`);
            }
        }

        case 'ollama_list': {
            try {
                const { stdout, stderr } = await execAsync('ollama list');
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to list models: ${formatError(error)}`);
            }
        }

        case 'ollama_cp': {
            try {
                const { stdout, stderr } = await execAsync(`ollama cp ${args.source} ${args.destination}`);
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to copy model: ${formatError(error)}`);
            }
        }

        case 'ollama_rm': {
            try {
                const { stdout, stderr } = await execAsync(`ollama rm ${args.name}`);
                return { content: [{ type: 'text', text: stdout || stderr }] };
            } catch (error) {
                throw new McpError(ErrorCode.InternalError, `Failed to remove model: ${formatError(error)}`);
            }
        }

        case 'ollama_chat_completion': {
            try {
                const prompt = args.messages
                    .map((msg: any) => {
                        switch (msg.role) {
                            case 'system':
                                return `System: ${msg.content}\n`;
                            case 'user':
                                return `User: ${msg.content}\n`;
                            case 'assistant':
                                return `Assistant: ${msg.content}\n`;
                            default:
                                return '';
                        }
                    })
                    .join('');

                const response = await axios.post<OllamaGenerateResponse>(
                    `${OLLAMA_HOST}/api/generate`,
                    {
                        model: args.model,
                        prompt,
                        stream: false,
                        temperature: args.temperature,
                        raw: true,
                    },
                    {
                        timeout: args.timeout || DEFAULT_TIMEOUT,
                    }
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(
                                {
                                    id: 'chatcmpl-' + Date.now(),
                                    object: 'chat.completion',
                                    created: Math.floor(Date.now() / 1000),
                                    model: args.model,
                                    choices: [
                                        {
                                            index: 0,
                                            message: {
                                                role: 'assistant',
                                                content: response.data.response,
                                            },
                                            finish_reason: 'stop',
                                        },
                                    ],
                                },
                                null,
                                2
                            ),
                        },
                    ],
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    throw new McpError(
                        ErrorCode.InternalError,
                        `Ollama API error: ${error.response?.data?.error || error.message}`
                    );
                }
                throw new McpError(ErrorCode.InternalError, `Unexpected error: ${formatError(error)}`);
            }
        }

        default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown Ollama tool: ${name}`);
    }
}
