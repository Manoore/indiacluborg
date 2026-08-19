import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.jpg" alt="India Club of Greater Dayton — Team India" width={40} height={40} className="rounded-full" priority />
          <span className="font-display text-base font-extrabold leading-tight tracking-tight text-navy sm:text-lg">
            Team India
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-foreground/50 sm:text-xs">
              Heart Wall
            </span>
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
