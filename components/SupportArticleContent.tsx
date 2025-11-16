"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Post } from "@/lib/posts";

type Heading = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

type Props = {
  post: Post;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=<>?,./:;"'|[\]\\{}]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

// Extract #, ##, ### headings from markdown (ignores code blocks)
function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (line.startsWith("# ")) {
      const text = line.replace(/^#\s+/, "").trim();
      headings.push({ level: 1, text, id: slugify(text) });
    } else if (line.startsWith("## ")) {
      const text = line.replace(/^##\s+/, "").trim();
      headings.push({ level: 2, text, id: slugify(text) });
    } else if (line.startsWith("### ")) {
      const text = line.replace(/^###\s+/, "").trim();
      headings.push({ level: 3, text, id: slugify(text) });
    }
  }

  return headings;
}

// Inline code renderer only (safe inside <p>)
function InlineCode({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const rawText = String(children ?? "");
  const codeText = rawText.replace(/\n$/, "");

  // If somehow ReactMarkdown thinks this is block, let pre handle it
  if (!inline) {
    return (
      <code
        {...props}
        className={`block ${className || ""}`}
      >
        {codeText}
      </code>
    );
  }

  return (
    <code
      {...props}
      className="rounded bg-slate-100 px-1.5 text-[13px] font-mono text-[#1C3E66]"
    >
      {codeText}
    </code>
  );
}

// Block code wrapper on <pre> – handles language + copy button
function PreWithCopy(props: any) {
  const { children, ...rest } = props;
  const child = Array.isArray(children) ? children[0] : children;

  let codeText = "";
  let lang = "";
  let codeClassName = "";

  if (child && typeof child === "object" && "props" in child) {
    const c: any = child;
    codeText = String(c.props.children ?? "").replace(/\n$/, "");
    codeClassName = c.props.className || "";
    const match = /language-(\w+)/.exec(codeClassName);
    lang = match?.[1] || "";
  }

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore copy errors
    }
  };

  // Outer wrapper is a <div> at block level – never inside <p>, so no nesting issues
  return (
    <div className="group relative mt-3 mb-4 w-full rounded-xl border border-slate-800/70 bg-slate-950">
      {/* Header bar with language + copy button */}
      <div className="flex items-center justify-between rounded-t-[11px] border-b border-slate-800/80 bg-slate-900 px-3 py-1 text-xs text-slate-200">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          <span className="uppercase tracking-wide text-[11px] text-slate-300">
            {lang || "code"}
          </span>
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900/60 px-2 py-0.5 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800/80"
        >
          <svg
            className="h-3.5 w-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75H7.5A2.25 2.25 0 0 0 5.25 9v7.5A2.25 2.25 0 0 0 7.5 18.75H15a2.25 2.25 0 0 0 2.25-2.25V15M9.75 15.75h6.75A2.25 2.25 0 0 0 18.75 13.5V7.5A2.25 2.25 0 0 0 16.5 5.25H11.5A2.25 2.25 0 0 0 9.25 7.5Z"
            />
          </svg>
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Actual code block – slimmer vertical padding */}
      <pre
        {...rest}
        className="overflow-x-auto rounded-b-[11px] bg-slate-950 text-slate-50"
      >
        <code
          className={`block px-2 py-0 text-[13px] font-mono leading-snug ${codeClassName}`}
          data-lang={lang}
        >
          {codeText}
        </code>
      </pre>
    </div>
  );
}

