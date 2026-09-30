"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { naira } from "@/lib/format";

type Msg = { id: number; sender: string; body: string; createdAt: string };

const QUICK_REPLIES = [
  "I have fever and headache",
  "My BP reading is high",
  "My child has been vomiting",
  "I feel anxious and can't sleep",
];

export default function ConsultRoom({
  appointmentId,
  doctorName,
  doctorPhoto,
  specialty,
  mode,
  status,
  feeKobo,
  initialMessages,
}: {
  appointmentId: number;
  doctorName: string;
  doctorPhoto: string;
  specialty: string;
  mode: string;
  status: string;
  feeKobo: number;
  initialMessages: Msg[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [live, setLive] = useState(mode === "video" || mode === "voice");
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(status === "completed");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!live || done) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [live, done]);

  const send = async (value?: string) => {
    const body = (value ?? text).trim();
    if (!body || sending) return;
    setText("");
    setSending(true);
    setMessages((m) => [
      ...m,
      { id: Date.now(), sender: "patient", body, createdAt: new Date().toISOString() },
    ]);
    setTyping(true);
    const res = await fetch(`/api/consult/${appointmentId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json().catch(() => ({}));
    setTimeout(() => {
      if (data.messages) setMessages(data.messages);
      setTyping(false);
      setSending(false);
    }, 900);
  };

  const finish = async () => {
    setSending(true);
    const res = await fetch(`/api/consult/${appointmentId}/complete`, { method: "POST" });
    setSending(false);
    if (res.ok) {
      setDone(true);
      setLive(false);
      router.refresh();
    }
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl">{doctorPhoto}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{doctorName}</p>
            <p className="text-xs text-slate-500">
              {specialty} · {done ? "Consultation closed" : "Online"}
            </p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            {naira(feeKobo)} paid
          </span>
        </div>

        {live && !done && (
          <div className="gradient-hero relative p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50">{mode === "video" ? "Video" : "Voice"} consultation</p>
                <p className="text-2xl font-bold tabular-nums">{mmss}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
                <span className="text-xs text-white/70">Encrypted & connected</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              {mode === "video" && (
                <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-black/40">
                  <div className="absolute inset-0 grid place-items-center text-5xl">{doctorPhoto}</div>
                  <div className="absolute bottom-2 right-2 grid h-16 w-12 place-items-center rounded-lg bg-white/15 text-xl">
                    🙂
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <button className="grid h-11 w-11 place-items-center rounded-full bg-white/15">🎙️</button>
              <button className="grid h-11 w-11 place-items-center rounded-full bg-white/15">🔊</button>
              <button
                onClick={() => setLive(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-red-500"
              >
                📵
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-white/40">
              Poor network? Switch to chat — it uses 95% less data.
            </p>
          </div>
        )}

        <div className="h-[46vh] space-y-3 overflow-y-auto bg-[#f7faf9] p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "patient" ? "justify-end" : m.sender === "system" ? "justify-center" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.sender === "patient"
                    ? "rounded-br-sm bg-brand-600 text-white"
                    : m.sender === "system"
                      ? "bg-slate-200/70 text-center text-[11px] text-slate-600"
                      : "rounded-bl-sm border border-slate-100 bg-white"
                }`}
              >
                {m.body}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm border border-slate-100 bg-white px-4 py-3 text-sm text-slate-400">
                {doctorName.split(" ")[1] ?? "Doctor"} is typing…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {!done ? (
          <div className="border-t border-slate-100 p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto no-scrollbar">
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  onClick={() => send(r)}
                  className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Describe your symptoms…"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:bg-white"
              />
              <button
                onClick={() => send()}
                disabled={sending}
                className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Link href="/app/emergency" className="text-[11px] font-semibold text-red-600">
                🚨 This is an emergency
              </Link>
              <button onClick={finish} className="text-[11px] font-semibold text-brand-700">
                End consultation & get prescription →
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-100 p-4 text-center">
            <p className="text-sm font-semibold">Consultation completed ✅</p>
            <p className="mt-1 text-xs text-slate-500">
              Your doctor&apos;s notes and e-prescription are saved to your records.
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <Link href="/app/records" className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white">
                View prescription
              </Link>
              <Link href="/app/labs" className="rounded-xl bg-brand-50 px-4 py-2 text-xs font-bold text-brand-800">
                Order recommended tests
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="card p-4 text-xs text-slate-500">
        🔒 This conversation is encrypted and stored only in your health record. MyDoc247 does not
        share it with family, employers or insurers without your written consent.
      </div>
    </div>
  );
}
