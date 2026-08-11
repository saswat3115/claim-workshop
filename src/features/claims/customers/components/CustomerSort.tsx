import type { CustomerSortField } from '../types/types';

type CustomerSortProps = {
  field: CustomerSortField;
  direction: 'asc' | 'desc';
  onChange: (sort: { field: CustomerSortField; direction: 'asc' | 'desc' }) => void;
};

const options: Array<{ label: string; field: CustomerSortField; direction: 'asc' | 'desc' }> = [
  { label: 'Newest', field: 'createdAt', direction: 'desc' },
  { label: 'Oldest', field: 'createdAt', direction: 'asc' },
  { label: 'Customer Name A-Z', field: 'customerName', direction: 'asc' },
  { label: 'Customer Name Z-A', field: 'customerName', direction: 'desc' },
  { label: 'Company A-Z', field: 'company', direction: 'asc' },
  { label: 'Country A-Z', field: 'country', direction: 'asc' },
  { label: 'Status', field: 'status', direction: 'asc' },
  { label: 'Updated newest', field: 'updatedAt', direction: 'desc' },
];

export function CustomerSort({ field, direction, onChange }: CustomerSortProps) {
  const value = `${field}:${direction}`;

  return (
    <label className="flex items-center gap-2 rounded-2xl border border-shell-border bg-white px-3.5 py-2.5 text-sm text-shell-muted">
      <span>Sort by:</span>
      <select
        value={value}
        onChange={(event) => {
          const [nextField, nextDirection] = event.target.value.split(':') as [CustomerSortField, 'asc' | 'desc'];
          onChange({ field: nextField, direction: nextDirection });
        }}
        className="bg-transparent font-medium text-shell-text outline-none"
      >
        {options.map((option) => (
          <option key={option.label} value={`${option.field}:${option.direction}`}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
