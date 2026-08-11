import { Search } from 'lucide-react';

type CustomerSearchProps = {
  value: string;
  onChange: (value: string) => void;
  isFetching?: boolean;
};

export function CustomerSearch({ value, onChange, isFetching }: CustomerSearchProps) {
  return (
    <label className="flex w-full max-w-[270px] items-center gap-3 rounded-2xl border border-shell-border bg-white px-3.5 py-2.5 text-sm text-shell-muted">
      <Search className={isFetching ? 'h-4 w-4 animate-pulse' : 'h-4 w-4'} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search"
        className="w-full bg-transparent outline-none placeholder:text-shell-muted"
      />
    </label>
  );
}
