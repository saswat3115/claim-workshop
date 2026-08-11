import type { Claim } from '../types/claim.types';
import type { DeletePagesInput, DeletePagesResult, EditDocumentInput, EditResult, MergeDocumentsInput, MergeDocumentsResult, SplitDocumentInput, SplitDocumentResult } from '../types/operation.types';

export interface ClaimRepository {
  getClaim(claimId: string): Promise<Claim>;
  editDocument(input: EditDocumentInput): Promise<EditResult>;
  splitDocument(input: SplitDocumentInput): Promise<SplitDocumentResult>;
  mergeDocuments(input: MergeDocumentsInput): Promise<MergeDocumentsResult>;
  deletePages(input: DeletePagesInput): Promise<DeletePagesResult>;
}
