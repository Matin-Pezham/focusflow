import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, X } from "lucide-react";
import { executeAIAction } from "../../services/aiActionExecutor";
import { getAssistantResponse } from "../../services/aiAdapter";
import { useAIContext } from "../../services/aiStoreContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useThemeStore } from "../../stores/useThemeStore";
import { useAICopilotStore } from "../../stores/useAICopilotStore";
import { Overlay } from "../ui";
import Button from "../ui/Button";

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const renderMarkdown = (text: string) => {
  const parts = text.split(/```([\s\S]*?)```/g);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <pre key={index} className="my-3 overflow-x-auto rounded-[20px] bg-slate-950/95 p-4 text-[13px] leading-6 text-slate-100 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)]">
          <code>{part}</code>
        </pre>
      );
    }

    return part.split("\n").map((line, lineIndex) => {
      const inlineParts = line.split(/(`[^`]+`)/g);
      return (
        <p key={`${index}-${lineIndex}`} className="my-1 whitespace-pre-wrap text-sm leading-6 text-current">
          {inlineParts.map((token, tokenIndex) =>
            token.startsWith("`") && token.endsWith("`") ? (
              <code key={tokenIndex} className="rounded-[8px] bg-slate-100/90 px-1.5 py-0.5 text-[13px] font-medium text-slate-800">
                {token.slice(1, -1)}
              </code>
            ) : (
              <span key={tokenIndex}>{token}</span>
            )
          )}
        </p>
      );
    });
  });
};

const AICopilot: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { theme } = useThemeStore();
  const context = useAIContext();
  const {
    messages,
    isOpen,
    isTyping,
    close,
    toggle,
    addUserMessage,
    addAssistantMessage,
    clearConversation,
    setTyping,
  } = useAICopilotStore();

  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const productivityScore = Math.max(0, Math.min(100, context.productivityScore));
  const suggestionKeys = useMemo(
    () => [
      "aiCopilot.examples.planMyDay",
      "aiCopilot.examples.analyzeProductivity",
      "aiCopilot.examples.recommendNextTask",
      "aiCopilot.examples.todaysProgress",
      "aiCopilot.examples.helpMeFocus",
    ],
    []
  );

  const suggestions = suggestionKeys.map((key) => t(key));

  const handleResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 260)}px`;
  };

  useEffect(() => {
    if (isOpen) {
      window.requestAnimationFrame(() => {
        textareaRef.current?.focus();
        handleResize();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    handleResize();
  }, [draft]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    const getFocusableElements = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),textarea:not(:disabled),input:not(:disabled),[tabindex]:not([tabindex='-1'])"
        ) ?? []
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!chatRef.current) return;

    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages.length, isTyping]);

  const handleSend = async (messageToSend?: string) => {
    const nextMessage = messageToSend ?? draft.trim();
    if (!nextMessage || isTyping) return;

    if (!messageToSend) {
      setDraft("");
    }

    addUserMessage(nextMessage);
    setTyping(true);

    try {
      const response = await getAssistantResponse(nextMessage, context);

      if (response.actionCommand) {
        if (response.actionCommand.type === "openPage" && typeof response.actionCommand.payload.path === "string") {
          navigate(response.actionCommand.payload.path as string);
        }

        const actionCard = executeAIAction(response.actionCommand, context.locale);
        addAssistantMessage(response.text, actionCard ?? response.actionCard, response.quickActions);
      } else {
        addAssistantMessage(response.text, response.actionCard, response.quickActions);
      }
    } finally {
      setTyping(false);
    }
  };

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDraft(suggestion);
    handleSend(suggestion);
  };

  const buttonSideClass = isRTL ? "left-4" : "right-4";
  const panelPosition = isRTL ? "items-end justify-start" : "items-end justify-end";

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? t("aiCopilot.closeLabel") : t("aiCopilot.openLabel")}
        aria-expanded={isOpen}
        className={`fixed bottom-4 z-50 ${buttonSideClass} inline-flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
          theme === "cyberpunk"
            ? "bg-cyan-500/10 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.24)] hover:scale-105"
            : "bg-white/90 text-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.16)] hover:scale-105"
        }`}
      >
        <span className="absolute inset-0 rounded-full border border-current/20 opacity-80 blur-sm" />
        <span className="relative flex h-full w-full items-center justify-center rounded-full bg-current/5">
          <Bot size={24} />
        </span>
      </button>

      <Overlay
        isOpen={isOpen}
        onClose={close}
        backdropClassName="bg-slate-950/60 backdrop-blur-xl"
        positionClassName={`${panelPosition} px-4 pb-4 sm:px-6 sm:pb-6`}
        contentClassName="w-full max-w-[520px]"
      >
        <div
          ref={panelRef}
          dir={isRTL ? "rtl" : "ltr"}
          className={`flex h-[calc(100vh-3rem)] w-full flex-col overflow-hidden rounded-[28px] border p-0 shadow-[0_40px_120px_rgba(15,23,42,0.25)] transition-all duration-300 ${
            theme === "cyberpunk"
              ? "border-cyan-400/20 bg-[#08101f]/95"
              : "border-white/70 bg-white/95"
          }`}
        >
          <div className="relative overflow-hidden px-5 pt-5">
            <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${theme === "cyberpunk" ? "from-cyan-500/10 via-transparent to-transparent" : "from-slate-200/80 via-transparent to-transparent"}`} />
            <div className="relative flex items-start justify-between gap-3 pb-4">
              <div className="flex items-center gap-3">
                <div className={`grid h-14 w-14 place-items-center rounded-3xl ${
                  theme === "cyberpunk"
                    ? "bg-cyan-400/10 text-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.14)]"
                    : "bg-slate-100 text-slate-700 shadow-[0_16px_48px_rgba(15,23,42,0.08)]"
                }`}>
                  <Bot size={26} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">{t("aiCopilot.headerTitle")}</div>
                  <div className={`mt-1 text-sm ${theme === "cyberpunk" ? "text-cyan-100/80" : "text-slate-500"}`}>{t("aiCopilot.headerSubtitle")}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className={`rounded-[18px] border px-3 py-2 text-sm transition-all duration-300 ${
                  theme === "cyberpunk"
                    ? "border-cyan-500/25 bg-slate-950/60 text-cyan-100 hover:bg-cyan-500/10"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
                aria-label={t("aiCopilot.closeLabel")}
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-3 rounded-[24px] border px-4 py-4 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)] sm:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  {t("aiCopilot.onlineStatus")}
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-50">{t("aiCopilot.headerTitle")}</div>
                <div className="mt-1 text-sm text-slate-500">{t("aiCopilot.productivityScore")}</div>
              </div>
              <div className="flex h-12 min-w-[108px] items-center justify-center rounded-3xl bg-slate-900/95 text-white shadow-[0_18px_40px_rgba(15,23,42,0.2)]">
                <div className="text-center">
                  <div className="text-sm font-semibold">{productivityScore}</div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-300">{t("aiCopilot.productivityScore")}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-5 pb-5">
            <div className="flex h-full flex-col rounded-[32px] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)] dark:border-slate-700/80 dark:bg-slate-950/70 sm:p-5">
              <div className="flex-1 overflow-y-auto" ref={chatRef} role="log" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm leading-7 text-slate-600">{t("aiCopilot.emptyMessage")}</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 space-y-3">
                  {messages.map((message) => {
                    const isUser = message.role === "user";
                    return (
                      <div
                        key={message.id}
                        className={`flex max-w-[92%] ${isUser ? "self-end" : "self-start"} flex-col gap-2 rounded-[28px] ${
                          isUser
                            ? theme === "cyberpunk"
                              ? "rounded-br-[8px] bg-cyan-500/10 px-4 py-3 text-cyan-100 shadow-[0_20px_60px_rgba(34,211,238,0.08)]"
                              : "bg-slate-900 text-white px-4 py-3 shadow-[0_18px_30px_rgba(15,23,42,0.25)]"
                            : theme === "cyberpunk"
                            ? "rounded-bl-[8px] bg-slate-950/90 px-4 py-3 text-slate-100 shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
                            : "bg-white px-4 py-3 text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.08)]"
                        }`}
                      >
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          {isUser ? t("aiCopilot.bubbleUserLabel") : t("aiCopilot.bubbleAssistantLabel")}
                        </div>
                        <div className="max-w-none text-sm leading-7 text-current">{renderMarkdown(message.content)}</div>
                        <div className="text-[11px] text-slate-400">{formatTime(message.createdAt)}</div>
                        {message.actionCard ? (
                          <div className="mt-3 rounded-[22px] border border-slate-200 bg-slate-100 p-3 text-sm text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                            <div className="font-semibold">{message.actionCard.title}</div>
                            {message.actionCard.subtitle ? <div className="mt-1 text-sm text-slate-500">{message.actionCard.subtitle}</div> : null}
                          </div>
                        ) : null}
                        {message.quickActions ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.quickActions.map((action) => (
                              <button
                                key={action.command}
                                type="button"
                                onClick={() => {
                                  setDraft(action.command);
                                  handleSend(action.command);
                                }}
                                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:bg-slate-50"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                  {isTyping ? (
                    <div className="self-start max-w-[88%] rounded-[28px] bg-slate-900/95 px-4 py-4 text-slate-100 shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
                      <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-cyan-300">{t("aiCopilot.bubbleAssistantLabel")}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{t("aiCopilot.typing")}</span>
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-cyan-300" />
                          <span className="h-2 w-2 animate-[pulse_1.2s_0.2s_ease-in-out_infinite] rounded-full bg-cyan-300" />
                          <span className="h-2 w-2 animate-[pulse_1.2s_0.4s_ease-in-out_infinite] rounded-full bg-cyan-300" />
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-5 py-4">
            <div className="relative">
              <label htmlFor="ai-copilot-input" className="sr-only">
                {t("aiCopilot.inputLabel")}
              </label>
              <textarea
                id="ai-copilot-input"
                ref={textareaRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={t("aiCopilot.placeholder")}
                disabled={isTyping}
                aria-label={t("aiCopilot.inputLabel")}
                className={`min-h-[64px] w-full resize-none rounded-[24px] border px-4 py-3 pr-14 text-sm outline-none transition-all duration-200 ${
                  theme === "cyberpunk"
                    ? "border-cyan-500/20 bg-slate-950/95 text-cyan-100 placeholder:text-cyan-200/40 focus:border-cyan-400/50"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
                }`}
                style={{ maxHeight: 260, overflow: "auto" }}
              />
              <div className="pointer-events-none absolute right-4 bottom-4 text-[11px] text-slate-400">
                {t("aiCopilot.shortcutHint")}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Button type="button" onClick={() => handleSend()} disabled={!draft.trim() || isTyping} className="min-w-[140px]">
                <Send size={16} />
                {t("aiCopilot.sendButton")}
              </Button>
              <button
                type="button"
                onClick={clearConversation}
                disabled={isTyping}
                className="text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t("aiCopilot.clearButton")}
              </button>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  );
};

export default AICopilot;
