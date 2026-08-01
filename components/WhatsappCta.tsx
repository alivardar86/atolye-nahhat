"use client";

import { ReactNode } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { logWhatsappTik } from "@/lib/analytics-actions";

export function WhatsappCta({
  urunId,
  message,
  children,
}: {
  urunId: string;
  message: string;
  children: ReactNode;
}) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        logWhatsappTik(urunId).catch(() => {});
      }}
      className="mt-nh-18 h-nh-52 flex items-center justify-center gap-nh-10 bg-ink hover:bg-ink-hover text-paper font-semibold text-xl rounded-nh"
    >
      <span className="w-2 h-2 rounded-full bg-success inline-block" />
      {children}
    </a>
  );
}
