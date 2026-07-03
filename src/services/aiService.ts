const DEFAULT_RESPONSE = `I’m ready to help with your next productivity move. Tell me more about what you want to achieve today.`;

const cannedResponses: Array<{ trigger: RegExp; response: string }> = [
  {
    trigger: /plan|schedule|day/i,
    response:
      "Here’s a simple focus plan: start with your top task, protect two 25-minute focus blocks, and review progress before lunch.",
  },
  {
    trigger: /analyz|productiv|efficien/i,
    response:
      "I’ve reviewed your recent pace. Keeping a clearer top-three task list and shorter focus sessions will free up more momentum.",
  },
  {
    trigger: /recommend|next task|what should/i,
    response:
      "I recommend you finish the task that is closest to completion first. It will free up mental space and keep your momentum building.",
  },
  {
    trigger: /today|progress|summary/i,
    response:
      "Today is looking strong. You have steady progress, and a short wrap-up before the end of the day will keep your flow intact.",
  },
  {
    trigger: /focus|help me focus|concentrat/i,
    response:
      "Let’s keep distractions low. I suggest narrowing your next session to one single goal and using a short 25-minute timer.",
  },
];

export const fetchAIResponse = async (prompt: string): Promise<string> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const match = cannedResponses.find((entry) => entry.trigger.test(prompt));
      resolve(match ? match.response : DEFAULT_RESPONSE);
    }, 1000);
  });
