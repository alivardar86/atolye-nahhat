interface HeroStats {
  toplam: number;
  satilik: number;
  ayrildi: number;
  satildi: number;
  altındaSayisi: number;
  ortalamaIndirim: number | null;
}

export function Hero({ stats }: { stats: HeroStats }) {
  return (
    <section className="border-b border-border px-nh-16 pt-nh-24 pb-nh-20 sm:px-nh-40 sm:pt-nh-52 sm:pb-nh-44">
      <div className="sm:grid sm:grid-cols-[1.15fr_1fr] sm:gap-nh-64">
        <div>
          <div className="font-mono text-xs-plus uppercase tracking-nh-eyebrow text-accent mb-nh-12 sm:mb-nh-18">
            Atölye kapanıyor · envanter satışı
          </div>
          <h1 className="m-0 text-6xl sm:text-10xl font-bold leading-[1.1] tracking-nh-tight-lg sm:tracking-nh-tighter max-w-[15ch] text-balance">
            On yıl bu aletlerle çalıştım. Şimdi sırası gelen ustaya bırakıyorum.
          </h1>
          <p className="font-serif italic text-lg-plus sm:text-2xl leading-relaxed text-body mt-nh-14 sm:mt-nh-22 max-w-[52ch]">
            Hepsini tek tek elimden geçirdim, bilediklerini biledim, kırığını
            çıkığını yazdım. Fiyatları bugün Türkiye’de internetten ne kadara
            alınıyorsa ona göre koydum — çoğu daha ucuz.
          </p>
        </div>
        <div className="mt-nh-18 pt-nh-18 border-t border-border sm:mt-0 sm:pt-0 sm:border-t-0 sm:border-l sm:border-border sm:pl-nh-40 flex flex-col sm:justify-end">
          <StatRow label="Toplam kayıt" value={String(stats.toplam)} />
          <StatRow label="Satılık" value={String(stats.satilik)} bold />
          <StatRow label="Ayrıldı" value={String(stats.ayrildi)} />
          <StatRow label="Satıldı" value={String(stats.satildi)} />
          {stats.ortalamaIndirim !== null && (
            <StatRow
              label={`${stats.altındaSayisi} alet piyasanın altında`}
              value={`ort. −${stats.ortalamaIndirim}%`}
              accent
              noBorder
            />
          )}
        </div>
      </div>
    </section>
  );
}

function StatRow({
  label,
  value,
  bold,
  accent,
  noBorder,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  noBorder?: boolean;
}) {
  return (
    <div
      className={`flex justify-between font-mono text-md py-nh-11 ${noBorder ? "" : "border-b border-border"}`}
    >
      <span className="text-muted">{label}</span>
      <span
        className={`${bold ? "font-semibold" : ""} ${accent ? "text-accent font-semibold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
