export function SkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="h-14 w-56 animate-pulse rounded-2xl bg-shell-panelSoft" />
      <div className="grid min-h-[720px] grid-cols-[290px_1fr] gap-4 rounded-[28px] bg-shell-panelSoft p-4">
        <div className="animate-pulse rounded-[24px] bg-white" />
        <div className="animate-pulse rounded-[24px] bg-white" />
      </div>
    </div>
  );
};

