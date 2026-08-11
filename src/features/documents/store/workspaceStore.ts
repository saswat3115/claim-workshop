import { create } from 'zustand';

type WorkspaceState = {
  activeDocumentId: string | null;
  activePage: number;
  workspaceMode: 'view' | 'edit';
  setActiveDocumentId: (documentId: string | null) => void;
  setActivePage: (page: number) => void;
  setWorkspaceMode: (mode: 'view' | 'edit') => void;
  resetWorkspace: () => void;
};

const initialState = {
  activeDocumentId: null,
  activePage: 1,
  workspaceMode: 'view' as const,
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  ...initialState,
  setActiveDocumentId: (activeDocumentId) => set({ activeDocumentId }),
  setActivePage: (activePage) => set({ activePage }),
  setWorkspaceMode: (workspaceMode) => set({ workspaceMode }),
  resetWorkspace: () => set(initialState),
}));
