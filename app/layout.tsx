import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beginner Fitness Coach",
  description: "Simple, motivational fitness app for total beginners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-tr from-brand-500 to-emerald-400" />
                <span className="text-sm font-semibold tracking-tight text-slate-50">
                  Beginner Fitness
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">{children}</div>
          </main>
          <footer className="border-t border-slate-800 bg-slate-950/80">
            <div className="mx-auto max-w-4xl px-4 py-4 text-center text-xs text-slate-500">
              Built for total beginners. Phase 1: auth & dashboard.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
