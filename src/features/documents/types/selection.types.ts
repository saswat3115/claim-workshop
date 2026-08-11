export type SelectedPage = {
  pageId: string;
  documentId: string;
};

export type PageSelectionAction = 'edit' | 'merge' | 'split' | 'delete';
