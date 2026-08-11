import { useEffect, useMemo, useCallback, useState } from 'react';
import { ArrowLeft, ChevronDown, FileText, FileX2, Loader2 } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useClaim } from '../hooks/useClaim';
import { CommentsPanel } from './CommentsPanel';
import { EditPanel } from './EditPanel';
import { PageSelectionControl } from './PageSelectionControl';
import { SelectionToolbar } from './SelectionToolbar';
import { useDocumentOperations } from '../hooks/useDocumentOperations';
import { usePageSelectionStore } from '../store/pageSelection.store';
import { useWorkspaceStore } from '../store/workspaceStore';
import { formatBytes } from '../../../shared/utils/files';
import { SkeletonLoader } from './SkeletonLoader';


export function ClaimWorkspace() {
  const [isPagesCollapsed, setIsPagesCollapsed] = useState(false);
  const { claimId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: claim, isLoading, error, refetch } = useClaim(claimId);
  const activeDocumentId = useWorkspaceStore((state) => state.activeDocumentId);
  const activePage = useWorkspaceStore((state) => state.activePage);
  const workspaceMode = useWorkspaceStore((state) => state.workspaceMode);
  const setActiveDocumentId = useWorkspaceStore((state) => state.setActiveDocumentId);
  const setActivePage = useWorkspaceStore((state) => state.setActivePage);
  const setWorkspaceMode = useWorkspaceStore((state) => state.setWorkspaceMode);
  const resetWorkspace = useWorkspaceStore((state) => state.resetWorkspace);
  const selectedPageIds = usePageSelectionStore((state) => state.selectedPageIds);
  const togglePage = usePageSelectionStore((state) => state.togglePage);
  const { edit, isEditing, editError } = useDocumentOperations();
  const [editDraftName, setEditDraftName] = useState('');

  useEffect(() => {
    if (!claim) {
      return;
    }

    if (!activeDocumentId || !claim.documents.some((document) => document.id === activeDocumentId)) {
      setActiveDocumentId(claim.documents[0]?.id ?? null);
      setActivePage(1);
    }
  }, [activeDocumentId, claim, setActiveDocumentId, setActivePage]);

  useEffect(() => {
    return () => {
      resetWorkspace();
    };
  }, [resetWorkspace]);

  const activeDocument = useMemo(
    () => claim?.documents.find((document) => document.id === activeDocumentId) ?? claim?.documents[0],
    [activeDocumentId, claim]
  );

  const activePageData = useMemo(
    () => activeDocument?.pages.find((page) => page.pageNumber === activePage),
    [activeDocument, activePage]
  );

  useEffect(() => {
    if (workspaceMode === 'edit' && activeDocument) {
      setEditDraftName(activeDocument.name);
    }
  }, [activeDocument, workspaceMode]);

  const handleBack = useCallback(() => {
    const from = location.state?.from as string | undefined;
    navigate(from ?? '/claims', { replace: true });
  }, [location, navigate]);

  const handleStartEdit = useCallback(() => {
    if (activeDocument) {
      setEditDraftName(activeDocument.name);
      setWorkspaceMode('edit');
    }
  }, [activeDocument, setWorkspaceMode]);

  const handleCancelEdit = useCallback(() => {
    setEditDraftName(activeDocument?.name ?? '');
    setWorkspaceMode('view');
  }, [activeDocument?.name, setWorkspaceMode]);

  const handleSaveEdit = useCallback(async () => {
    if (!claim || !activeDocument || !editDraftName.trim()) {
      return;
    }

    await edit({
      claimId: claim.id,
      documentId: activeDocument.id,
      name: editDraftName.trim(),
    });

    setWorkspaceMode('view');
  }, [activeDocument, claim, edit, editDraftName, setWorkspaceMode]);

  if (isLoading) {
    return (
      <SkeletonLoader />
    );
  }

  if (error) {
    const claimNotFound = (error as Error).message === 'Claim not found';

    return (
      <div className="flex min-h-[50vh] flex-col items-start justify-center gap-4 rounded-[28px] border border-shell-border bg-shell-panelSoft p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-shell-accentSoft text-shell-accent">
          {claimNotFound ? <FileX2 className="h-6 w-6" /> : <Loader2 className="h-6 w-6 animate-spin" />}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {claimNotFound ? 'Claim not found' : 'Unable to load claim'}
          </h1>
          <p className="mt-1 text-sm text-shell-muted">
            {claimNotFound ? 'This claim no longer exists or the URL is invalid.' : 'Please retry to load the workspace again.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-shell-border bg-white px-4 py-2 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to grid
          </button>
          {!claimNotFound ? (
            <button type="button" onClick={() => refetch()} className="rounded-xl bg-shell-accent px-4 py-2 text-sm font-medium text-white">
              Retry
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (!claim) {
    return null;
  }

  if (claim.documents.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-start justify-center gap-4 rounded-[28px] border border-shell-border bg-shell-panelSoft p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-shell-accentSoft text-shell-accent">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">No documents</h1>
          <p className="mt-1 text-sm text-shell-muted">This claim does not have any documents yet.</p>
        </div>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-xl border border-shell-border bg-white px-4 py-2 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to grid
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SelectionToolbar claimId={claim.id} activeDocument={activeDocument} activePageNumber={activePage} />
      <header className="flex items-center justify-between gap-4">
        <div>
          <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 text-sm font-medium text-shell-muted hover:text-shell-text">
            <ArrowLeft className="h-4 w-4" />
            Back to claims
          </button>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{claim.customerName}</h1>
          <p className="mt-1 text-sm text-shell-muted">Claim ID {claim.id}</p>
        </div>
        <div className="rounded-2xl border border-shell-border bg-shell-panelSoft px-4 py-3 text-sm text-shell-muted">
          {claim.documents.length} documents · {claim.documents.reduce((total, document) => total + document.pageCount, 0)} pages
        </div>
      </header>

      <div className="grid min-h-[720px] grid-cols-[300px_minmax(0,1fr)_360px] gap-4">
        <aside className="overflow-hidden rounded-[28px] border border-shell-border bg-shell-panelSoft">
          <div className="border-b border-shell-border px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-shell-muted">Documents</h2>
          </div>
          <div className="space-y-2 p-3">
            {claim.documents.map((document) => {
              const isActive = document.id === activeDocument?.id;

              return (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => {
                    setActiveDocumentId(document.id);
                    setActivePage(1);
                  }}
                  className={[
                    'w-full rounded-2xl border px-4 py-4 text-left transition',
                    isActive
                      ? 'border-shell-accent bg-white shadow-card'
                      : 'border-shell-border bg-white/70 hover:border-shell-accent/40 hover:bg-white',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-shell-text">{document.name}</div>
                      <div className="mt-1 text-xs text-shell-muted">{document.type}</div>
                    </div>
                    <span className="rounded-full border border-shell-border bg-shell-panelSoft px-2.5 py-1 text-[11px] font-medium text-shell-muted">
                      {document.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-shell-muted">
                    <span>{document.pageCount} pages</span>
                    <span>{formatBytes(document.size)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="overflow-hidden rounded-[28px] border border-shell-border bg-shell-panelSoft p-4">
          {activeDocument ? (
            <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 rounded-[24px] bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-shell-border pb-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-shell-text">{activeDocument.name}</h2>
                  <p className="mt-1 text-sm text-shell-muted">
                    {activeDocument.type} · {activeDocument.pageCount} pages · {formatBytes(activeDocument.size)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-shell-border bg-shell-panelSoft px-4 py-2 text-sm text-shell-muted">
                    {activeDocument.status}
                  </div>
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    disabled={isEditing}
                    className="rounded-xl border border-shell-border bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {workspaceMode === 'edit' ? (
                <EditPanel
                  documentName={editDraftName}
                  isSaving={isEditing}
                  errorMessage={editError ? editError.message : undefined}
                  onCancel={handleCancelEdit}
                  onSave={handleSaveEdit}
                />
              ) : null}

              <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-shell-border bg-shell-panelSoft">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-shell-accentSoft text-shell-accent">
                    <FileText className="h-12 w-12" />
                  </div>
                  <div className="mt-5 text-2xl font-semibold tracking-tight">PAGE {activePage}</div>
                  <p className="mt-2 text-sm text-shell-muted">Document preview shell</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-shell-border bg-shell-panelSoft p-4">
                <button
                  type="button"
                  onClick={() => setIsPagesCollapsed((value) => !value)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-shell-border bg-white px-3 py-2 text-left"
                >
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-shell-muted">Pages</h3>
                    <p className="mt-1 text-xs text-shell-muted">Select pages for future workspace actions.</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-shell-muted">
                    <span className="whitespace-nowrap">{selectedPageIds.size} selected</span>
                    <ChevronDown className={['h-4 w-4 transition-transform', isPagesCollapsed ? '-rotate-90' : 'rotate-0'].join(' ')} />
                  </div>
                </button>

                {!isPagesCollapsed ? (
                  <div className="mt-3 space-y-2">
                    {activeDocument.pages.map((page) => {
                      const isSelected = selectedPageIds.has(page.id);

                      return (
                        <div
                          key={page.id}
                          className={[
                            'flex items-center gap-3 rounded-2xl border bg-white px-3 py-2 transition',
                            page.pageNumber === activePage ? 'border-shell-accent shadow-card' : 'border-shell-border hover:border-shell-accent/40',
                          ].join(' ')}
                        >
                          <button
                            type="button"
                            onClick={() => setActivePage(page.pageNumber)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-shell-text">Page {page.pageNumber}</div>
                                <div className="truncate text-xs text-shell-muted">{page.id} · {page.comments.length} comments</div>
                              </div>
                            </div>
                          </button>
                          <PageSelectionControl
                            isSelected={isSelected}
                            onToggle={() => togglePage(page.id, activeDocument.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-shell-border pt-4">
                <div className="text-sm text-shell-muted">
                  Page {activePage} of {activeDocument.pageCount}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={activePage <= 1}
                    onClick={() => setActivePage(activePage - 1)}
                    className="rounded-xl border border-shell-border bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={activePage >= activeDocument.pageCount}
                    onClick={() => setActivePage(activePage + 1)}
                    className="rounded-xl border border-shell-border bg-white px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <CommentsPanel claimId={claim.id} pageId={activePageData?.id} comments={activePageData?.comments ?? []} />
      </div>
    </div>
  );
}
