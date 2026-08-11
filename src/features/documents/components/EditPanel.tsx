import { useEffect, useState } from 'react';

type EditPanelProps = {
  documentName: string;
  isSaving: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onSave: (name: string) => Promise<void>;
};

export function EditPanel({ documentName, isSaving, errorMessage, onCancel, onSave }: EditPanelProps) {
  const [draftName, setDraftName] = useState(documentName);

  useEffect(() => {
    setDraftName(documentName);
  }, [documentName]);

  return (
    <div className="rounded-[24px] border border-shell-border bg-shell-panelSoft p-4">
      <div className="flex items-center justify-between gap-3 border-b border-shell-border pb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-shell-muted">Edit document</h3>
          <p className="mt-1 text-xs text-shell-muted">Rename the active document.</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-shell-muted">View to Edit</span>
      </div>

      <div className="mt-4 space-y-3 rounded-2xl border border-shell-border bg-white p-3">
        <label className="block text-xs font-medium uppercase tracking-[0.16em] text-shell-muted">Document name</label>
        <input
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          className="w-full rounded-xl border border-shell-border bg-shell-panelSoft px-3 py-2 text-sm outline-none focus:border-shell-accent"
        />
        {errorMessage ? <div className="text-xs text-rose-700">{errorMessage}</div> : null}
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl border border-shell-border bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(draftName)}
          disabled={isSaving || !draftName.trim()}
          className="rounded-xl bg-shell-accent px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
