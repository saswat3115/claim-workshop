import { Package, UserCircle2, ChevronLeft, ChevronRight, UserRound, type LucideProps } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

type PropsType = {
    navItems: Array<{
        label: string;
        to: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    }>;
}

export function Sidebar({ navItems }: PropsType) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <>
      <aside
        className={[
          'flex flex-col rounded-[28px] bg-shell-panel shadow-card transition-all duration-200',
          isSidebarCollapsed ? 'w-[88px] p-4' : 'w-[290px] p-6',
        ].join(' ')}
      >
        {isSidebarCollapsed ? (
          <>
            <div className="flex h-12 items-center justify-center rounded-2xl border border-shell-border text-xl font-semibold">
              <Package className="h-5 w-5 text-shell-text" />
            </div>
            <nav className="mt-12 flex flex-1 flex-col items-center gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex h-12 w-12 items-center justify-center rounded-2xl border text-sm transition',
                      !isActive
                        ? 'border-shell-accent bg-shell-accent text-white'
                        : 'border-shell-border bg-white text-shell-muted',
                    ].join(' ')
                  }
                >
                  <item.icon className="h-4 w-4" />
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-white">
                <UserCircle2 className="h-5 w-5" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-shell-border text-lg">
                  <Package className="h-5 w-5 text-shell-text" />
                </span>
                Dashboard
                <span className="text-xs font-medium text-shell-muted">
                  v.01
                </span>
              </div>
              <button
                type="button"
                aria-label="Collapse sidebar"
                onClick={() => setIsSidebarCollapsed(true)}
                className="mt-2 inline-flex h-6 min-w-6 items-center justify-center rounded-2xl border border-shell-border text-shell-muted transition hover:bg-shell-panelSoft hover:text-shell-text"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-12 space-y-3 text-sm text-shell-muted">
              {navItems.map((item) => {
                const active = item.label === 'Customers';
                return (
                  <div
                    key={item.label}
                    className={[
                      'flex items-center justify-between rounded-2xl px-4 py-3 transition',
                      active
                        ? 'bg-shell-accent text-white shadow-md'
                        : 'bg-transparent',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <ChevronRight
                      className={
                        active
                          ? 'h-4 w-4 text-white'
                          : 'h-4 w-4 text-shell-muted'
                      }
                    />
                  </div>
                );
              })}
            </nav>

            <div className="mt-auto flex items-center gap-3 rounded-2xl p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-rose-300 to-sky-400 text-white">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Saswat</div>
                <div className="text-sm text-shell-muted">Project Manager</div>
              </div>
            </div>
          </>
        )}
      </aside>

      {isSidebarCollapsed ? (
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={() => setIsSidebarCollapsed(false)}
          className="fixed left-[118px] top-[34px] inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-shell-border bg-shell-panel text-shell-muted shadow-card transition hover:bg-shell-panelSoft hover:text-shell-text"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </>
  );
}
