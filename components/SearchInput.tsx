export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-nh-8 bg-paper border border-border rounded-nh px-nh-12 h-9 w-full sm:w-65">
      <span className="font-mono text-md text-muted">/</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="marka, model veya tip ara"
        className="border-0 bg-transparent outline-none w-full text-lg text-ink placeholder:text-placeholder"
      />
    </div>
  );
}
