import { customerMockData } from '../../claims/customers/mocks/customer.mock';
import type { Comment } from '../types/comment.types';
import type { Claim } from '../types/claim.types';
import type { DeletePagesResult, MergeDocumentsResult, SplitDocumentResult } from '../types/operation.types';

// in-memory store (BE indpendent, Can replace with repository + Tanstack Query once BE is available)
const claimStore = new Map<string, Claim>();

function cloneClaim(claim: Claim): Claim {
  return structuredClone(claim);
}

function createComment(pageId: string, commentIndex: number, authorName: string, content: string): Comment {
  const timestamp = new Date(Date.now() - commentIndex * 6 * 60_000).toISOString();

  return {
    id: `${pageId}-comment-${commentIndex + 1}`,
    pageId,
    content,
    authorId: `mock-user-${commentIndex + 1}`,
    authorName,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function createPageComments(pageId: string, pageNumber: number) {
  const commentCount = (pageNumber % 3) + 1;
  const authors = ['John Doe', 'Sarah Smith', 'Emily Chen'];

  return Array.from({ length: commentCount }, (_, index) =>
    createComment(
      pageId,
      index,
      authors[index % authors.length] ?? 'Mock Reviewer',
      `Mock comment ${index + 1} for page ${pageNumber}.`
    )
  );
}

function refreshClaimComments(claim: Claim): Claim {
  return {
    ...claim,
    documents: claim.documents.map((document) => ({
      ...document,
      pages: document.pages.map((page) => ({
        ...page,
        comments: page.comments,
      })),
    })),
  };
}

function delayed<T>(value: T, delayMs = 900) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), delayMs);
  });
}

function createPages(documentId: string, pageCount: number) {
  return Array.from({ length: pageCount }, (_, index) => ({
    id: `${documentId}-page-${index + 1}`,
    documentId,
    pageNumber: index + 1,
    thumbnailUrl: `https://placehold.co/120x160?text=${index + 1}`,
    contentUrl: `https://content.example.com/${documentId}/pages/${index + 1}`,
    comments: createPageComments(`${documentId}-page-${index + 1}`, index + 1),
    annotationsCount: (index + 1) % 4,
  }));
}

function createClaim(claimId: string, customerName: string): Claim {
  return {
    id: claimId,
    customerId: claimId,
    customerName,
    documents: [
      {
        id: `${claimId}-doc-1`,
        claimId,
        name: 'Emergency Treatment Invoice',
        type: 'Invoice',
        size: 14_204_928,
        pageCount: 10,
        status: 'ready' as const,
        createdAt: '2026-07-18T08:30:00.000Z',
        updatedAt: '2026-07-21T14:10:00.000Z',
        contentUrl: `https://content.example.com/${claimId}/documents/1`,
        pages: createPages(`${claimId}-doc-1`, 10),
      },
      {
        id: `${claimId}-doc-2`,
        claimId,
        name: 'Medical Report Packet',
        type: 'Report',
        size: 22_018_560,
        pageCount: 6,
        status: 'processing' as const,
        createdAt: '2026-07-19T09:00:00.000Z',
        updatedAt: '2026-07-22T11:15:00.000Z',
        contentUrl: `https://content.example.com/${claimId}/documents/2`,
        pages: createPages(`${claimId}-doc-2`, 6),
      },
      {
        id: `${claimId}-doc-3`,
        claimId,
        name: 'Supporting Photos Archive',
        type: 'Attachment',
        size: 31_459_328,
        pageCount: 20,
        status: 'ready' as const,
        createdAt: '2026-07-20T10:20:00.000Z',
        updatedAt: '2026-07-23T16:45:00.000Z',
        contentUrl: `https://content.example.com/${claimId}/documents/3`,
        pages: createPages(`${claimId}-doc-3`, 20),
      },
    ],
  };
}

export function getOrCreateClaim(claimId: string) {
  const customer = customerMockData.find((record) => record.id === claimId);

  if (!customer) {
    throw new Error('Claim not found');
  }

  const existing = claimStore.get(claimId);

  if (existing) {
    return existing;
  }

  const created = createClaim(claimId, customer.customerName);
  claimStore.set(claimId, created);
  return created;
}

export function updateClaimDocumentName(claimId: string, documentId: string, name: string) {
  const claim = getOrCreateClaim(claimId);
  const nextClaim: Claim = {
    ...claim,
    documents: claim.documents.map((document) =>
      document.id === documentId
        ? {
            ...document,
            name,
            updatedAt: new Date().toISOString(),
          }
        : document
    ),
  };

  claimStore.set(claimId, nextClaim);
  return nextClaim.documents.find((document) => document.id === documentId) ?? null;
}

function createSplitDocumentId(claimId: string, sourceDocumentId: string) {
  return `${claimId}-${sourceDocumentId}-split-${crypto.randomUUID().slice(0, 8)}`;
}

