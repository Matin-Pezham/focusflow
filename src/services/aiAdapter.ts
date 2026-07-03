import type { AIAssistantResponse, AIContext } from "./aiTypes";
import { evaluatePrompt } from "./aiRuleEngine";

export const getAssistantResponse = async (
  prompt: string,
  context: AIContext
): Promise<AIAssistantResponse> => {
  return evaluatePrompt(prompt, context);
};
