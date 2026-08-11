import type { Claim } from '../types/claim.types';
import type { DeletePagesInput, DeletePagesResult, EditDocumentInput, EditResult, MergeDocumentsInput, MergeDocumentsResult, SplitDocumentInput, SplitDocumentResult } from '../types/operation.types';
import type { ClaimRepository } from './ClaimRepository';
import { deleteClaimPages, getClaimSnapshot, mergeClaimDocuments, splitClaimDocument, updateClaimDocumentName } from './claimStore';

export class MockClaimRepository implements ClaimRepository {
  async getClaim(claimId: string): Promise<Claim> {
    return getClaimSnapshot(claimId);
  }

  async editDocument(input: EditDocumentInput): Promise<EditResult> {
    const updatedDocument = updateClaimDocumentName(input.claimId, input.documentId, input.name);

    if (!updatedDocument) {
      throw new Error('Document not found');
    }

    return new Promise<EditResult>((resolve) => {
      window.setTimeout(() => {
        resolve({
          updatedDocumentId: updatedDocument.id,
          updatedDocumentName: updatedDocument.name,
        });
      }, 700);
    });
  }

  async splitDocument(input: SplitDocumentInput): Promise<SplitDocumentResult> {
    const result = splitClaimDocument(input.claimId, input.documentId, input.pageIds);

    return new Promise<SplitDocumentResult>((resolve) => {
      window.setTimeout(() => resolve(result), 850);
    });
  }

  async mergeDocuments(input: MergeDocumentsInput): Promise<MergeDocumentsResult> {
    const result = mergeClaimDocuments(input.claimId, input.pages);

    return new Promise<MergeDocumentsResult>((resolve) => {
      window.setTimeout(() => resolve(result), 900);
    });
  }

  async deletePages(input: DeletePagesInput): Promise<DeletePagesResult> {
    if (input.pages.length === 0) {
      throw new Error('No pages selected');
    }

    const result = deleteClaimPages(input.claimId, input.pages);

    return new Promise<DeletePagesResult>((resolve) => {
      window.setTimeout(() => resolve(result), 800);
    });
  }
}