function createMergeDocumentId(claimId: string) {
  return `${claimId}-merged-${crypto.randomUUID().slice(0, 8)}`;
}

function resolveNextActiveContext(claim: Claim) {
  const nextDocument = claim.documents[0] ?? null;

  return {
    nextActiveDocumentId: nextDocument?.id ?? null,
    nextActivePage: nextDocument?.pages[0]?.pageNumber ?? 1,
  };
}

export function splitClaimDocument(claimId: string, documentId: string, pageIds: string[]): SplitDocumentResult {
  const claim = getOrCreateClaim(claimId);
  const sourceDocument = claim.documents.find((document) => document.id === documentId);

  if (!sourceDocument) {
    throw new Error('Document not found');
  }

  const selectedPageIdSet = new Set(pageIds);
  const movedPages = sourceDocument.pages.filter((page) => selectedPageIdSet.has(page.id));

  if (movedPages.length === 0) {
    throw new Error('No pages selected');
  }

  const remainingPages = sourceDocument.pages.filter((page) => !selectedPageIdSet.has(page.id));
  const newDocumentId = createSplitDocumentId(claimId, documentId);

  const updatedOriginalDocument = {
    ...sourceDocument,
    pageCount: remainingPages.length,
    pages: remainingPages.map((page, index) => ({
      ...page,
      documentId: sourceDocument.id,
      pageNumber: index + 1,
    })),
    updatedAt: new Date().toISOString(),
  };

  const splitDocument = {
    id: newDocumentId,
    claimId,
    name: `${sourceDocument.name} - Split`,
    type: sourceDocument.type,
    size: Math.max(1, Math.round(sourceDocument.size * (movedPages.length / sourceDocument.pages.length))),
    pageCount: movedPages.length,
    status: 'processing' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contentUrl: sourceDocument.contentUrl,
    pages: movedPages.map((page, index) => ({
      ...page,
      documentId: newDocumentId,
      pageNumber: index + 1,
    })),
  };

  const nextClaim: Claim = {
    ...claim,
    documents: [
      ...claim.documents.map((document) => (document.id === documentId ? updatedOriginalDocument : document)),
      splitDocument,
    ],
  };

  claimStore.set(claimId, nextClaim);

  return {
    claimId,
    sourceDocumentId: documentId,
    newDocumentId,
    movedPageIds: movedPages.map((page) => page.id),
  };
}

export function mergeClaimDocuments(
  claimId: string,
  pages: Array<{ pageId: string; documentId: string }>
): MergeDocumentsResult {
  const claim = getOrCreateClaim(claimId);

  if (pages.length < 2) {
    throw new Error('At least two pages are required to merge');
  }

  const selectedPageIds = new Set(pages.map((page) => page.pageId));
  const sourceDocumentIds = Array.from(new Set(pages.map((page) => page.documentId)));
  const sourceDocuments = sourceDocumentIds
    .map((documentId) => claim.documents.find((document) => document.id === documentId))
    .filter((document): document is NonNullable<typeof document> => Boolean(document));

  if (sourceDocuments.length !== sourceDocumentIds.length) {
    throw new Error('Document not found');
  }

  const orderedPages = claim.documents.flatMap((document) => document.pages).filter((page) => selectedPageIds.has(page.id));

  if (orderedPages.length !== pages.length) {
    throw new Error('Page not found');
  }

  const mergedDocumentId = createMergeDocumentId(claimId);
  const mergedPages = orderedPages.map((page, index) => ({
    ...page,
    documentId: mergedDocumentId,
    pageNumber: index + 1,
  }));

  const updatedDocuments = claim.documents
    .map((document) => {
      const documentSelectedPages = document.pages.filter((page) => selectedPageIds.has(page.id));

      if (documentSelectedPages.length === 0) {
        return document;
      }

      const remainingPages = document.pages.filter((page) => !selectedPageIds.has(page.id));

      if (remainingPages.length === 0) {
        return null;
      }

      return {
        ...document,
        pageCount: remainingPages.length,
        pages: remainingPages.map((page, index) => ({
          ...page,
          documentId: document.id,
          pageNumber: index + 1,
        })),
        updatedAt: new Date().toISOString(),
      };
    })
    .filter((document): document is NonNullable<typeof document> => Boolean(document));

  const mergedDocument = {
    id: mergedDocumentId,
    claimId,
    name: `Merged Document`,
    type: sourceDocuments[0]?.type ?? 'Document',
    size: sourceDocuments.reduce((total, document) => total + document.size, 0),
    pageCount: mergedPages.length,
    status: 'processing' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contentUrl: sourceDocuments[0]?.contentUrl,
    pages: mergedPages,
  };

  const nextClaim: Claim = {
    ...claim,
    documents: [...updatedDocuments, mergedDocument],
  };

  claimStore.set(claimId, nextClaim);

  return {
    claimId,
    mergedDocumentId,
    sourceDocumentIds,
    mergedPageIds: mergedPages.map((page) => page.id),
  };
}

