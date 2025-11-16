import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welford IAG Support Portal",
  description:
    "Search-friendly writeups, how-tos, and troubleshooting guides for Welford Identity & Access Governance (IAG).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning fixes extension-injected attrs like cz-shortcut-listen */}
      <body
        suppressHydrationWarning
        className="bg-slate-50 text-slate-900 antialiased"
      >
        <div className="min-h-screen support-gradient-bg">
          <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex w-[90%] max-w-[1440px] items-center justify-between px-0 py-3 md:py-3.5">
              {/* Left – Logo + Title (clickable) */}
              <Link
                href="/"
                aria-label="Welford IAG Support Home"
                className="flex items-center gap-3 rounded-lg px-1 py-1 transition hover:bg-slate-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-md shadow-brand/30">
                  <span className="text-sm font-semibold text-white">IAG</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold tracking-tight text-slate-900">
                    Welford IAG Support
                  </p>
                  <p className="text-xs text-slate-500">
                    Search writeups. Solve issues faster.
                  </p>
                </div>
              </Link>

              {/* Right – Status / Tagline */}
              <div className="hidden items-center gap-3 text-xs text-slate-500 md:flex">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Online</span>
                </span>
                <span className="hidden md:inline">
                  Knowledge-first support portal
                </span>
              </div>
            </div>
          </header>

          <main className="mx-auto w-[85%] max-w-[1440px] pb-12 pt-8 md:pt-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
