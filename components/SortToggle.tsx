export function SortToggle({
  sort,
  onChange,
}: {
  sort: "asc" | "desc";
  onChange: (s: "asc" | "desc") => void;
}) {
  const btn = (on: boolean) =>
    `px-nh-12 h-9 font-mono text-md cursor-pointer ${on ? "bg-ink text-paper" : "bg-paper text-ink"}`;

  return (
    <div className="flex border border-border rounded-nh overflow-hidden">
      <button
        type="button"
        onClick={() => onChange("asc")}
        aria-pressed={sort === "asc"}
        className={`${btn(sort === "asc")} border-r border-border`}
      >
        Fiyat ↑
      </button>
      <button
        type="button"
        onClick={() => onChange("desc")}
        aria-pressed={sort === "desc"}
        className={btn(sort === "desc")}
      >
        Fiyat ↓
      </button>
    </div>
  );
}
