import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MockCommentRepository } from '../repositories/MockCommentRepository';
import type { Comment, OptimisticComment } from '../types/comment.types';

const commentRepository = new MockCommentRepository();

type UseCommentOptions = {
  claimId: string;
  pageId: string | undefined;
  commentsCount: number;
};

type CreateCommentVariables = {
  pageId: string;
  content: string;
  optimisticId: string;
};

type MutationContext = {
  previousComments: OptimisticComment[];
  previousCount: number;
};

export function useComment({ claimId, pageId, commentsCount }: UseCommentOptions) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', pageId],
    queryFn: () => commentRepository.getComments(pageId ?? ''),
    enabled: Boolean(pageId),
  });

  const createCommentMutation = useMutation<Comment, Error, CreateCommentVariables, MutationContext>({
    mutationFn: ({ pageId: nextPageId, content }) => commentRepository.createComment(nextPageId, content),
    onMutate: async ({ pageId: nextPageId, content, optimisticId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', nextPageId] });
      await queryClient.cancelQueries({ queryKey: ['claims', claimId] });

      const previousComments = queryClient.getQueryData<OptimisticComment[]>(['comments', nextPageId]) ?? [];
      const nextNow = new Date().toISOString();
      const optimisticComment: OptimisticComment = {
        id: optimisticId,
        pageId: nextPageId,
        content,
        authorId: 'current-user',
        authorName: 'You',
        createdAt: nextNow,
        updatedAt: nextNow,
        optimistic: true,
        status: 'sending',
      };

      queryClient.setQueryData<OptimisticComment[]>(['comments', nextPageId], (current = []) => {
        const next = [...current];
        const existingIndex = next.findIndex((comment) => comment.id === optimisticId);

        if (existingIndex >= 0) {
          next[existingIndex] = optimisticComment;
          return next;
        }

        return [...next, optimisticComment];
      });

      queryClient.setQueryData(['claims', claimId], (currentClaim: any) => {
        if (!currentClaim) {
          return currentClaim;
        }

        return {
          ...currentClaim,
          documents: currentClaim.documents.map((document: any) => ({
            ...document,
            pages: document.pages.map((page: any) =>
              page.id === nextPageId
                ? { ...page, comments: [...page.comments, optimisticComment] }
                : page
            ),
          })),
        };
      });

      return {
        previousComments,
        previousCount: commentsCount,
      };
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData<OptimisticComment[]>(['comments', variables.pageId], (current = []) =>
        current.map((comment) =>
          comment.id === variables.optimisticId
            ? {
                ...comment,
                status: 'failed',
                optimistic: true,
              }
            : comment
        )
      );

      queryClient.setQueryData(['claims', claimId], (currentClaim: any) => {
        if (!currentClaim) {
          return currentClaim;
        }

        return {
          ...currentClaim,
          documents: currentClaim.documents.map((document: any) => ({
            ...document,
            pages: document.pages.map((page: any) =>
              page.id === variables.pageId
                ? { ...page, comments: page.comments.filter((comment: any) => comment.id !== variables.optimisticId) }
                : page
            ),
          })),
        };
      });
    },
    onSuccess: (serverComment, variables) => {
      queryClient.setQueryData<OptimisticComment[]>(['comments', variables.pageId], (current = []) =>
        current.map((comment) =>
          comment.id === variables.optimisticId ? serverComment : comment
        )
      );

      queryClient.setQueryData(['claims', claimId], (currentClaim: any) => {
        if (!currentClaim) {
          return currentClaim;
        }

        return {
          ...currentClaim,
          documents: currentClaim.documents.map((document: any) => ({
            ...document,
            pages: document.pages.map((page: any) =>
              page.id === variables.pageId
                ? {
                    ...page,
                    comments: page.comments.map((comment: any) =>
                      comment.id === variables.optimisticId ? serverComment : comment
                    ),
                  }
                : page
            ),
          })),
        };
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.pageId] });
      queryClient.invalidateQueries({ queryKey: ['claims', claimId] });
    },
  });

  const submitComment = (pageIdToUse: string | undefined, contentToUse: string, optimisticId?: string) => {
    const content = contentToUse.trim();

    if (!pageIdToUse || !content) {
      return;
    }

    createCommentMutation.mutate({
      pageId: pageIdToUse,
      content,
      optimisticId: optimisticId ?? `optimistic-${crypto.randomUUID()}`,
    });
  };

  return {
    comments: commentsQuery.data ?? [],
    commentCount: commentsQuery.data?.length ?? commentsCount,
    isLoading: commentsQuery.isLoading,
    error: commentsQuery.error,
    isPosting: createCommentMutation.isPending,
    submitComment,
  };
}
