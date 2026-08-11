import { create } from 'zustand';

type PageSelectionState = {
  selectedPageIds: Set<string>;
  selectedPageDocumentIds: Record<string, string>;
  selectPage: (pageId: string, documentId: string) => void;
  deselectPage: (pageId: string) => void;
  togglePage: (pageId: string, documentId: string) => void;
  clearSelection: () => void;
  removePages: (pageIds: string[]) => void;
  selectAll: (pages: Array<{ pageId: string; documentId: string }>) => void;
};

const initialState = {
  selectedPageIds: new Set<string>(),
  selectedPageDocumentIds: {},
};

export const usePageSelectionStore = create<PageSelectionState>((set) => ({
  ...initialState,
  selectPage: (pageId, documentId) =>
    set((state) => {
      if (state.selectedPageIds.has(pageId)) {
        return state;
      }

      const nextSelectedPageIds = new Set(state.selectedPageIds);
      nextSelectedPageIds.add(pageId);

      return {
        selectedPageIds: nextSelectedPageIds,
        selectedPageDocumentIds: {
          ...state.selectedPageDocumentIds,
          [pageId]: documentId,
        },
      };
    }),
  deselectPage: (pageId) =>
    set((state) => {
      if (!state.selectedPageIds.has(pageId)) {
        return state;
      }

      const nextSelectedPageIds = new Set(state.selectedPageIds);
      nextSelectedPageIds.delete(pageId);

      const { [pageId]: _removed, ...selectedPageDocumentIds } = state.selectedPageDocumentIds;

      return {
        selectedPageIds: nextSelectedPageIds,
        selectedPageDocumentIds,
      };
    }),
  togglePage: (pageId, documentId) =>
    set((state) => {
      if (state.selectedPageIds.has(pageId)) {
        const nextSelectedPageIds = new Set(state.selectedPageIds);
        nextSelectedPageIds.delete(pageId);

        const { [pageId]: _removed, ...selectedPageDocumentIds } = state.selectedPageDocumentIds;

        return {
          selectedPageIds: nextSelectedPageIds,
          selectedPageDocumentIds,
        };
      }

      return {
        selectedPageIds: new Set(state.selectedPageIds).add(pageId),
        selectedPageDocumentIds: {
          ...state.selectedPageDocumentIds,
          [pageId]: documentId,
        },
      };
    }),
  clearSelection: () => set(initialState),
  removePages: (pageIds) =>
    set((state) => {
      const pageIdSet = new Set(pageIds);

      if (pageIdSet.size === 0) {
        return state;
      }

      const nextSelectedPageIds = new Set(Array.from(state.selectedPageIds).filter((pageId) => !pageIdSet.has(pageId)));
      const nextSelectedPageDocumentIds = Object.fromEntries(
        Object.entries(state.selectedPageDocumentIds).filter(([pageId]) => !pageIdSet.has(pageId))
      );

      return {
        selectedPageIds: nextSelectedPageIds,
        selectedPageDocumentIds: nextSelectedPageDocumentIds,
      };
    }),
  selectAll: (pages) =>
    set(() => {
      const selectedPageDocumentIds = pages.reduce<Record<string, string>>((accumulator, page) => {
        accumulator[page.pageId] = page.documentId;
        return accumulator;
      }, {});

      return {
        selectedPageIds: new Set(pages.map((page) => page.pageId)),
        selectedPageDocumentIds,
      };
    }),
}));
