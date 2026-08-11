import { Loader2 } from 'lucide-react';
import { formatTime } from '../../../shared/utils/time';
import type { Comment } from '../types/comment.types';

export function CommentBox({ 
    comment,
    onRetrySubmit,
}: { 
    comment: Comment, 
    onRetrySubmit: (pageId: string, content: string, id: string) => void 
}) {
  return (
    <article
      key={comment.id}
      className="rounded-2xl border border-shell-border bg-shell-panelSoft p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-shell-text">
            {comment.authorName}
          </div>
          <div className="text-[10px] text-shell-muted">
            {formatTime(comment.createdAt)}
          </div>
        </div>
        {'status' in comment && comment.status === 'sending' ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] text-shell-muted">
            <Loader2 className="h-3 w-3 animate-spin" />
            Sending...
          </span>
        ) : null}
        {'status' in comment && comment.status === 'failed' ? (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700">
            Failed to send
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-shell-text">
        {comment.content}
      </p>
      {'status' in comment && comment.status === 'failed' ? (
        <button
          type="button"
          onClick={() => {
            onRetrySubmit(comment.pageId, comment.content, comment.id);
          }}
          className="mt-3 rounded-xl border border-shell-border bg-white px-3 py-1.5 text-xs font-medium"
        >
          Retry
        </button>
      ) : null}
    </article>
  );
}
