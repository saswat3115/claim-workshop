import { usePageSelectionStore } from '../store/pageSelection.store';

export function usePageSelection() {
  const selectedPageIds = usePageSelectionStore((state) => state.selectedPageIds);
  const selectedPageDocumentIds = usePageSelectionStore((state) => state.selectedPageDocumentIds);
  const selectPage = usePageSelectionStore((state) => state.selectPage);
  const deselectPage = usePageSelectionStore((state) => state.deselectPage);
  const togglePage = usePageSelectionStore((state) => state.togglePage);
  const clearSelection = usePageSelectionStore((state) => state.clearSelection);
  const removePages = usePageSelectionStore((state) => state.removePages);
  const selectAll = usePageSelectionStore((state) => state.selectAll);

  const selectedPages = Array.from(selectedPageIds)
    .map((pageId) => ({
      pageId,
      documentId: selectedPageDocumentIds[pageId],
    }))
    .filter((page): page is { pageId: string; documentId: string } => Boolean(page.documentId));

  return {
    selectedPageIds,
    selectedPages,
    selectedCount: selectedPageIds.size,
    selectPage,
    deselectPage,
    togglePage,
    clearSelection,
    removePages,
    selectAll,
  };
}
