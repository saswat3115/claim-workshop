import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MockClaimRepository } from '../repositories/MockClaimRepository';
import { getClaimFromStore } from '../repositories/claimStore';
import type {
  DeletePagesInput,
  DeletePagesResult,
  EditDocumentInput,
  EditResult,
  MergeDocumentsInput,
  MergeDocumentsResult,
  SplitDocumentInput,
  SplitDocumentResult,
} from '../types/operation.types';

const claimRepository = new MockClaimRepository();

export function useDocumentOperations() {
  const queryClient = useQueryClient();

  const editMutation = useMutation<EditResult, Error, EditDocumentInput>({
    mutationFn: (input) => claimRepository.editDocument(input),
    onSuccess: (_result, variables) => {
      const freshClaim = getClaimFromStore(variables.claimId);

      queryClient.setQueryData(['claims', variables.claimId], freshClaim);
    },
  });

  const splitMutation = useMutation<SplitDocumentResult, Error, SplitDocumentInput>({
    mutationFn: (input) => claimRepository.splitDocument(input),
    onSuccess: (_result, variables) => {
      const freshClaim = getClaimFromStore(variables.claimId);

      queryClient.setQueryData(['claims', variables.claimId], freshClaim);
    },
  });

  const mergeMutation = useMutation<MergeDocumentsResult, Error, MergeDocumentsInput>({
    mutationFn: (input) => claimRepository.mergeDocuments(input),
    onSuccess: (_result, variables) => {
      const freshClaim = getClaimFromStore(variables.claimId);

      queryClient.setQueryData(['claims', variables.claimId], freshClaim);
    },
  });

  const deleteMutation = useMutation<DeletePagesResult, Error, DeletePagesInput>({
    mutationFn: (input) => claimRepository.deletePages(input),
    onSuccess: (result, variables) => {
      const freshClaim = getClaimFromStore(variables.claimId);

      queryClient.setQueryData(['claims', variables.claimId], freshClaim);
      result.deletedPageIds.forEach((pageId) => {
        queryClient.removeQueries({ queryKey: ['comments', pageId] });
      });
    },
  });

  return {
    edit: editMutation.mutateAsync,
    isEditing: editMutation.isPending,
    editError: editMutation.error,
    split: splitMutation.mutateAsync,
    isSplitting: splitMutation.isPending,
    splitError: splitMutation.error,
    merge: mergeMutation.mutateAsync,
    isMerging: mergeMutation.isPending,
    mergeError: mergeMutation.error,
    deletePages: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}
