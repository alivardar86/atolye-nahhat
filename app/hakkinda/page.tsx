import type { Metadata } from "next";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Hakkında — Atölye Nahhat",
  description:
    "On yıllık bir el aleti atölyesinin hikayesi ve neden kapandığı.",
};

export default function HakkindaPage() {
  return (
    <div className="px-nh-16 sm:px-nh-40 py-nh-24 sm:py-nh-52 max-w-[68ch]">
      <div className="font-mono text-xs-plus uppercase tracking-nh-eyebrow text-accent mb-nh-12 sm:mb-nh-18">
        Atölye Nahhat · İzmir
      </div>

      <h1 className="m-0 text-6xl sm:text-9xl font-bold leading-[1.1] tracking-nh-tight-lg sm:tracking-nh-tighter text-balance">
        On yıllık bir atölyenin son sayfası.
      </h1>

      <p className="font-serif italic text-lg-plus sm:text-2xl leading-relaxed text-body mt-nh-18 sm:mt-nh-24">
        Adım Levent. Ahşabı elle işlemeyi, oyup yontmayı bu aletlerle öğrendim
        — şimdi atölyeyi kapatıyorum ve onları bırakıyorum.
      </p>

      <div className="mt-nh-28 sm:mt-nh-40 flex flex-col gap-nh-18 text-lg sm:text-xl-plus leading-relaxed text-body">
        <p>
          Yıllar içinde elime çok alet geçti: bazısını ustamdan devraldım,
          bazısını kendim aradım buldum, çoğunu uzun süre kullanıp bildim,
          düzelttim. Hepsi gerçek işte çalıştı — vitrin için alınmış, hiç
          kullanılmamış bir alet neredeyse yok burada.
        </p>
        <p>
          Atölyeyi kapatma kararını verince aletleri tek tek elimden
          geçirdim. Kusuru neyse yazdım, eksiği neyse söyledim. Fiyatları da
          bugün aynısının internette ne kadara satıldığına bakarak koydum —
          çoğu ondan ucuza gidiyor, çünkü amacım hepsini elimden çıkarmak,
          en yükseğe satmak değil.
        </p>
        <p>
          Sitede sepet yok, online ödeme yok. Bir alet ilgini çekerse
          WhatsApp&apos;tan yazıyorsun, konuşuyoruz, anlaşırsak buluşuyoruz.
          Tek satıcı, tek numara — pazarlık için de yazabilirsin.
        </p>
      </div>

      <a
        href={whatsappUrl("Merhaba, Atölye Nahhat hakkında bilgi almak istiyorum.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-nh-28 sm:mt-nh-40 inline-flex items-center gap-nh-10 h-nh-52 px-nh-24 rounded-nh bg-ink hover:bg-ink-hover text-paper text-lg font-semibold w-fit"
      >
        <span className="w-2 h-2 rounded-full bg-success inline-block" />
        WhatsApp&apos;tan yaz
      </a>
    </div>
  );
}
