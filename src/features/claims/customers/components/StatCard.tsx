import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function StatCard({
  title,
  value,
  note,
  trend,
  icon,
  extra,
}: {
  title: string;
  value: string;
  note: string;
  trend?: 'up' | 'down';
  icon: ReactNode;
  extra?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4 px-6 py-3.5">
      <div className="flex h-16 w-16 p-4 shrink-0 items-center justify-center rounded-full bg-shell-successSoft text-shell-success">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-[11px] font-medium tracking-tight text-shell-muted">{title}</div>
        <div className="mt-0.5 text-[28px] font-semibold leading-none tracking-tight text-shell-text">{value}</div>
        {note ? (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-shell-muted">
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="h-4 w-4 text-rose-500" />
            ) : null}
            <span className={trend ? 'font-semibold' : ''}>{note}</span>
          </div>
        ) : null}
        {extra ? <div className="mt-1">{extra}</div> : null}
      </div>
    </div>
  );
}
