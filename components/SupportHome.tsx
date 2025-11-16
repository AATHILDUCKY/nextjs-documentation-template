"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PostMeta } from "@/lib/posts";

type Props = {
  posts: PostMeta[];
};

export function SupportHome({ posts }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.description,
        post.category,
        ...(post.tags ?? []),
        ...(post.keywords ?? [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [query, posts]);

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Hero / Search */}
      <section className="support-card relative px-5 py-7 md:px-7 md:py-9">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 md:space-y-5 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Support Portal
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Find Welford IAG writeups in seconds.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-700">
              Search across how-tos, troubleshooting guides, and runbooks.
              Results update instantly so your team can move from issue to
              solution without digging through tickets.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-[13px] text-slate-700">
              <span className="support-chip border-brand/30 bg-brand/5 text-brand">
                Auto-suggested articles
              </span>
              <span className="support-chip">Built for IAG workflows</span>
              <span className="support-chip">Markdown / MDX knowledge base</span>
            </div>
          </div>

          <div className="w-full max-w-lg md:w-[420px]">
            <label className="block text-sm font-medium text-slate-800">
              Search writeups
            </label>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <svg
                className="h-5 w-5 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.7"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 5.25 5.25 7.5 7.5 0 0 0 16.65 16.65Z"
                />
              </svg>
              <input
                className="h-10 flex-1 bg-transparent text-sm md:text-base text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Search by error message, feature, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs md:text-[13px] text-slate-500 hover:text-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="mt-2 text-xs md:text![13px] text-slate-500">
              Try{" "}
              <button
                type="button"
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs md:text-[13px] text-slate-700 hover:bg-slate-200"
                onClick={() => setQuery("provisioning")}
              >
                "provisioning delay"
              </button>{" "}
              or{" "}
              <button
                type="button"
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs md:text-[13px] text-slate-700 hover:bg-slate-200"
                onClick={() => setQuery("login failure")}
              >
                "login failure"
              </button>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Results summary */}
      <section className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand px-3 py-1.5 text-[11px] md:text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Knowledge base
          </span>
          <span>
            <span className="font-medium">{filtered.length}</span> article
            {filtered.length === 1 ? "" : "s"}{" "}
            {query
              ? `matching “${query.trim()}”`
              : "available for your team"}
          </span>
        </div>

        {query && (
          <p className="text-xs text-slate-500">
            Showing auto-filtered suggestions based on your query.
          </p>
        )}
      </section>

      {/* Cards grid */}
      <section>
        {filtered.length === 0 ? (
          <div className="support-card flex flex-col items-center justify-center gap-3 px-8 py-12 text-center">
            <p className="text-base font-medium text-slate-900">
              No writeups found.
            </p>
            <p className="max-w-md text-sm text-slate-600">
              Try using a different keyword or simplify your search. For
              example, remove environment names, tenant IDs, or timestamps.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/support/${post.slug}`}
                className="group block h-full"
              >
                <article className="support-card relative flex h-full flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-[3px]">
                  {/* Header strip */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] md:text-xs font-medium text-slate-700">
                      {post.category ?? "General"}
                    </span>
                    <span className="text-[11px] md:text-xs text-slate-500">
                      {new Date(post.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit"
                      })}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-3 px-5 py-4">
                    <h2 className="line-clamp-2 text-sm md:text-base font-semibold tracking-tight text-slate-900 group-hover:text-brand">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 text-xs md:text-sm leading-relaxed text-slate-600">
                      {post.description}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2.5 py![3px] text-[11px] font-medium text-slate-700 group-hover:bg-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs md:text-[13px] text-slate-500">
                      <span className="hidden md:inline">
                        ID:{" "}
                        <span className="font-mono text-slate-700">
                          {post.slug}
                        </span>
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1 text-brand group-hover:text-brand/80">
                        Read article
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.7"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 19.5 19.5 4.5M19.5 4.5H8.25M19.5 4.5v11.25"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
