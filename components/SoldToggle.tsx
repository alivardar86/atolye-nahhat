export function SoldToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex items-center gap-nh-9 h-9 px-nh-12 bg-transparent border border-border rounded-nh text-lg text-ink cursor-pointer"
    >
      <span
        className={`w-8.5 h-5 rounded-pill flex items-center p-0.5 transition-colors shrink-0 ${
          checked ? "bg-accent justify-end" : "bg-border justify-start"
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-paper block" />
      </span>
      Satılanları da göster
    </button>
  );
}
