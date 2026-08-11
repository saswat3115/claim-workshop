import type { Comment } from '../types/comment.types';

function nowOffset(minutesAgo: number) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function createComment(pageId: string, index: number, authorName: string, content: string): Comment {
  const timestamp = nowOffset(index * 6 + 2);

  return {
    id: `${pageId}-comment-${index + 1}`,
    pageId,
    content,
    authorId: `user-${index + 1}`,
    authorName,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const commentMockSeed: Comment[] = [
  createComment('cust_000001-doc-1-page-1', 0, 'John Doe', 'Please verify the invoice amount.'),
  createComment('cust_000001-doc-1-page-1', 1, 'Sarah Smith', 'This document needs review.'),
  createComment('cust_000002-doc-2-page-2', 0, 'Emily Chen', 'Confirm this line item against the policy.'),
];
