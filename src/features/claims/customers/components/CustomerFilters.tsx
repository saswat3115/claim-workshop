type CustomerFiltersProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isFetching?: boolean;
};

export function CustomerFilters({ value, onChange, onSubmit, isFetching }: CustomerFiltersProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex w-full max-w-[320px] items-center rounded-2xl border border-shell-border bg-white px-3.5 py-2.5 text-sm text-shell-muted"
    >
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search"
        aria-label="Search customers"
        className="w-full bg-transparent outline-none placeholder:text-shell-muted"
      />
      <button
        type="submit"
        className="ml-2 rounded-xl bg-shell-panelSoft px-3 py-1.5 text-xs font-medium text-shell-text transition hover:bg-shell-border"
      >
        {isFetching ? 'Searching' : 'Enter'}
      </button>
    </form>
  );
}
