import Link from "next/link";
import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🇮🇳</span>
          <span className="font-display text-lg font-extrabold tracking-tight text-navy">
            Team India <Heart className="mb-1 inline" size={16} fill="#e11d48" color="#e11d48" /> Heart Wall
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link href="/#wall" className="hidden text-sm font-medium text-navy/70 hover:text-navy sm:block">
            Heart Wall
          </Link>
          <Link href="/#communities" className="hidden text-sm font-medium text-navy/70 hover:text-navy sm:block">
            Communities
          </Link>
          <Link
            href="/join"
            className="animate-pulse-glow rounded-full bg-heart px-4 py-2 text-sm font-semibold text-white shadow-md shadow-heart/20 transition hover:bg-heart-deep"
          >
            Add Your Heart ❤️
          </Link>
        </nav>
      </div>
    </header>
  );
}
