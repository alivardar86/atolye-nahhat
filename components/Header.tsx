"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/lib/whatsapp";

export function Header() {
  const pathname = usePathname();
  const onKatalog = pathname === "/";
  const onHakkinda = pathname === "/hakkinda";

  return (
    <header className="border-b border-border sticky top-0 z-20 bg-panel">
      <div className="h-nh-52 sm:h-16 px-nh-16 sm:px-nh-40 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-nh-14 min-w-0">
          <span className="text-lg-plus sm:text-4xl font-extrabold tracking-nh-snug-sm whitespace-nowrap">
            ATÖLYE NAHHAT
          </span>
          <span className="hidden sm:inline font-mono text-sm text-muted tracking-nh-wide whitespace-nowrap">
            nahhat · ahşap oyan, yontan
          </span>
        </Link>

        <nav className="flex items-center gap-nh-16 sm:gap-nh-28">
          <Link
            href="/"
            className={`hidden sm:inline text-lg ${onKatalog ? "text-ink" : "text-muted"}`}
          >
            Katalog
          </Link>
          <Link
            href="/hakkinda"
            className={`font-mono text-sm sm:font-sans sm:text-lg tracking-nh-wide-md sm:tracking-normal uppercase sm:normal-case ${
              onHakkinda ? "text-ink" : "text-muted"
            }`}
          >
            Hakkında
          </Link>
          <a
            href={whatsappUrl("Merhaba, Atölye Nahhat hakkında bilgi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-nh-8 h-9 px-nh-16 rounded-nh bg-ink hover:bg-ink-hover text-paper text-md font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
