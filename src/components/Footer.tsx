import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-navy py-8 text-center text-white/70">
      <div className="mx-auto max-w-6xl px-4">
        <Image
          src="/logo.jpg"
          alt="India Club of Greater Dayton — Team India"
          width={36}
          height={36}
          className="mx-auto rounded-full"
        />
        <p className="mt-2 font-display text-sm font-semibold text-white">Team India ❤️ Heart Wall</p>
        <p className="mt-1 text-xs">One Team. One Heart. — Heart Walk, September 26, 2026.</p>
        <p className="mt-4 text-[11px] text-white/40">
          Contact information stays private and is only visible to authorized campaign administrators.
        </p>
        <p className="mt-4 border-t border-white/10 pt-4 text-[11px] text-white/40">
          Designed with ❤️ by{" "}
          <a
            href="https://adopnet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white/70 underline underline-offset-2 hover:text-white"
          >
            AdopNet
          </a>
        </p>
      </div>
    </footer>
  );
}
