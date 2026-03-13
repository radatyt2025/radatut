import { api } from '@/store/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface MessagePayload {
  message: string;
  history: Message[];
}

interface ChatResponse {
  reply?: string;
  error?: string;
}

export const chatbotApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation<ChatResponse, MessagePayload>({
      query: (messages) => ({
        url: '/chat',
        method: 'POST',
        body: messages,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = chatbotApi;
