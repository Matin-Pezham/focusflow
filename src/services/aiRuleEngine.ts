import type { AIAssistantResponse, AIActionCommand, AIContext } from "./aiTypes";

const buildQuickActions = (context: AIContext): Array<{ label: string; command: string }> => [
  { label: context.locale === "fa" ? "شروع تمرکز" : "Start Focus", command: "start focus" },
  { label: context.locale === "fa" ? "پیشنهاد بعدی" : "recommend next task", command: "recommend next task" },
  { label: context.locale === "fa" ? "ایجاد وظیفه" : "create task \"New task\"", command: "create task \"New task\"" },
  { label: context.locale === "fa" ? "مشاهده تحلیل" : "analyze this week", command: "analyze this week" },
];

const localize = (locale: string, en: string, fa: string) => (locale === "fa" ? fa : en);

const normalizeText = (text: string) =>
  text
    .trim()
    .replace(/[؟!.,؛]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();

const detectIntent = (text: string, locale: string): { intent: string; entities: Record<string, string> } => {
  const normalized = normalizeText(text);
  const entities: Record<string, string> = {};

  const english = {
    greetings: /^(hi|hello|hey|hey there|good (morning|afternoon|evening))/,
    help: /(help me|i need help|assist me|please help|can you help)/,
    planDay: /(plan my day|plan today|schedule today|today's plan|what should i do today)/,
    recommendNextTask: /(recommend next task|what should i do next|what's next|what should i work on)/,
    analyzeProductivity: /(how productive am i|analyze my productivity|productivity|productivity score)/,
    openAnalytics: /(open analytics|show analytics|analytics page|view analytics)/,
    openDashboard: /(open dashboard|show dashboard|dashboard page|view dashboard)/,
    openTasks: /(open tasks|show tasks|tasks page|view tasks)/,
    createTask: /(create task|add task|add a new task|new task)/,
    deleteTask: /(delete task|remove task|delete the task|remove the task)/,
    completeTask: /(complete task|finish task|mark task as complete|complete this task)/,
    moveTask: /(move .* to|change .* to|set .* to)/,
    startFocus: /(start focus|begin focus|start pomodoro|begin pomodoro|focus mode|pomodoro)/,
    switchTheme: /(switch theme to|set theme to|enable (cyberpunk|light)|dark theme|light theme)/,
    switchLanguage: /(switch language to|set language to|change language to|language to|زبان را|زبان)/,
    clearCompleted: /(clear completed|remove completed|delete completed|clear done|delete done)/,
  };

  const persian = {
    greetings: /^(سلام|درود|سلام پیام|سلام عزیز|سلام)/,
    help: /(کمکم کن|به من کمک کن|لطفاً کمک کن|لطفا کمک کن|می‌تونید کمک کنید|می تونید کمک کنید|کمک می‌خواد|کمک میخوایم)/,
    planDay: /(برای امروز برنامه بده|برای امروز برنامه ریزی کن|برای امروز برنامه‌ریزی کن|برنامه امروز|برنامه امروز را بده|برنامه امروز را تنظیم کن)/,
    recommendNextTask: /(امروز روی چی تمرکز کنم|الان بهترین کار چیه|از کجا شروع کنم|چه کاری انجام بدم|چه کاری انجام بدم بعدی|چی کار کنم بعدی)/,
    analyzeProductivity: /(بهره وری من چطوره|بازدهی من چطوره|چند درصد بهره وری دارم|بازدهی من|امتیاز بهره وری|بهره‌وری من چطوره|بهره وری)/,
    openAnalytics: /(مشاهده تحلیل|باز کردن تحلیل|برو به تحلیل|صفحه تحلیل|تحلیل‌ها را باز کن|تحلیل‌ها)/,
    openDashboard: /(باز کردن داشبورد|برو به پیشخوان|صفحه پیشخوان|داشبورد را باز کن|پیشخوان را باز کن)/,
    openTasks: /(باز کردن وظایف|برو به وظایف|صفحه وظایف|وظایف را نشان بده|لیست وظایف)/,
    createTask: /(یه تسک جدید بساز|یه کار جدید اضافه کن|یک تسک جدید بساز|یک کار جدید اضافه کن|ایجاد تسک جدید|وظیفه جدید|یک وظیفه جدید)/,
    deleteTask: /(این تسک رو حذف کن|تسک را حذف کن|این کار را پاک کن|این وظیفه را پاک کن|این کار را حذف کن|تسک را پاک کن)/,
    completeTask: /(این تسک رو کامل کن|تسک را تکمیل کن|این کار را انجام شد کن|وظیفه را انجام شده کن|تسک را کامل کن|کاملش کن)/,
    moveTask: /(انتقال .* به|برو .* به|تغییر .* به|به .* منتقل کن|به .* تغییر بده|به .* ببر)/,
    startFocus: /(حالت تمرکز رو شروع کن|تمرکز رو شروع کن|پومودورو رو شروع کن|شروع پومودورو|شروع حالت تمرکز|تمرکز را شروع کن)/,
    switchTheme: /(تم سایبرپانک رو فعال کن|حالت سایبرپانک را فعال کن|حالت سایبرپانک را روشن کن|تم روشن را فعال کن|حالت روشن را فعال کن|تم روشن را روشن کن|تم روشن)/,
    switchLanguage: /(زبان را فارسی کن|زبان را انگلیسی کن|زبان رو فارسی کن|زبان رو انگلیسی کن|به فارسی برو|به انگلیسی برو|فارسی کن|انگلیسی کن)/,
    clearCompleted: /(همه کارهای انجام شده رو پاک کن|پاک کردن کارهای انجام شده|حذف وظایف کامل شده|پاک کن کارهای انجام شده|پاک کردن وظایف کامل شده)/,
  };

  const patterns = locale === "fa" ? persian : english;

  if (patterns.greetings.test(normalized)) return { intent: "greeting", entities };
  if (patterns.help.test(normalized)) return { intent: "help", entities };
  if (patterns.planDay.test(normalized)) return { intent: "planDay", entities };
  if (patterns.recommendNextTask.test(normalized)) return { intent: "recommendNextTask", entities };
  if (patterns.analyzeProductivity.test(normalized)) return { intent: "analyzeProductivity", entities };
  if (patterns.openAnalytics.test(normalized)) return { intent: "openAnalytics", entities };
  if (patterns.openDashboard.test(normalized)) return { intent: "openDashboard", entities };
  if (patterns.openTasks.test(normalized)) return { intent: "openTasks", entities };
  if (patterns.createTask.test(normalized)) return { intent: "createTask", entities };
  if (patterns.deleteTask.test(normalized)) return { intent: "deleteTask", entities };
  if (patterns.completeTask.test(normalized)) return { intent: "completeTask", entities };
  if (patterns.moveTask.test(normalized)) {
    const match = normalized.match(/(?:move|انتقال|برو|تغییر)\s+(.*?)\s+(?:to|به|روی|روی)/);
    if (match) entities.title = match[1].trim();
    return { intent: "moveTask", entities };
  }
  if (patterns.startFocus.test(normalized)) return { intent: "startFocus", entities };
  if (patterns.switchTheme.test(normalized)) return { intent: "switchTheme", entities };
  if (patterns.switchLanguage.test(normalized)) return { intent: "switchLanguage", entities };
  if (patterns.clearCompleted.test(normalized)) return { intent: "clearCompletedTasks", entities };

  return { intent: "unknown", entities };
};

const extractEntities = (text: string, intent: string): Record<string, string> => {
  const normalized = normalizeText(text);
  const entities: Record<string, string> = {};

  if (intent === "createTask") {
    const match = normalized.match(/(?:create task|add task|add a new task|new task|یه تسک جدید بساز|یه کار جدید اضافه کن|یک تسک جدید بساز|ایجاد تسک جدید|وظیفه جدید)\s*(.*)/);
    if (match?.[1]) entities.title = match[1].trim();
  }

  if (intent === "deleteTask" || intent === "completeTask") {
    const match = normalized.match(/(?:delete task|remove task|delete the task|remove the task|این تسک رو حذف کن|تسک را حذف کن|این کار را پاک کن|این وظیفه را پاک کن|این تسک رو کامل کن|تسک را تکمیل کن|این کار را انجام شد کن|وظیفه را انجام شده کن)\s*(.*)/);
    if (match?.[1]) entities.title = match[1].trim();
  }

  if (intent === "switchTheme") {
    if (normalized.includes("cyberpunk") || normalized.includes("سایبرپانک")) entities.theme = "cyberpunk";
    else if (normalized.includes("light") || normalized.includes("روشن")) entities.theme = "light";
  }

  if (intent === "switchLanguage") {
    if (normalized.includes("فارسی") || normalized.includes("persian")) entities.locale = "fa";
    else if (normalized.includes("english") || normalized.includes("انگلیسی")) entities.locale = "en";
  }

  return entities;
};

const buildActionCommand = (intent: string, entities: Record<string, string>, locale: string): AIActionCommand | null => {
  switch (intent) {
    case "createTask":
      return { type: "createTask", payload: { title: entities.title || (locale === "fa" ? "وظیفه جدید" : "New task") } };
    case "deleteTask":
      return { type: "deleteTask", payload: { title: entities.title || "" } };
    case "completeTask":
      return { type: "completeTask", payload: { title: entities.title || "" } };
    case "moveTask":
      return { type: "moveTask", payload: { title: entities.title || "", status: entities.status || "progress" } };
    case "startFocus":
      return { type: "startFocus", payload: {} };
    case "switchTheme":
      return { type: "switchTheme", payload: { theme: entities.theme || "light" } };
    case "switchLanguage":
      return { type: "switchLanguage", payload: { locale: entities.locale || "en" } };
    case "clearCompletedTasks":
      return { type: "clearCompletedTasks", payload: {} };
    case "openAnalytics":
      return { type: "openPage", payload: { path: "/analytics" } };
    case "openDashboard":
      return { type: "openPage", payload: { path: "/" } };
    case "openTasks":
      return { type: "openPage", payload: { path: "/tasks" } };
    default:
      return null;
  }
};

const titleCase = (value: string) => value.replace(/\b[a-z]/g, (char) => char.toUpperCase());

export const evaluatePrompt = (
  prompt: string,
  context: AIContext
): AIAssistantResponse => {
  const intentData = detectIntent(prompt, context.locale);
  const command = buildActionCommand(intentData.intent, extractEntities(prompt, intentData.intent), context.locale);
  const loc = (en: string, fa: string) => localize(context.locale, en, fa);

  const suggestions = buildQuickActions(context).map((item) => ({ label: item.label, command: item.command }));
  const highBacklog = context.backlogTasks > Math.max(3, Math.round(context.totalTasks * 0.4));
  const lowFocus = context.focusSessions === 0;
  const lowCompletion = context.completionRate < 50 && context.totalTasks > 0;

  if (command) {
    return {
      text: loc(
        `Executing your action: ${prompt}`,
        `در حال اجرای اقدام شما: ${prompt}`
      ),
      actionCommand: command,
      actionCard: {
        title: loc("Action detected", "اقدام شناسایی شد"),
        subtitle: titleCase(prompt),
        status: "✓",
      },
      quickActions: suggestions,
    };
  }

  const greetingResponses = [
    loc("Hi there! How can I help with your workflow today?", "سلام! چطور می‌تونم امروز به جریان کاری شما کمک کنم؟"),
    loc("Hello! Ask me about your tasks, focus sessions, or productivity progress.", "درود! از من درباره وظایف، جلسات تمرکز یا پیشرفت بهره‌وری بپرس."),
  ];

  const helpResponses = [
    loc(
      "I can help with tasks, focus sessions, productivity insights, and theme or language commands.",
      "می‌تونم در مورد وظایف، جلسات تمرکز، تحلیل بهره‌وری و تغییر پوسته یا زبان به شما کمک کنم."
    ),
    loc(
      "Ask me to create a task, start focus mode, switch theme, or analyze your progress.",
      "از من بخواه یک وظیفه بسازم، حالت تمرکز را شروع کنم، پوسته را تغییر دهم یا پیشرفتتان را تحلیل کنم."
    ),
  ];

  const unknownResponses = [
    loc(
      "I’m not sure I understood, but I can help with tasks, focus, or analytics. Try asking in another way.",
      "من متوجه نشدم، اما می‌تونم در مورد وظایف، تمرکز یا تحلیل‌ها کمک کنم. لطفاً به شکل دیگری بپرس."
    ),
    loc(
      "I’m here to help with your workflow. Ask me to plan your day, start focus, or manage tasks.",
      "من اینجا هستم تا در جریان کاری شما کمک کنم. از من بخواه روزت را برنامه‌ریزی کنم، شروع تمرکز کنم یا وظایف را مدیریت کنم."
    ),
  ];

  if (intentData.intent === "greeting") {
    return { text: greetingResponses[Math.floor(Math.random() * greetingResponses.length)], quickActions: suggestions };
  }

  if (intentData.intent === "help") {
    return { text: helpResponses[Math.floor(Math.random() * helpResponses.length)], quickActions: suggestions };
  }

  if (intentData.intent === "planDay") {
    return {
      text: loc(
        `Today you have ${context.backlogTasks} backlog tasks, ${context.progressTasks} in progress, and ${context.completedTasks} completed. Start with one task in progress and use a Pomodoro to keep focus.`,
        `امروز ${context.backlogTasks} وظیفه در بک‌لاگ، ${context.progressTasks} وظیفه در حال انجام و ${context.completedTasks} تکمیل شده داری. با یک وظیفه در حال انجام شروع کن و از پومودورو برای حفظ تمرکز استفاده کن.`
      ),
      quickActions: suggestions,
    };
  }

  if (intentData.intent === "recommendNextTask") {
    const nextTask = context.tasks.find((task) => task.status === "backlog") || context.tasks.find((task) => task.status === "progress");
    if (nextTask) {
      return {
        text: loc(
          `I suggest working on ${nextTask.title} next. It is currently ${nextTask.status} and will help you make progress today.`,
          `پیشنهاد می‌کنم بعدی روی ${nextTask.title} کار کنی. این وظیفه در وضعیت ${nextTask.status} است و به پیشرفت امروزت کمک می‌کند.`
        ),
        quickActions: suggestions,
      };
    }
    return {
      text: loc(
        "You don’t have active tasks yet. Create a new task and I’ll help you prioritize it.",
        "فعلاً وظیفه فعالی نداری. یک وظیفه جدید بساز تا به اولویت‌بندی آن کمک کنم."
      ),
      quickActions: suggestions,
    };
  }

  if (intentData.intent === "analyzeProductivity") {
    return {
      text: loc(
        `You have ${context.totalTasks} tasks, ${context.completedTasks} completed, and ${context.focusSessions} focus sessions. Your productivity score is ${context.productivityScore}.`,
        `شما ${context.totalTasks} وظیفه دارید، ${context.completedTasks} تای آن تکمیل شده و ${context.focusSessions} جلسه تمرکز داشته‌اید. امتیاز بهره‌وری شما ${context.productivityScore} است.`
      ),
      quickActions: suggestions,
    };
  }

  if (intentData.intent === "openAnalytics") {
    return {
      text: loc("Opening analytics dashboard.", "در حال باز کردن صفحه تحلیل‌ها هستم."),
      actionCommand: command ?? undefined,
      quickActions: suggestions,
    };
  }

  if (intentData.intent === "openDashboard") {
    return {
      text: loc("Opening dashboard.", "در حال باز کردن پیشخوان هستم."),
      actionCommand: command ?? undefined,
      quickActions: suggestions,
    };
  }

  if (intentData.intent === "openTasks") {
    return {
      text: loc("Opening tasks list.", "در حال باز کردن لیست وظایف هستم."),
      actionCommand: command ?? undefined,
      quickActions: suggestions,
    };
  }

  if (highBacklog) {
    return {
      text: loc(
        `Your backlog is high. Prioritize the top 2 tasks and avoid starting new work before completing one.`,
        `بک‌لاگ شما زیاد است. دو وظیفه برتر را اولویت‌بندی کن و قبل از تکمیل یکی، کار جدیدی شروع نکن.`
      ),
      quickActions: suggestions,
    };
  }

  if (lowCompletion) {
    return {
      text: loc(
        `Your completion rate is ${context.completionRate}%. Finish one task before adding more to regain momentum.`,
        `نرخ تکمیل شما ${context.completionRate}% است. قبل از اضافه کردن بیشتر، یک وظیفه را تمام کن تا شتاب را باز یابی.`
      ),
      quickActions: suggestions,
    };
  }

  if (lowFocus) {
    return {
      text: loc(
        `You haven’t started a focus session yet. Start one now to boost your progress.`,
        `هنوز جلسه تمرکز را شروع نکرده‌ای. اکنون یک جلسه شروع کن تا پیشرفتت افزایش یابد.`
      ),
      quickActions: suggestions,
    };
  }

  return {
    text: unknownResponses[Math.floor(Math.random() * unknownResponses.length)],
    quickActions: suggestions,
  };
};
