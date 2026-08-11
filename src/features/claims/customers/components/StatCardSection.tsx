import { MonitorCheck, UserRoundCheck, Users } from 'lucide-react';
import { StatCard } from './StatCard';

export function StatCardSection() {
  return (
    <section className="overflow-hidden rounded-[40px] bg-shell-panel shadow-card ring-1 ring-shell-border/60">
      <div className="grid md:grid-cols-3">
        <div className="border-b border-shell-border/70 md:border-b-0 md:border-r">
          <StatCard
            title="Total Customers"
            value="5,423"
            note="16% this month"
            trend="up"
            icon={<Users className="h-14 w-14" />}
          />
        </div>
        <div className="border-b border-shell-border/70 md:border-b-0 md:border-r">
          <StatCard
            title="Members"
            value="1,893"
            note="1% this month"
            trend="down"
            icon={<UserRoundCheck className="h-14 w-14" />}
          />
        </div>
        <StatCard
          title="Active Now"
          value="189"
          note=""
          icon={<MonitorCheck className="h-14 w-14" />}
          extra={
            <div className="flex -space-x-2">
              {[
                'bg-amber-400',
                'bg-slate-200',
                'bg-rose-300',
                'bg-sky-300',
                'bg-zinc-300',
              ].map((color, index, arr) => (
                <div
                  key={index}
                  className={`h-7 w-7 rounded-full border-2 border-white ${color} text-[10px] flex items-center justify-center`}
                >
                    {index === arr.length - 1 ? '+9' : ''}
                </div>
              ))}
            </div>
          }
        />
      </div>
    </section>
  );
}
