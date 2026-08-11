export type DocumentOperation = 'edit' | 'merge' | 'split' | 'delete';

export type EditDocumentInput = {
  claimId: string;
  documentId: string;
  name: string;
};

export type EditResult = {
  updatedDocumentId: string;
  updatedDocumentName: string;
};

export type SplitDocumentInput = {
  claimId: string;
  documentId: string;
  pageIds: string[];
};

export type SplitDocumentResult = {
  claimId: string;
  sourceDocumentId: string;
  newDocumentId: string;
  movedPageIds: string[];
};

export type MergeDocumentsInput = {
  claimId: string;
  pages: Array<{
    pageId: string;
    documentId: string;
  }>;
};

export type MergeDocumentsResult = {
  claimId: string;
  mergedDocumentId: string;
  sourceDocumentIds: string[];
  mergedPageIds: string[];
};

export type DeletePagesInput = {
  claimId: string;
  pages: Array<{
    pageId: string;
    documentId: string;
  }>;
};

export type DeletePagesResult = {
  claimId: string;
  deletedDocumentIds: string[];
  deletedPageIds: string[];
  nextActiveDocumentId: string | null;
  nextActivePage: number;
};
