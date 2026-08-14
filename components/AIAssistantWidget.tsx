"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
        // Lock the button to a single render position. CSS containment
        // isolates layout/paint so nothing outside this button can
        // affect where it sits on screen (mobile repaint jitter fix).
        style={{
          contain: "layout paint style",
          transitionProperty: "box-shadow, background-image",
          transform: "translateZ(0)",
        }}
        className="fixed bottom-6 right-6 z-30 group flex items-center gap-2 h-12 pl-3 pr-4 rounded-full bg-gradient-to-br from-amber-300 to-violet-300 text-warm-900 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]"
      >
        <span className="w-7 h-7 rounded-full overflow-hidden bg-white/30">
          {open ? (
            <X className="w-4 h-4 m-auto" />
          ) : (
            <img src="/elara-avatar.png" alt="Elara" className="w-full h-full object-cover" />
          )}
        </span>
        <span className="font-display font-bold text-sm tracking-tight">
          {open ? "Close" : "AI Assistant"}
        </span>
      </button>

      {open && <AIAssistantChat onClose={() => setOpen(false)} />}
    </>
  );
}