export function deleteClaimPages(claimId: string, pages: Array<{ pageId: string; documentId: string }>): DeletePagesResult {
  const claim = getOrCreateClaim(claimId);

  if (pages.length === 0) {
    throw new Error('No pages selected');
  }

  const selectedPageIds = new Set(pages.map((page) => page.pageId));
  const deletedPageIds: string[] = [];
  const deletedDocumentIds: string[] = [];

  const nextDocuments = claim.documents
    .map((document) => {
      const remainingPages = document.pages.filter((page) => !selectedPageIds.has(page.id));

      if (remainingPages.length === document.pages.length) {
        return document;
      }

      deletedPageIds.push(...document.pages.filter((page) => selectedPageIds.has(page.id)).map((page) => page.id));

      if (remainingPages.length === 0) {
        deletedDocumentIds.push(document.id);
        return null;
      }

      return {
        ...document,
        pageCount: remainingPages.length,
        pages: remainingPages.map((page, index) => ({
          ...page,
          documentId: document.id,
          pageNumber: index + 1,
        })),
        updatedAt: new Date().toISOString(),
      };
    })
    .filter((document): document is NonNullable<typeof document> => Boolean(document));

  const nextClaim: Claim = {
    ...claim,
    documents: nextDocuments,
  };

  claimStore.set(claimId, nextClaim);

  const fallback = resolveNextActiveContext(nextClaim);

  return {
    claimId,
    deletedDocumentIds,
    deletedPageIds,
    nextActiveDocumentId: fallback.nextActiveDocumentId,
    nextActivePage: fallback.nextActivePage,
  };
}

export function getClaimSnapshot(claimId: string) {
  return delayed(cloneClaim(refreshClaimComments(getOrCreateClaim(claimId))));
}

export function getClaimFromStore(claimId: string) {
  return cloneClaim(refreshClaimComments(getOrCreateClaim(claimId)));
}

export function getPageComments(claimId: string, pageId: string) {
  const claim = getOrCreateClaim(claimId);

  for (const document of claim.documents) {
    for (const page of document.pages) {
      if (page.id === pageId) {
        return [...page.comments];
      }
    }
  }

  return [];
}

export function addCommentToPage(claimId: string, pageId: string, comment: Comment) {
  const claim = getOrCreateClaim(claimId);

  const nextClaim: Claim = {
    ...claim,
    documents: claim.documents.map((document) => ({
      ...document,
      pages: document.pages.map((page) =>
        page.id === pageId ? { ...page, comments: [...page.comments, comment] } : page
      ),
    })),
  };

  claimStore.set(claimId, nextClaim);
}

export function updateCommentInPage(claimId: string, commentId: string, updater: (comment: Comment) => Comment) {
  const claim = getOrCreateClaim(claimId);

  let updatedComment: Comment | null = null;

  const nextClaim: Claim = {
    ...claim,
    documents: claim.documents.map((document) => ({
      ...document,
      pages: document.pages.map((page) => {
        const nextComments = page.comments.map((comment) => {
          if (comment.id !== commentId) {
            return comment;
          }

          const nextComment = updater(comment);
          updatedComment = nextComment;
          return nextComment;
        });

        return {
          ...page,
          comments: nextComments,
        };
      }),
    })),
  };

  if (updatedComment) {
    claimStore.set(claimId, nextClaim);
  }

  return updatedComment;
}

export function deleteCommentFromPage(claimId: string, commentId: string) {
  const claim = getOrCreateClaim(claimId);

  let removed = false;

  const nextClaim: Claim = {
    ...claim,
    documents: claim.documents.map((document) => ({
      ...document,
      pages: document.pages.map((page) => {
        const nextComments = page.comments.filter((comment) => comment.id !== commentId);

        if (nextComments.length !== page.comments.length) {
          removed = true;
        }

        return {
          ...page,
          comments: nextComments,
        };
      }),
    })),
  };

  if (removed) {
    claimStore.set(claimId, nextClaim);
  }

  return removed;
}

export function getClaimIdForPage(pageId: string) {
  for (const [claimId, claim] of claimStore.entries()) {
    for (const document of claim.documents) {
      if (document.pages.some((page) => page.id === pageId)) {
        return claimId;
      }
    }
  }

  return null;
}

export function getClaimIdForComment(commentId: string) {
  for (const [claimId, claim] of claimStore.entries()) {
    for (const document of claim.documents) {
      for (const page of document.pages) {
        if (page.comments.some((comment) => comment.id === commentId)) {
          return claimId;
        }
      }
    }
  }

  return null;
}
