import type { Comment } from '../types/comment.types';
import type { CommentRepository } from './CommentRepository';
import {
  addCommentToPage,
  deleteCommentFromPage,
  getClaimIdForComment,
  getClaimIdForPage,
  getPageComments,
  updateCommentInPage,
} from './claimStore';

function delayed<T>(value: T, delayMs = 650) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), delayMs);
  });
}

function shouldFail(content: string) {
  return content.toLowerCase().includes('fail');
}

function createServerComment(pageId: string, content: string): Comment {
  const timestamp = new Date().toISOString();

  return {
    id: `comment-${crypto.randomUUID()}`,
    pageId,
    content,
    authorId: 'current-user',
    authorName: 'You',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export class MockCommentRepository implements CommentRepository {
  async getComments(pageId: string): Promise<Comment[]> {
    const claimId = getClaimIdForPage(pageId);

    return delayed(claimId ? getPageComments(claimId, pageId) : []);
  }

  async createComment(pageId: string, content: string): Promise<Comment> {
    if (shouldFail(content)) {
      return new Promise<Comment>((_resolve, reject) => {
        window.setTimeout(() => reject(new Error('Failed to post comment')), 500);
      });
    }

    const comment = createServerComment(pageId, content);
    const claimId = getClaimIdForPage(pageId);

    if (!claimId) {
      throw new Error('Claim not found');
    }

    addCommentToPage(claimId, pageId, comment);

    return delayed(comment);
  }

  async updateComment(commentId: string, content: string): Promise<Comment> {
    const claimId = getClaimIdForComment(commentId);

    if (!claimId) {
      throw new Error('Comment not found');
    }

    const updated = updateCommentInPage(claimId, commentId, (existing) => ({
      id: existing.id,
      pageId: existing.pageId,
      content,
      authorId: existing.authorId,
      authorName: existing.authorName,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    }));

    if (updated) {
      return delayed(updated);
    }

    throw new Error('Comment not found');
  }

  async deleteComment(commentId: string): Promise<void> {
    const claimId = getClaimIdForComment(commentId);

    if (claimId && deleteCommentFromPage(claimId, commentId)) {
      return delayed(undefined);
    }

    throw new Error('Comment not found');
  }
}
