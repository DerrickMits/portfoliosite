"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Embedded assistant chat panel for the portfolio. Streams from the deployed
 * AI Assistant's /api/chat (CORS-enabled). Sends only user/assistant chat
 * turns — no hidden system injection, keeping the conversation clean.
 */
const AI_ASSISTANT_URL =
  process.env.NEXT_PUBLIC_AI_ASSISTANT_URL ||
  "https://ai-assistant-theta-nine.vercel.app";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistantChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;

    const prior = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const next = [...prior, { role: "user" as const, content }];

    setMessages([
      ...next.map((m) => ({
        role: m.role as Msg["role"],
        content: m.content,
      })),
      { role: "assistant", content: "" },
    ]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch(`${AI_ASSISTANT_URL}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "flash",
          messages: next,
        }),
      });
      if (!res.ok || !res.body) throw new Error(`chat failed: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "" };
        return copy;
      });

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "I can not reach the assistant back end right now. If this persists, Derrick may still be deploying the AI Assistant, or the `NEXT_PUBLIC_AI_ASSISTANT_URL` env var on the portfolio needs updating.\n\n(" +
            (err as Error).message +
            ")",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
      <button
        aria-label="Close assistant"
        onClick={onClose}
        className="absolute inset-0 bg-deep/50 md:backdrop-blur-[2px] pointer-events-auto"
      />
      <aside className="relative pointer-events-auto w-full max-w-md h-full bg-cream dark:bg-warm-900 border-l border-warm-200 dark:border-warm-800 shadow-2xl flex flex-col animate-slide-in-right">
        <header className="flex items-center justify-between px-5 h-16 border-b border-warm-200 dark:border-warm-800">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full overflow-hidden border border-warm-200">
              <img src="/elara-avatar.png" alt="Elara" className="w-full h-full object-cover" />
            </span>
            <div>
              <p className="font-display font-bold text-warm-900 dark:text-warm-100 leading-tight">
                Derrick's AI Assistant
              </p>
              <p className="text-[11px] text-warm-500 dark:text-warm-400">
                Grounded on Derrick's portfolio, articles, and blueprints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl hover:bg-warm-100 dark:hover:bg-warm-800 grid place-items-center text-warm-600 dark:text-warm-300"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-5 space-y-4"
        >
          {messages.length === 0 && (
            <div className="text-center pt-10">
              <span className="inline-block w-12 h-12 rounded-full overflow-hidden border-2 border-warm-200 mb-4">
                <img src="/elara-avatar.png" alt="Elara" className="w-full h-full object-cover" />
              </span>
              <p className="font-display text-xl font-bold text-warm-900 dark:text-warm-100">
                Hi, what's the move?
              </p>
              <p className="mt-2 text-sm text-warm-500 dark:text-warm-400">
                Ask about Derrick's career, his articles on The Ledger, or his
                downloadable blueprints.
              </p>
              <div className="mt-6 grid gap-2 text-left">
                {[
                  "What does Derrick do for a living?",
                  "Summarize the Zapier automation guide.",
                  "Which blueprints cover community building?",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-sm text-left px-3 py-2 rounded-xl border border-warm-200 dark:border-warm-700 hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-700 dark:text-warm-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm bg-warm-900 text-cream dark:bg-warm-100 dark:text-warm-900 whitespace-pre-wrap"
                    : "max-w-[85%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 text-warm-800 dark:text-warm-100 prose-chat"
                }
              >
                {m.role === "assistant" &&
                (m.content || (busy && i === messages.length - 1)) ? (
                  <>
                    <MarkdownChannel content={m.content} />
                    {busy && i === messages.length - 1 && !m.content && (
                      <span className="inline-flex items-center gap-1.5 text-warm-500 text-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> thinking...
                      </span>
                    )}
                  </>
                ) : (
                  m.content || ""
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          className="border-t border-warm-200 dark:border-warm-800 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <div className="flex items-end gap-1.5 rounded-2xl bg-white dark:bg-warm-800 border border-warm-200 dark:border-warm-700 pl-4 pr-2 py-1.5 focus-within:border-warm-300 dark:focus-within:border-warm-500 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask Derrick's AI Assistant..."
              className="flex-1 resize-none bg-transparent outline-none text-sm text-warm-900 dark:text-warm-100 placeholder:text-warm-400 py-1.5 px-0 max-h-32"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-9 h-9 shrink-0 rounded-xl bg-warm-900 text-cream dark:bg-warm-100 dark:text-warm-900 grid place-items-center disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function MarkdownChannel({ content }: { content: string }) {
  return (
    <div className="prose-chat-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
