import { Delete, Merge, Scissors, PencilLine } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePageSelection } from '../hooks/usePageSelection';
import { useDocumentOperations } from '../hooks/useDocumentOperations';
import { useWorkspaceStore } from '../store/workspaceStore';
import type { Document } from '../types/claim.types';

type SelectionToolbarProps = {
  claimId: string;
  activeDocument: Document | undefined;
  activePageNumber: number;
};

export function SelectionToolbar({ claimId, activeDocument, activePageNumber }: SelectionToolbarProps) {
  const { selectedCount, selectedPages, clearSelection, removePages } = usePageSelection();
  const setWorkspaceMode = useWorkspaceStore((state) => state.setWorkspaceMode);
  const setActivePage = useWorkspaceStore((state) => state.setActivePage);
  const setActiveDocumentId = useWorkspaceStore((state) => state.setActiveDocumentId);
  const { split, isSplitting, merge, isMerging, deletePages, isDeleting } = useDocumentOperations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const canSplit = useMemo(() => {
    if (!activeDocument || selectedCount === 0) {
      return false;
    }

    return selectedPages.every((page) => page.documentId === activeDocument.id);
  }, [activeDocument, selectedCount, selectedPages]);

  const canMerge = useMemo(() => {
    if (selectedCount < 2) {
      return false;
    }

    return true;
  }, [selectedCount, selectedPages]);

  const canDelete = useMemo(() => selectedCount > 0 && !isDeleting, [isDeleting, selectedCount]);

  const activePageId = useMemo(() => {
    return activeDocument?.pages.find((page) => page.pageNumber === activePageNumber)?.id ?? null;
  }, [activeDocument, activePageNumber]);

  if (selectedCount === 0) {
    return null;
  }

  const actions = [
    { label: 'Edit', icon: PencilLine, disabled: false },
    { label: 'Merge', icon: Merge, disabled: !canMerge || isMerging },
    { label: 'Split', icon: Scissors, disabled: !canSplit || isSplitting },
    { label: 'Delete', icon: Delete, disabled: !canDelete },
  ];

  const handleSplit = async () => {
    if (!activeDocument || !canSplit) {
      return;
    }

    await split({
      claimId,
      documentId: activeDocument.id,
      pageIds: selectedPages.map((page) => page.pageId),
    });

    clearSelection();
    setWorkspaceMode('view');
    setActivePage(1);
  };

  const handleMerge = async () => {
    if (!canMerge) {
      return;
    }

    const result = await merge({
      claimId,
      pages: selectedPages.map((page) => ({
        pageId: page.pageId,
        documentId: page.documentId,
      })),
    });

    clearSelection();
    setWorkspaceMode('view');

    if (result.mergedDocumentId) {
      setActiveDocumentId(result.mergedDocumentId);
      setActivePage(1);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) {
      return;
    }

    const selectedPageIdSet = new Set(selectedPages.map((page) => page.pageId));
    const activePageWillBeDeleted = activePageId ? selectedPageIdSet.has(activePageId) : false;
    const remainingPages = activeDocument?.pages.filter((page) => !selectedPageIdSet.has(page.id)) ?? [];
    const fallbackPageNumber = remainingPages.find((page) => page.pageNumber > activePageNumber)?.pageNumber ?? remainingPages.at(-1)?.pageNumber ?? 1;

    const result = await deletePages({
      claimId,
      pages: selectedPages.map((page) => ({
        pageId: page.pageId,
        documentId: page.documentId,
      })),
    });

    removePages(result.deletedPageIds);
    setWorkspaceMode('view');

    if (result.nextActiveDocumentId) {
      setActiveDocumentId(result.nextActiveDocumentId);
      if (activePageWillBeDeleted) {
        setActivePage(result.nextActivePage ?? fallbackPageNumber);
      }
      return;
    }

    setActiveDocumentId(null);
    if (activePageWillBeDeleted) {
      setActivePage(1);
    }
  };

  return (
    <div className="sticky top-4 z-10 rounded-[24px] border border-shell-border bg-white/95 p-3 shadow-card backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold tracking-tight text-shell-text">{selectedCount} pages selected</div>
          <div className="text-xs text-shell-muted">Selection is ready for future page operations.</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions.map(({ label, icon: Icon, disabled }) => (
            <button
              key={label}
              type="button"
              disabled={disabled || (isDeleting && label !== 'Delete')}
              onClick={() => {
                if (label === 'Edit') {
                  setWorkspaceMode('edit');
                  return;
                }

                if (label === 'Merge') {
                  void handleMerge();
                  return;
                }

                if (label === 'Split') {
                  void handleSplit();
                  return;
                }

                if (label === 'Delete') {
                  setIsDeleteDialogOpen(true);
                }
              }}
              title={label === 'Split' ? 'Split selected pages' : label === 'Merge' ? 'Merge selected pages' : label === 'Delete' ? 'Delete selected pages' : 'Coming soon'}
              className="inline-flex items-center gap-2 rounded-xl border border-shell-border bg-shell-panelSoft px-3 py-2 text-sm font-medium text-shell-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon className="h-4 w-4" />
              {label === 'Split' && isSplitting ? 'Splitting...' : label === 'Merge' && isMerging ? 'Merging...' : label}
            </button>
          ))}
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-xl border border-shell-border bg-white px-3 py-2 text-sm font-medium text-shell-text"
          >
            Clear
          </button>
        </div>
      </div>
      {isDeleteDialogOpen ? (
        <div className="mt-3 rounded-2xl border border-shell-border bg-white p-4 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Delete {selectedCount} pages?</h3>
              <p className="mt-1 text-sm text-shell-muted">This action permanently removes the selected pages and their comments.</p>
            </div>
            <button type="button" onClick={() => setIsDeleteDialogOpen(false)} className="text-sm font-medium text-shell-muted">
              Cancel
            </button>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button type="button" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl border border-shell-border bg-white px-4 py-2 text-sm font-medium">
              Keep
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => {
                setIsDeleteDialogOpen(false);
                void handleDelete();
              }}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
