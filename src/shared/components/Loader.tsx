import { Loader2 } from "lucide-react";

export function Loader() {
    return (
        <div className="w-[160px] flex items-center gap-2 rounded-full border border-shell-border bg-white/95 px-3 py-1.5 text-xs font-medium text-shell-muted shadow-card backdrop-blur-sm">
            <Loader2 className="h-4 w-4 animate-spin text-shell-accent" />
            Loading data...
        </div>
    )
}
