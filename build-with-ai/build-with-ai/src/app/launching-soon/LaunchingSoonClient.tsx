"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const LAUNCH_DATE = new Date("2026-06-14T00:00:00Z");

type Status = "idle" | "loading" | "success" | "error";

export default function LaunchingSoonClient() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const update = () => {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/launching-soon/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companySize,
          source: "launching-soon-app-router",
        }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setCompanySize("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!mounted) {
    return (
      <section className="mt-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-glass h-40 skeleton" />
          <div className="card-glass h-40 skeleton" />
        </div>
      </section>
    );
  }

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="mt-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: what you can do */}
        <div className="card-glass p-5 md:p-6 bg-neutral-950/70">
          <h2 className="text-xs md:text-sm tracking-[0.18em] uppercase text-neutral-400 mb-3">
            What You Can Do With Build With AI
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-neutral-700/60 bg-neutral-900/70 p-3 text-left">
              <h3 className="text-sm font-semibold mb-1 text-white">
                Launch Your Online Presence
              </h3>
              <p className="text-xs text-neutral-400">
                Beautiful, fast, and secure sites with zero dev‑ops overhead.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-700/60 bg-neutral-900/70 p-3 text-left">
              <h3 className="text-sm font-semibold mb-1 text-white">
                Automate Your Operations
              </h3>
              <p className="text-xs text-neutral-400">
                AI‑powered workflows that handle the busywork while you focus on growth.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-700/60 bg-neutral-900/70 p-3 text-left">
              <h3 className="text-sm font-semibold mb-1 text-white">
                Step Into Web3 Safely
              </h3>
              <p className="text-xs text-neutral-400">
                Smart wallet, identity, and rewards — without the complexity.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs md:text-sm text-neutral-400">
            Alpha Sign Up is limited — the first 100 customers receive a Founders Surprise Giveaway
            and priority onboarding.
          </p>
        </div>

        {/* Right: countdown + form */}
        <div className="card-glass p-5 md:p-6 bg-neutral-950/70">
          <h2 className="text-xs md:text-sm tracking-[0.18em] uppercase text-neutral-400 mb-3">
            Alpha Sign Up Countdown
          </h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-neutral-700/60 bg-neutral-900/80 px-2 py-3 text-center"
              >
                <div className="text-lg md:text-xl font-extrabold">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[0.6rem] uppercase tracking-[0.16em] text-neutral-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-neutral-700/70 bg-neutral-900/80 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full rounded-xl border border-neutral-700/70 bg-neutral-900/80 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Company size (optional)</option>
              <option value="solo">Solo / Creator</option>
              <option value="1-10">1–10</option>
              <option value="11-50">11–50</option>
              <option value="51-250">51–250</option>
              <option value="250+">250+</option>
            </select>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-black shadow-md transition hover:from-cyan-300 hover:to-blue-400 disabled:opacity-70"
            >
              {status === "loading" ? (
                "Processing..."
              ) : (
                <>
                  <span>Join the Alpha Sign Up List</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {status === "success" && (
            <p className="mt-2 text-xs text-cyan-300 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              You’re in. We’ll email your Alpha access details and Founders Surprise information.
            </p>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-red-400">
              Something went wrong. Please try again in a moment.
            </p>
          )}

          <p className="mt-3 text-[0.7rem] text-neutral-500">
            We’ll only email launch updates and access details. No spam. No resale. Ever.
          </p>
        </div>
      </div>
    </section>
  );
}
