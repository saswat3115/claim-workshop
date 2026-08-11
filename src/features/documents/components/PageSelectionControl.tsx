import { Check } from 'lucide-react';

type PageSelectionControlProps = {
  isSelected: boolean;
  onToggle: () => void;
};

export function PageSelectionControl({ isSelected, onToggle }: PageSelectionControlProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={[
        'inline-flex h-7 w-7 items-center justify-center rounded-lg border transition',
        isSelected ? 'border-shell-accent bg-shell-accent text-white' : 'border-shell-border bg-white text-shell-muted hover:border-shell-accent/40',
      ].join(' ')}
      aria-label={isSelected ? 'Deselect page' : 'Select page'}
    >
      {isSelected ? <Check className="h-4 w-4" /> : null}
    </button>
  );
}
