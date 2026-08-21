import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileAudio,
  FileText,
  Headphones,
  LayoutDashboard,
  ListChecks,
  Loader2,
  Mic2,
  Play,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  deleteMeeting,
  getAllMeetings,
  getMeetingById,
  uploadMeeting,
} from "./api/api";

export default function App() {
  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const loadMeetings = async () => {
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the meeting service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const completedCount = meetings.filter(
    (m) => m.status === "COMPLETED"
  ).length;

  const processingCount = meetings.filter(
    (m) => m.status === "PROCESSING"
  ).length;

  const filteredMeetings = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return meetings;

    return meetings.filter((meeting) =>
      `${meeting.title || ""} ${meeting.fileName || ""} ${
        meeting.summary || ""
      }`
        .toLowerCase()
        .includes(value)
    );
  }, [meetings, search]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select a valid audio file.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleUpload = async () => {
    if (!file || processing) return;

    setProcessing(true);
    setError("");

    try {
      const result = await uploadMeeting(file, title);
      setMeetings((prev) => [result, ...prev]);
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      setError(
        "Processing failed. Make sure the backend and Groq API are running."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMeeting(id);
      setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete this meeting.");
    }
  };

  const handleSelect = async (meeting) => {
    try {
      const freshMeeting = await getMeetingById(meeting.id);
      setSelected(freshMeeting);
    } catch (err) {
      console.error(err);
      setSelected(meeting);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-[240px] border-r border-[#e5e9f2] bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-[#eef1f6] px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172033] text-white shadow-sm">
            <Sparkles size={19} />
          </div>

          <div>
            <h1 className="text-[16px] font-bold tracking-tight">
              MeetMind
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8993a6]">
              AI workspace
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa3b5]">
            Workspace
          </p>

          <button className="flex w-full items-center gap-3 rounded-xl bg-[#eef2ff] px-3.5 py-3 text-sm font-semibold text-[#4c55c9]">
            <LayoutDashboard size={17} />
            Overview
          </button>

          <div className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#7c8799]">
            <FileText size={17} />
            Meetings
            <span className="ml-auto rounded-md bg-[#f1f3f7] px-2 py-0.5 text-[10px] font-bold">
              {meetings.length}
            </span>
          </div>

          <div className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#7c8799]">
            <ListChecks size={17} />
            Action items
          </div>
        </div>

        <div className="border-t border-[#eef1f6] p-5">
          <div className="rounded-2xl bg-[#f7f8fc] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#4c55c9]">
              <Zap size={15} />
              <span className="text-xs font-bold">AI Assistant</span>
            </div>

            <p className="text-[11px] leading-relaxed text-[#7f899c]">
              Turn long conversations into clear decisions and next steps.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-[240px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-[#e5e9f2] bg-white/90 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-5 sm:px-8 xl:px-10">
            <div>
              <p className="text-xs font-medium text-[#8b95a8]">
                Workspace / Overview
              </p>
              <h2 className="mt-0.5 text-lg font-bold tracking-tight">
                Meeting intelligence
              </h2>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-2 rounded-full border border-[#e5e9f2] bg-[#fafbfc] px-3 py-2 text-xs text-[#7d8799]">
                <Activity size={14} className="text-emerald-500" />
                System operational
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172033] text-xs font-bold text-white">
                M
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 xl:px-10">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-[28px] bg-[#172033] p-7 text-white shadow-xl shadow-[#172033]/10 sm:p-9">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#6366f1]/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#22c55e]/10 blur-3xl" />

            <div className="relative max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80">
                <Sparkles size={13} />
                AI-powered meeting workspace
              </div>

              <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Your meetings, organized automatically.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                Upload a recording and let MeetMind turn the conversation
                into a useful summary, decisions, transcript and action items.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/75">
                  <Mic2 size={14} />
                  Audio transcription
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/75">
                  <Sparkles size={14} />
                  AI summaries
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/75">
                  <ListChecks size={14} />
                  Action items
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={<FileText size={18} />}
              label="Total meetings"
              value={meetings.length}
            />

            <StatCard
              icon={<CheckCircle2 size={18} />}
              label="Completed"
              value={completedCount}
            />

            <StatCard
              icon={<Clock3 size={18} />}
              label="Processing"
              value={processingCount}
            />
          </section>

          {/* Upload + recent */}
          <section className="mt-7 grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
            {/* Upload */}
            <div className="rounded-[24px] border border-[#e3e7ef] bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8993a6]">
                    New meeting
                  </p>

                  <h3 className="mt-1 text-xl font-bold tracking-tight">
                    Add a recording
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff] text-[#555bd6]">
                  <UploadCloud size={19} />
                </div>
              </div>

              {!processing ? (
                <>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFile(e.dataTransfer.files?.[0]);
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={`group cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition ${
                      file
                        ? "border-[#6366f1] bg-[#f5f6ff]"
                        : "border-[#dfe4ed] bg-[#fafbfc] hover:border-[#aab1ff] hover:bg-[#f8f8ff]"
                    }`}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFile(e.target.files?.[0])
                      }
                    />

                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white">
                          <FileAudio size={18} />
                        </div>

                        <div className="min-w-0 text-left">
                          <p className="max-w-[210px] truncate text-sm font-semibold">
                            {file.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#8a94a7]">
                            Ready to analyze
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="ml-auto rounded-lg p-2 text-[#9aa3b4] hover:bg-white hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6366f1] shadow-sm">
                          <Headphones size={21} />
                        </div>

                        <p className="mt-4 text-sm font-semibold">
                          Drop your recording here
                        </p>

                        <p className="mt-1 text-xs text-[#8b95a7]">
                          or click to browse your computer
                        </p>

                        <div className="mt-4 text-[10px] font-medium uppercase tracking-wider text-[#a0a8b7]">
                          MP3 · WAV · M4A · OGG
                        </div>
                      </>
                    )}
                  </div>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Meeting title (optional)"
                    className="mt-4 w-full rounded-xl border border-[#e1e5ed] bg-[#fafbfc] px-4 py-3 text-sm outline-none transition focus:border-[#6366f1] focus:bg-white"
                  />

                  {error && (
                    <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={!file}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#172033] py-3.5 text-sm font-semibold text-white transition hover:bg-[#252f45] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Sparkles size={16} />
                    Analyze meeting
                    <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-[#f8f9fc] text-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#6366f1]">
                    <Loader2 size={28} className="animate-spin" />
                  </div>

                  <h3 className="mt-5 text-base font-bold">
                    Processing your meeting
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-[#8993a6]">
                    Transcribing audio and extracting the most important
                    information.
                  </p>
                </div>
              )}
            </div>

            {/* Meetings */}
            <div className="rounded-[24px] border border-[#e3e7ef] bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-[#edf0f5] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8993a6]">
                    Library
                  </p>

                  <h3 className="mt-1 text-xl font-bold tracking-tight">
                    Recent meetings
                  </h3>
                </div>

                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3b5]"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search meetings..."
                    className="w-full rounded-xl border border-[#e1e5ed] bg-[#fafbfc] py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#6366f1] sm:w-52"
                  />
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <Loader2
                      size={25}
                      className="animate-spin text-[#6366f1]"
                    />
                  </div>
                ) : filteredMeetings.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-2">
                    {filteredMeetings.map((meeting) => (
                      <MeetingRow
                        key={meeting.id}
                        meeting={meeting}
                        onSelect={handleSelect}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {selected && (
        <MeetingModal
          meeting={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e3e7ef] bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1f3ff] text-[#5c62d8]">
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-medium text-[#8993a6]">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function MeetingRow({ meeting, onSelect, onDelete }) {
  const status =
    meeting.status === "COMPLETED"
      ? "completed"
      : meeting.status === "FAILED"
      ? "failed"
      : "processing";

  return (
    <div
      onClick={() => onSelect(meeting)}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-transparent p-4 transition hover:border-[#e3e7ef] hover:bg-[#fafbfc]"
    >
      <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-[#6268d8] sm:flex">
        <FileAudio size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="truncate text-sm font-semibold">
            {meeting.title || meeting.fileName || "Untitled meeting"}
          </h4>

          <StatusBadge status={status} />
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-[#8a94a7]">
          {meeting.summary || "Summary is being generated..."}
        </p>

        <div className="mt-2 flex items-center gap-3 text-[10px] text-[#a0a8b7]">
          <span className="flex items-center gap-1">
            <Clock3 size={11} />
            {meeting.createdAt
              ? new Date(meeting.createdAt).toLocaleDateString()
              : "Recently"}
          </span>

          {meeting.fileName && (
            <span className="hidden truncate sm:block">
              {meeting.fileName}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(meeting.id);
        }}
        className="rounded-lg p-2 text-[#b0b7c5] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        title="Delete meeting"
      >
        <Trash2 size={15} />
      </button>

      <ArrowRight
        size={16}
        className="text-[#c1c7d2] transition group-hover:translate-x-1 group-hover:text-[#6366f1]"
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    completed: "bg-emerald-50 text-emerald-600",
    processing: "bg-amber-50 text-amber-600",
    failed: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-[#fafbfc] text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#a0a8b7] shadow-sm">
        <FileText size={22} />
      </div>

      <h4 className="mt-4 text-sm font-bold">No meetings found</h4>

      <p className="mt-1 max-w-xs text-xs leading-5 text-[#919aab]">
        Upload your first meeting recording and your AI workspace will start
        building a searchable library.
      </p>
    </div>
  );
}

function MeetingModal({ meeting, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101827]/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[26px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e8ebf1] px-6 py-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b95a8]">
              Meeting analysis
            </p>

            <h2 className="mt-1 truncate text-xl font-bold">
              {meeting.title || meeting.fileName || "Meeting details"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#8993a6] hover:bg-[#f4f6f9] hover:text-[#172033]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailCard
              icon={<Sparkles size={17} />}
              title="AI Summary"
            >
              <p className="text-sm leading-6 text-[#657084]">
                {meeting.summary || "No summary available."}
              </p>
            </DetailCard>

            <DetailCard
              icon={<CheckCircle2 size={17} />}
              title="Key Decisions"
            >
              {meeting.keyDecisions?.length ? (
                <ul className="space-y-2">
                  {meeting.keyDecisions.map((item, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm leading-5 text-[#657084]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366f1]" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#9aa3b5]">
                  No decisions extracted.
                </p>
              )}
            </DetailCard>
          </div>

          <DetailCard
            icon={<ListChecks size={17} />}
            title="Action Items"
            className="mt-4"
          >
            {meeting.actionItems?.length ? (
              <div className="space-y-2">
                {meeting.actionItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-xl border border-[#e8ebf1] bg-[#fafbfc] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {item.task}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#8993a6]">
                        <Users size={12} />
                        {item.owner || "Unassigned"}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#eef2ff] px-2.5 py-1 text-[10px] font-bold text-[#5b61d5]">
                      {item.priority || "Medium"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9aa3b5]">
                No action items extracted.
              </p>
            )}
          </DetailCard>

          <DetailCard
            icon={<FileText size={17} />}
            title="Full Transcript"
            className="mt-4"
          >
            <div className="max-h-64 overflow-y-auto rounded-xl bg-[#f7f8fb] p-4">
              <p className="whitespace-pre-wrap text-xs leading-6 text-[#717c90]">
                {meeting.transcript || "No transcript available."}
              </p>
            </div>
          </DetailCard>
        </div>

        <div className="flex items-center justify-between border-t border-[#e8ebf1] bg-[#fafbfc] px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[#8b95a8]">
            <Play size={13} />
            MeetMind analysis
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-[#172033] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#252f45]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#e5e9f0] bg-white p-5 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef2ff] text-[#6066d8]">
          {icon}
        </div>

        <h3 className="text-sm font-bold">{title}</h3>
      </div>

      {children}
    </section>
  );
}