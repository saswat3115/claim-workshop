import type { Comment } from '../types/comment.types';

export interface CommentRepository {
  getComments(pageId: string): Promise<Comment[]>;
  createComment(pageId: string, content: string): Promise<Comment>;
  updateComment(commentId: string, content: string): Promise<Comment>;
  deleteComment(commentId: string): Promise<void>;
}
