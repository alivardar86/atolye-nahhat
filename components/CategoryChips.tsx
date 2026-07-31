interface Chip {
  slug: string;
  label: string;
  count: number;
}

export function CategoryChips({
  chips,
  active,
  onSelect,
}: {
  chips: Chip[];
  active: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="flex gap-nh-8 flex-wrap">
      {chips.map((c) => {
        const on = c.slug === active;
        const dead = c.count === 0;
        return (
          <button
            key={c.slug}
            type="button"
            onClick={() => onSelect(c.slug)}
            className={`flex items-center gap-nh-7 h-9 px-nh-12 rounded-nh whitespace-nowrap text-md-plus border ${
              on
                ? "bg-ink text-paper border-ink font-semibold"
                : dead
                  ? "bg-paper text-disabled border-border opacity-60"
                  : "bg-paper text-ink border-border"
            }`}
          >
            <span>{c.label}</span>
            <span
              className={`font-mono text-sm ${on ? "text-chip-count" : "text-muted"}`}
            >
              {c.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
