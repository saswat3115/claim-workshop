import { CheckCircle2, MonitorSmartphone } from 'lucide-react';
import type { KeyboardEventHandler, MouseEventHandler } from 'react';
import type { Customer } from '../types/types';
import { Loader } from '../../../../shared/components/Loader';

type CustomerGridProps = {
  data: Customer[];
  isFetching: boolean;
  error: Error | null;
  onRetry: () => void;
  onSelectRow: (customerId: string) => void;
};

export function CustomerGrid({ data, isFetching, error, onRetry, onSelectRow }: CustomerGridProps) {
  if (error) {
    return (
      <div className="mt-4 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <div className="font-medium">Error loading customers</div>
        <p className="mt-1 text-rose-600">{error.message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-xl border border-rose-200 bg-white px-3 py-1.5 font-medium text-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative mt-4  rounded-[24px] bg-white">
      {isFetching ? (
        <div className="pointer-events-none absolute left-1/2 -top-4 z-20 -translate-x-1/2">
          <Loader />
        </div>
      ) : null}

      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[17%]" />
          <col className="w-[17%]" />
          <col className="w-[20%]" />
          <col className="w-[12%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-shell-border text-left text-sm text-shell-muted opacity-60">
            <th className="px-4 py-3.5 font-medium">Customer Name</th>
            <th className="px-4 py-3.5 font-medium">Company</th>
            <th className="px-4 py-3.5 font-medium">Phone Number</th>
            <th className="px-4 py-3.5 font-medium">Email</th>
            <th className="px-4 py-3.5 font-medium">Country</th>
            <th className="px-4 py-3.5 text-center font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const handleClick: MouseEventHandler<HTMLTableRowElement> = () => onSelectRow(row.id);
            const handleKeyDown: KeyboardEventHandler<HTMLTableRowElement> = (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelectRow(row.id);
              }
            };

            return (
            <tr
              key={row.id}
              tabIndex={0}
              role="button"
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className="cursor-pointer border-b border-shell-border text-sm last:border-b-0 hover:bg-shell-panelSoft focus:bg-shell-panelSoft focus:outline-none"
            >
              <td className="px-4 py-3.5 text-left font-medium text-shell-text">{row.customerName}</td>
              <td className="px-4 py-3.5 text-left">{row.company}</td>
              <td className="px-4 py-3.5 text-left">{row.phoneNumber}</td>
              <td className="px-4 py-3.5 text-left">
                <div className="group relative min-w-0">
                  <span className="block truncate" title={row.email}>
                    {row.email}
                  </span>
                  <span className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden max-w-[28rem] whitespace-normal rounded-lg border border-shell-border bg-shell-panel px-3 py-2 text-xs text-shell-text shadow-card group-hover:block">
                    {row.email}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-left">{row.country}</td>
              <td className="px-4 py-3.5 text-center">
                <span
                  className={[
                    'inline-flex items-center justify-center gap-1 rounded-md border px-3 py-1 text-xs font-medium',
                    row.status === 'Active'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700',
                  ].join(' ')}
                >
                  {row.status === 'Active' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <MonitorSmartphone className="h-3.5 w-3.5" />
                  )}
                  {row.status}
                </span>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
