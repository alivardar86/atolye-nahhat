import Link from "next/link";

export type TopViewedRow = {
  id: string;
  title: string;
  kategori_ad: string;
  views: number;
  clicks: number;
};

export function TopViewedTable({ rows }: { rows: TopViewedRow[] }) {
  return (
    <div className="mb-nh-28">
      <h2 className="text-3xl font-bold mb-nh-4">En çok bakılanlar</h2>
      <div className="text-sm text-muted mb-nh-8">
        Son 30 gün · görüntülemeye göre sıralı, ilk 10
      </div>

      {rows.length === 0 ? (
        <div className="border border-border rounded-nh p-nh-16 text-sm text-muted bg-paper">
          Son 30 günde kayıtlı görüntüleme yok.
        </div>
      ) : (
        <div className="border border-border rounded-nh overflow-hidden">
          {rows.map((r, i) => {
            const ratio = Math.round((r.clicks / r.views) * 100);
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-center gap-nh-12 p-nh-12 border-b border-border last:border-b-0 bg-paper"
              >
                <div className="w-6 font-mono text-sm text-muted shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-[180px]">
                  <Link href={`/panel/urun/${r.id}`} className="font-semibold">
                    {r.title}
                  </Link>
                  <div className="text-sm text-muted">{r.kategori_ad}</div>
                </div>
                <div className="font-mono text-sm text-muted whitespace-nowrap">
                  {r.views} görüntülenme · {r.clicks} tık · %{ratio} tıklama oranı
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
