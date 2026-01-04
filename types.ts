
export enum AgentMode {
  GENERAL = 'GENERAL',
  CODING = 'CODING',
  RESEARCH = 'RESEARCH',
  SYSTEM = 'SYSTEM',
  IOT = 'IOT'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mode: AgentMode;
  groundingLinks?: { title: string; uri: string }[];
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  category: string;
}

export interface AppState {
  mode: AgentMode;
  messages: ChatMessage[];
  isTyping: boolean;
  activeTasks: Task[];
}
