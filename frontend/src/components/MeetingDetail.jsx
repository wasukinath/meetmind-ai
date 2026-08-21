import { X, CheckCircle2, FileText, ListChecks, Sparkles } from "lucide-react";

const PRIORITY_COLORS = {
  High: "text-red-400 bg-red-400/10 border-red-400/30",
  Medium: "text-[var(--color-amber)] bg-[var(--color-amber)]/10 border-[var(--color-amber)]/30",
  Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
};

export default function MeetingDetail({ meeting, onClose }) {
  if (!meeting) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-3xl w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
        >
          <X size={20} />
        </button>

        <p className="text-xs font-mono text-[var(--color-text-faint)] mb-1">
          {new Date(meeting.createdAt).toLocaleString()}
        </p>
        <h2
          className="text-2xl font-semibold mb-6 pr-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {meeting.title || meeting.fileName}
        </h2>

        {/* Summary */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={15} className="text-[var(--color-amber)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
              Summary
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-text)]">
            {meeting.summary || "No summary available."}
          </p>
        </section>

        {/* Key Decisions */}
        {meeting.keyDecisions?.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={15} className="text-[var(--color-amber)]" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                Key Decisions
              </h3>
            </div>
            <ul className="space-y-1.5">
              {meeting.keyDecisions.map((d, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-[var(--color-amber)]">•</span>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Action Items */}
        {meeting.actionItems?.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks size={15} className="text-[var(--color-amber)]" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                Action Items
              </h3>
            </div>
            <div className="space-y-2">
              {meeting.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 bg-[var(--color-ink-soft)] border border-[var(--color-border)] rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-sm">{item.task}</p>
                    <p className="text-xs text-[var(--color-text-faint)] mt-1">
                      Owner: {item.owner || "Unassigned"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.Medium
                    }`}
                  >
                    {item.priority || "Medium"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transcript */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={15} className="text-[var(--color-amber)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
              Full Transcript
            </h3>
          </div>
          <div className="bg-[var(--color-ink-soft)] border border-[var(--color-border)] rounded-lg p-4 max-h-56 overflow-y-auto">
            <p className="text-xs leading-relaxed text-[var(--color-text-dim)] font-mono whitespace-pre-wrap">
              {meeting.transcript || "No transcript available."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}