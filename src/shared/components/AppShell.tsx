import { type PropsWithChildren } from 'react';
import {
  CircleGauge,
  HelpCircle,
  LayoutDashboard,
  ShoppingBag,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { Sidebar } from './Sidebar';

const navItems = [
  { label: 'Dashboard', to: '/claims', icon: LayoutDashboard },
  { label: 'Product', to: '/claims', icon: ShoppingBag },
  { label: 'Customers', to: '/claims/123/documents/abc', icon: Users },
  { label: 'Income', to: '/claims', icon: CircleGauge },
  { label: 'Promote', to: '/claims', icon: SlidersHorizontal },
  { label: 'Help', to: '/claims', icon: HelpCircle },
];

export function AppShell({ children }: PropsWithChildren) {

  return (
    <div className="min-h-screen bg-shell-bg text-shell-text">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-6 py-6">
        <Sidebar navItems={navItems} />
        <main className="flex min-w-0 flex-1 flex-col rounded-[28px] bg-shell-panel p-8 shadow-card">
          {children}
        </main>
      </div>
    </div>
  );
}
