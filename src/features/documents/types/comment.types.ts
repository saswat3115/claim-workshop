export type Comment = {
  id: string;
  pageId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type OptimisticComment = Comment & {
  optimistic?: boolean;
  status?: 'sending' | 'failed';
};
