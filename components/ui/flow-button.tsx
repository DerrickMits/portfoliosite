"use client";

import { ArrowRight } from "lucide-react";

const ACCENT = "#1C1B18";
const ACCENT_FADED = "rgba(28,27,24,0.4)";

export function FlowButton({
  text = "Modern Button",
  className = "",
  onClick,
  type = "button",
  href,
  target,
  rel,
  fullRipple = false,
  centered = false,
  noRipple = false,
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
  target?: string;
  rel?: string;
  fullRipple?: boolean;
  centered?: boolean;
  noRipple?: boolean;
}) {
  const sharedClasses =
    "group relative flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] bg-transparent px-8 py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-white hover:rounded-[12px] active:scale-[0.95]";

  const rippleEl = noRipple ? (
    <span className="hidden" aria-hidden="true" />
  ) : (
    <span
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
        fullRipple ? "w-full h-full" : "w-[220px] h-[220px]"
      } rounded-[50%] opacity-0 group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]`}
      style={{ backgroundColor: ACCENT }}
    />
  );

  const textSpan = (
    <span
      className={`relative z-[1] transition-all duration-[800ms] ease-out ${
        centered
          ? "mx-auto group-hover:translate-x-0"
          : "-translate-x-3 group-hover:translate-x-3"
      }`}
    >
      {text}
    </span>
  );

  const content = (
    <>
      <ArrowRight
        className="absolute w-4 h-4 left-[-25%] fill-none z-[9] group-hover:left-4 group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ stroke: "#1C1B18" }}
      />
      {textSpan}
      {rippleEl}
      <ArrowRight
        className="absolute w-4 h-4 right-4 fill-none z-[9] group-hover:right-[-25%] group-hover:stroke-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ stroke: "#1C1B18" }}
      />
    </>
  );

  const style = {
    borderColor:
      "var(--flow-button-border, rgba(28,27,24,0.4))",
    color: "var(--flow-button-color, #1C1B18)",
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={`${sharedClasses} ${className}`}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${sharedClasses} ${className}`}
      style={style}
    >
      {content}
    </button>
  );
}