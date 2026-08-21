import { FileAudio, Trash2, Clock, Loader2, AlertCircle } from "lucide-react";

const STATUS_STYLES = {
  COMPLETED: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  PROCESSING: "text-[var(--color-amber)] bg-[var(--color-amber)]/10 border-[var(--color-amber)]/30",
  FAILED: "text-red-400 bg-red-400/10 border-red-400/30",
};

export default function MeetingList({ meetings, onSelect, onDelete }) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-text-faint)]">
        <FileAudio size={28} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No meetings yet. Upload one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {meetings.map((m) => (
        <div
          key={m.id}
          onClick={() => onSelect(m)}
          className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 cursor-pointer hover:border-[var(--color-amber)]/40 transition-colors relative"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(m.id);
            }}
            className="absolute top-4 right-4 text-[var(--color-text-faint)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={15} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                STATUS_STYLES[m.status] || STATUS_STYLES.PROCESSING
              }`}
            >
              {m.status === "PROCESSING" && <Loader2 size={10} className="animate-spin" />}
              {m.status === "FAILED" && <AlertCircle size={10} />}
              {m.status}
            </span>
          </div>

          <h3 className="font-medium text-sm mb-1 pr-6 truncate">
            {m.title || m.fileName}
          </h3>

          <p className="text-xs text-[var(--color-text-dim)] line-clamp-2 mb-3 min-h-[2.2em]">
            {m.summary || "Summary pending…"}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-faint)] font-mono">
            <Clock size={11} />
            {new Date(m.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}