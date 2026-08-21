import { useState, useRef } from "react";
import { Upload, FileAudio, Loader2, X } from "lucide-react";
import { uploadMeeting } from "../api/api";

const BAR_COUNT = 40;

function Waveform({ active }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-14">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[var(--color-amber)]"
          style={{
            height: active ? undefined : "6px",
            opacity: active ? 0.9 : 0.25,
            animation: active
              ? `wave 1.1s ease-in-out ${(i % 8) * 0.08}s infinite`
              : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: 40px; }
        }
      `}</style>
    </div>
  );
}

export default function UploadCard({ onProcessed }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.type.startsWith("audio/")) {
      setFile(f);
      setError("");
    } else {
      setError("Please select a valid audio file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const result = await uploadMeeting(file, title);
      onProcessed(result);
      setFile(null);
      setTitle("");
    } catch (err) {
      setError("Something went wrong while processing. Check your backend / API key.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8">
      <Waveform active={processing} />

      <div className="text-center mt-4 mb-6">
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {processing ? "Transcribing & summarizing…" : "Upload a meeting recording"}
        </h2>
        <p className="text-sm text-[var(--color-text-dim)] mt-1">
          {processing
            ? "This usually takes under a minute."
            : "MP3, WAV, M4A — we'll transcribe it and pull out decisions & action items."}
        </p>
      </div>

      {!processing && (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-[var(--color-amber)] bg-[var(--color-amber)]/5"
                : "border-[var(--color-border)] hover:border-[var(--color-text-faint)]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileAudio size={20} className="text-[var(--color-amber)]" />
                <span className="text-sm">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={22} className="mx-auto mb-2 text-[var(--color-text-faint)]" />
                <p className="text-sm text-[var(--color-text-dim)]">
                  Drag & drop an audio file, or click to browse
                </p>
              </>
            )}
          </div>

          <input
            type="text"
            placeholder="Meeting title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-4 bg-[var(--color-ink-soft)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-amber)]/50"
          />

          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!file}
            className="w-full mt-5 bg-[var(--color-amber)] text-[var(--color-ink)] font-medium rounded-lg py-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-amber-soft)] transition-colors flex items-center justify-center gap-2"
          >
            Summarize meeting
          </button>
        </>
      )}

      {processing && (
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-dim)]">
          <Loader2 size={16} className="animate-spin" />
          Processing your audio…
        </div>
      )}
    </div>
  );
}