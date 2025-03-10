export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  apiKey: string | null;
} 