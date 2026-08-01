// Builds a wa.me link with the tool name + price pre-filled, per CLAUDE.md.
export function whatsappUrl(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
