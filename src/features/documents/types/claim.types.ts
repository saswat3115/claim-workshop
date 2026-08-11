import type { Comment } from './comment.types';

export type DocumentStatus = 'ready' | 'processing' | 'error';

export type DocumentPage = {
  id: string;
  documentId: string;
  pageNumber: number;
  thumbnailUrl?: string;
  contentUrl?: string;
  comments: Comment[];
  annotationsCount: number;
};

export type Document = {
  id: string;
  claimId: string;
  name: string;
  type: string;
  size: number;
  pageCount: number;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  contentUrl?: string;
  pages: DocumentPage[];
};

export type Claim = {
  id: string;
  customerId: string;
  customerName: string;
  documents: Document[];
};
