"use client";

import React, { useState } from "react";
import Link from "next/link";

type DomainResult = {
  domain: string;
  status: string;
  price?: { amount: number; currency: string };
  isHot?: boolean;
};

export default function DomainSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | undefined>();
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setLoading(true);
    setResults([]);
    setWarning(undefined);
    setSearched(false);

    try {
      const res = await fetch("/api/domains/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
      setWarning(data.warning);
    } catch {
      setWarning("Search unavailable — please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const available = results.filter((r) => r.status === "free");
  const taken = results.filter((r) => r.status !== "free");

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 z-20">
      {/* Search bar */}
      <div className="relative bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-2xl p-2 border border-teal-500/30">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            id="domainSearch"
            name="domainSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for your Web3 Domain… (e.g. legacy.ai)"
            className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-neutral-600"
            autoComplete="off"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-500 text-neutral-950 font-bold px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:bg-teal-400 hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching…
              </>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>

      {/* Warning */}
      {warning && (
        <p className="mt-3 text-xs text-amber-400 text-center">{warning}</p>
      )}

      {/* Results */}
      {searched && !loading && (
        <div className="mt-4 rounded-2xl border border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-neutral-400 text-center">No results found. Try a different name.</p>
          ) : (
            <>
              {available.length > 0 && (
                <div>
                  <p className="px-5 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-teal-400">
                    Available
                  </p>
                  <ul>
                    {available.map((r) => (
                      <li
                        key={r.domain}
                        className="flex items-center justify-between px-5 py-3 border-t border-neutral-800/60 hover:bg-teal-500/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                          <span className="text-sm font-medium text-white">{r.domain}</span>
                          {r.isHot && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded-full">
                              Hot
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {r.price && (
                            <span className="text-xs font-semibold text-neutral-300">
                              {r.price.currency.toUpperCase()} {r.price.amount.toFixed(2)}/yr
                            </span>
                          )}
                          <Link
                            href={`/products/domains/registration?domain=${encodeURIComponent(r.domain)}`}
                            className="bg-teal-500 hover:bg-teal-400 text-neutral-950 text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
                          >
                            Register
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {taken.length > 0 && (
                <div>
                  <p className="px-5 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Taken
                  </p>
                  <ul>
                    {taken.map((r) => (
                      <li
                        key={r.domain}
                        className="flex items-center justify-between px-5 py-3 border-t border-neutral-800/60"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-neutral-600 shrink-0" />
                          <span className="text-sm text-neutral-500 line-through">{r.domain}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">Taken</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
