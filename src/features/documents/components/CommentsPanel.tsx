import { useCallback, useEffect, useState } from 'react';
import { SendHorizontal, MessageSquareText } from 'lucide-react';
import { useComment } from '../hooks/useComment';
import { useWorkspaceStore } from '../store/workspaceStore';
import type { Comment } from '../types/comment.types';
import { CommentBox } from './CommentBox';

type CommentsPanelProps = {
  claimId: string;
  pageId: string | undefined;
  comments: Comment[];
};

export function CommentsPanel({ claimId, pageId, comments }: CommentsPanelProps) {
  const [draft, setDraft] = useState('');
  const { isPosting, submitComment } = useComment({ claimId, pageId, commentsCount: comments.length });
  const activePage = useWorkspaceStore((state) => state.activePage);

  useEffect(() => {
    setDraft('');
  }, [pageId]);

  const handleSubmit = useCallback(() => {
    submitComment(pageId, draft);
    setDraft('');
  }, [submitComment, draft, pageId]);

  const visibleComments = comments;
  const currentPageCommentCount = comments.length;

  return (
    <aside className="flex h-fit self-start flex-col rounded-[24px] border border-shell-border bg-white p-4 shadow-card">
      <div className="flex items-center justify-between border-b border-shell-border pb-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Comments</h3>
          <p className="mt-0.5 text-xs text-shell-muted">
            Page {activePage} · {currentPageCommentCount} comments
          </p>
        </div>
        <MessageSquareText className="h-5 w-5 text-shell-muted" />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {visibleComments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-shell-border bg-shell-panelSoft p-4 text-xs text-shell-muted italic">
            No comments on this page yet.
          </div>
        ) : (
          <div className="space-y-3">
            {visibleComments.map((comment) => (
              <CommentBox
                key={comment.id}
                comment={comment}
                onRetrySubmit={submitComment}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-shell-border pt-4">
        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-shell-muted">Add comment</label>
        <textarea
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          placeholder="Write a comment..."
          className="min-h-[88px] w-full resize-none rounded-2xl border border-shell-border bg-shell-panelSoft px-4 py-3 text-sm outline-none placeholder:text-shell-muted focus:border-shell-accent"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-shell-muted">Press send to post a page-level comment.</p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPosting || !draft.trim() || !pageId}
            className="inline-flex items-center gap-2 rounded-xl bg-shell-accent px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
