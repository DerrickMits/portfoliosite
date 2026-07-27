"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import AIAssistantChat from "@/components/AIAssistantChat";

/**
 * Floating bottom-right AI Assistant trigger. Opens an in-page chat drawer that
 * streams from the deployed AI Assistant's /api/chat. A second click (or the
 * drawer's X) closes it. Sits above the page content with z-50.
 */
export default function AIAssistantWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 h-12 pl-3 pr-4 rounded-full bg-gradient-to-br from-amber-300 to-violet-300 text-warm-900 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)] transition-all"
      >
        <span className="w-7 h-7 rounded-full bg-white/30 grid place-items-center">
          {open ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </span>
        <span className="font-display font-bold text-sm tracking-tight">
          {open ? "Close" : "AI Assistant"}
        </span>
      </button>

      {open && <AIAssistantChat onClose={() => setOpen(false)} />}
    </>
  );
}
