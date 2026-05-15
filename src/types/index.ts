// Core types for IBM Bob Assistant

export type EmotionalState = 
  | 'happy' 
  | 'excited' 
  | 'thinking' 
  | 'confused' 
  | 'sad' 
  | 'sleeping' 
  | 'working';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  emotionalState?: EmotionalState;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: Date;
  recurring?: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
}

export interface BobSettings {
  theme: 'classic' | 'modern' | 'custom';
  alwaysOnTop: boolean;
  startWithWindows: boolean;
  voiceEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  llmProvider: 'openai' | 'anthropic' | 'local';
  llmApiKey?: string;
  characterName: string;
  browserMonitoringEnabled: boolean;
}

export interface BobMemory {
  conversations: Message[];
  tasks: Task[];
  reminders: Reminder[];
  userPreferences: Record<string, any>;
  lastInteraction: Date;
}

export interface SystemCommand {
  type: 'open-app' | 'open-website' | 'open-file';
  target: string;
  requiresConfirmation: boolean;
}

export interface BrowserTab {
  title: string;
  url: string;
  active: boolean;
}

// Made with Bob
