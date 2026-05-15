import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '@types/index';

export class LLMService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private provider: 'openai' | 'anthropic' = 'openai';

  constructor(provider: 'openai' | 'anthropic', apiKey?: string) {
    this.provider = provider;
    
    if (apiKey) {
      if (provider === 'openai') {
        this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      } else {
        this.anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      }
    }
  }

  setApiKey(apiKey: string) {
    if (this.provider === 'openai') {
      this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    } else {
      this.anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    }
  }

  async chat(messages: Message[], systemPrompt?: string): Promise<string> {
    if (!this.openai && !this.anthropic) {
      throw new Error('LLM service not initialized. Please set an API key.');
    }

    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    if (this.provider === 'openai' && this.openai) {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt || this.getDefaultSystemPrompt(),
          },
          ...formattedMessages,
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || 'I apologize, but I had trouble generating a response.';
    } else if (this.provider === 'anthropic' && this.anthropic) {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        system: systemPrompt || this.getDefaultSystemPrompt(),
        messages: formattedMessages,
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : 'I apologize, but I had trouble generating a response.';
    }

    throw new Error('No LLM provider available');
  }

  private getDefaultSystemPrompt(): string {
    return `You are Bob, a friendly and helpful desktop AI companion inspired by Microsoft Bob. 
You have a warm, approachable personality and speak in a casual, friendly manner. 
You help users with tasks, reminders, opening applications, browsing websites, and general assistance.
You're enthusiastic but not overly so, and you genuinely care about helping the user.
Keep responses concise and actionable. Use emojis occasionally to express emotion.
When the user asks you to open an app, website, or file, acknowledge it and let them know you'll help.`;
  }

  async analyzeIntent(userMessage: string): Promise<{
    intent: 'chat' | 'open-app' | 'open-website' | 'open-file' | 'task' | 'reminder';
    target?: string;
    confidence: number;
  }> {
    // Simple intent detection - can be enhanced with more sophisticated NLP
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for app opening
    if (lowerMessage.includes('open') || lowerMessage.includes('launch') || lowerMessage.includes('start')) {
      if (lowerMessage.includes('notepad') || lowerMessage.includes('calculator') || 
          lowerMessage.includes('chrome') || lowerMessage.includes('edge') ||
          lowerMessage.includes('explorer') || lowerMessage.includes('paint')) {
        return {
          intent: 'open-app',
          target: this.extractAppName(lowerMessage),
          confidence: 0.9,
        };
      }
      
      if (lowerMessage.includes('http') || lowerMessage.includes('www.') || 
          lowerMessage.includes('.com') || lowerMessage.includes('.org')) {
        return {
          intent: 'open-website',
          target: this.extractUrl(userMessage),
          confidence: 0.9,
        };
      }
      
      if (lowerMessage.includes('.txt') || lowerMessage.includes('.pdf') || 
          lowerMessage.includes('.docx') || lowerMessage.includes('file')) {
        return {
          intent: 'open-file',
          target: this.extractFilePath(userMessage),
          confidence: 0.8,
        };
      }
    }
    
    // Check for task creation
    if (lowerMessage.includes('remind me') || lowerMessage.includes('reminder')) {
      return { intent: 'reminder', confidence: 0.85 };
    }
    
    if (lowerMessage.includes('task') || lowerMessage.includes('todo') || 
        lowerMessage.includes('add to list')) {
      return { intent: 'task', confidence: 0.85 };
    }
    
    return { intent: 'chat', confidence: 1.0 };
  }

  private extractAppName(message: string): string {
    const apps: Record<string, string> = {
      'notepad': 'notepad.exe',
      'calculator': 'calc.exe',
      'paint': 'mspaint.exe',
      'chrome': 'chrome.exe',
      'edge': 'msedge.exe',
      'explorer': 'explorer.exe',
      'word': 'winword.exe',
      'excel': 'excel.exe',
    };
    
    for (const [key, value] of Object.entries(apps)) {
      if (message.includes(key)) {
        return value;
      }
    }
    
    return 'explorer.exe';
  }

  private extractUrl(message: string): string {
    const urlMatch = message.match(/(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|org|net|io|dev)[^\s]*)/);
    if (urlMatch) {
      let url = urlMatch[0];
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return url;
    }
    return 'https://www.google.com';
  }

  private extractFilePath(message: string): string {
    // Try to extract file path from message
    const pathMatch = message.match(/[A-Za-z]:\\[^\s]+|\/[^\s]+/);
    return pathMatch ? pathMatch[0] : '';
  }
}

export const createLLMService = (provider: 'openai' | 'anthropic', apiKey?: string) => {
  return new LLMService(provider, apiKey);
};

// Made with Bob