export function SupportArticleContent({ post }: Props) {
  const headings = useMemo(() => extractHeadings(post.content), [post.content]);
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );

  // Scrollspy using scroll position — works scrolling down AND up
  useEffect(() => {
    if (!headings.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset for header / padding
      let currentId = headings[0]?.id ?? null;

      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;

        const top = el.offsetTop;
        if (top <= scrollPosition) {
          currentId = h.id;
        } else {
          break;
        }
      }

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    // Initial run
    handleScroll();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings, activeId]);

  return (
    <main className="mx-auto w-[90%] py-8 md:py-10">
      {/* Top breadcrumb / meta bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs">
            <span className="rounded-full bg-[#1C3E66]/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C3E66]">
              Support Writeup
            </span>
            <span className="text-[11px] text-slate-500">
              {post.category ?? "General"}
            </span>
          </div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="max-w-2xl text-sm text-slate-600 md:text-[15px]">
              {post.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-1 text-xs text-slate-500 md:items-end">
          <span>
            Last updated{" "}
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Knowledge base · Welford IAG
          </span>
        </div>
      </div>

      {/* Layout: content + TOC */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.8fr)_minmax(0,0.9fr)] lg:gap-10">
        {/* MAIN ARTICLE */}
        <div className="space-y-4">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Markdown content */}
          <div className="markdown-body mt-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1({ node, children, ...props }) {
                  const text = String(children ?? "");
                  const id = slugify(text);
                  return (
                    <h1
                      id={id}
                      {...props}
                      className="mt-6 mb-3 scroll-mt-24 text-3xl font-semibold text-slate-900"
                    >
                      {children}
                    </h1>
                  );
                },
                h2({ node, children, ...props }) {
                  const text = String(children ?? "");
                  const id = slugify(text);
                  return (
                    <h2
                      id={id}
                      {...props}
                      className="mt-8 mb-3 scroll-mt-24 text-2xl font-semibold text-slate-900"
                    >
                      {children}
                    </h2>
                  );
                },
                h3({ node, children, ...props }) {
                  const text = String(children ?? "");
                  const id = slugify(text);
                  return (
                    <h3
                      id={id}
                      {...props}
                      className="mt-6 mb-2 scroll-mt-24 text-xl font-semibold text-slate-900"
                    >
                      {children}
                    </h3>
                  );
                },
                code: InlineCode,
                pre: PreWithCopy,
                a({ node, ...props }) {
                  return (
                    <a
                      {...props}
                      className="font-medium text-[#1C3E66] underline-offset-2 hover:underline"
                    />
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer back link */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[#1C3E66] hover:text-[#162d4b]"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              Back to all writeups
            </Link>

            <p>
              Built for{" "}
              <span className="font-medium text-slate-900">Welford IAG</span>{" "}
              support teams.
            </p>
          </div>
        </div>

        {/* TOC SIDEBAR WITH LIVE HIGHLIGHT – HIDDEN ON MOBILE */}
        <aside className="hidden md:block md:border-l md:border-slate-200 md:pl-6 lg:pl-8">
          <div className="sticky top-24 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Table of contents
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Live-tracking headings as you scroll.
              </p>
            </div>

            {headings.length === 0 ? (
              <p className="text-xs text-slate-400">
                Add <code className="bg-slate-100 px-1 py-0.5">#</code>,{" "}
                <code className="bg-slate-100 px-1 py-0.5">##</code> or{" "}
                <code className="bg-slate-100 px-1 py-0.5">###</code> headings
                in your markdown to see a TOC here.
              </p>
            ) : (
              <nav className="space-y-1 rounded-xl bg-slate-50 px-3.5 py-3 text-sm text-slate-700">
                {headings.map((h) => {
                  const paddingLeft =
                    h.level === 1
                      ? "0.75rem"
                      : h.level === 2
                      ? "1.5rem"
                      : "2.25rem";

                  return (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] leading-relaxed transition-colors ${
                        activeId === h.id
                          ? "bg-[#1C3E66]/5 text-[#1C3E66] font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                      style={{ paddingLeft }}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          activeId === h.id
                            ? "bg-[#1C3E66]"
                            : "bg-slate-300 group-hover:bg-slate-500"
                        }`}
                      />
                      <span className="truncate">{h.text}</span>
                    </a>
                  );
                })}
              </nav>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
