import { create } from "zustand";
import type { AIActionCard, AIQuickAction } from "../services/aiTypes";

const STORAGE_KEY = "focusflow-ai-copilot";

type AICopilotRole = "user" | "assistant";

export interface AICopilotMessage {
  id: string;
  role: AICopilotRole;
  content: string;
  createdAt: string;
  actionCard?: AIActionCard;
  quickActions?: AIQuickAction[];
}

interface AICopilotStore {
  messages: AICopilotMessage[];
  isOpen: boolean;
  isTyping: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string, actionCard?: AIActionCard, quickActions?: AIQuickAction[]) => void;
  clearConversation: () => void;
  setTyping: (isTyping: boolean) => void;
}

const loadMessages = (): AICopilotMessage[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AICopilotMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveMessages = (messages: AICopilotMessage[]) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

const createMessage = (
  role: AICopilotRole,
  content: string,
  actionCard?: AIActionCard,
  quickActions?: AIQuickAction[]
): AICopilotMessage => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
  actionCard,
  quickActions,
});

export const useAICopilotStore = create<AICopilotStore>((set) => ({
  messages: loadMessages(),
  isOpen: false,
  isTyping: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  addUserMessage: (content) =>
    set((state) => {
      const nextMessages = [...state.messages, createMessage("user", content)];
      saveMessages(nextMessages);
      return { messages: nextMessages };
    }),
  addAssistantMessage: (content, actionCard, quickActions) =>
    set((state) => {
      const nextMessages = [...state.messages, createMessage("assistant", content, actionCard, quickActions)];
      saveMessages(nextMessages);
      return { messages: nextMessages };
    }),
  clearConversation: () => {
    saveMessages([]);
    set({ messages: [] });
  },
  setTyping: (isTyping) => set({ isTyping }),
}));
