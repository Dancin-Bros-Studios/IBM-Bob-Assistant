import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Message, 
  Task, 
  Reminder, 
  BobSettings, 
  EmotionalState 
} from '@types/index';

interface BobStore {
  // Character state
  emotionalState: EmotionalState;
  isThinking: boolean;
  
  // Chat
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  
  // Settings
  settings: BobSettings;
  updateSettings: (updates: Partial<BobSettings>) => void;
  
  // Character actions
  setEmotionalState: (state: EmotionalState) => void;
  setThinking: (thinking: boolean) => void;
}

const defaultSettings: BobSettings = {
  theme: 'classic',
  alwaysOnTop: true,
  startWithWindows: false,
  voiceEnabled: false,
  soundEnabled: true,
  notificationsEnabled: true,
  llmProvider: 'openai',
  characterName: 'Bob',
  browserMonitoringEnabled: false,
};

export const useBobStore = create<BobStore>()(
  persist(
    (set) => ({
      // Initial state
      emotionalState: 'happy',
      isThinking: false,
      messages: [],
      tasks: [],
      reminders: [],
      settings: defaultSettings,
      
      // Message actions
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),
      
      clearMessages: () => set({ messages: [] }),
      
      // Task actions
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      
      // Reminder actions
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            {
              ...reminder,
              id: crypto.randomUUID(),
            },
          ],
        })),
      
      updateReminder: (id, updates) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...updates } : reminder
          ),
        })),
      
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        })),
      
      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
          ),
        })),
      
      // Settings actions
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
      
      // Character actions
      setEmotionalState: (emotionalState) => set({ emotionalState }),
      setThinking: (isThinking) => set({ isThinking }),
    }),
    {
      name: 'bob-storage',
      partialize: (state) => ({
        messages: state.messages,
        tasks: state.tasks,
        reminders: state.reminders,
        settings: state.settings,
      }),
    }
  )
);

// Made with Bob
