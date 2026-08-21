import { AudioLines } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-ink-soft)]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-amber)]/15 border border-[var(--color-amber)]/30 flex items-center justify-center">
            <AudioLines size={17} className="text-[var(--color-amber)]" />
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            EchoNotes
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-faint)] font-mono hidden sm:block">
          AI Meeting Summarizer
        </span>
      </div>
    </header>
  );
}