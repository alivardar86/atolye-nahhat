import Link from "next/link";
import { requireUser } from "@/lib/panel/require-user";
import { signOut } from "@/lib/panel/auth-actions";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border bg-panel">
        <div className="px-nh-16 sm:px-nh-40 h-nh-52 flex items-center justify-between">
          <Link href="/panel" className="text-lg-plus font-extrabold tracking-nh-snug-sm">
            NAHHAT PANEL
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="h-9 px-nh-16 rounded-nh border border-border text-sm-plus font-semibold hover:bg-paper"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
