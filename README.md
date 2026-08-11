# Insurance Claims Management UI

Frontend implementation of the Insurance Claims Management case study.

The application focuses on a scalable UI for large datasets and document-heavy workflows, including customer/claim management and document workspace operations.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand for client/UI state
- TanStack Query for server state, caching, and mutations
- Repository pattern for API/backend abstraction
- Mock APIs for simulated backend and document-processing behavior

## Architecture

The application keeps server state, UI state, and business operations separated to avoid unnecessary global state and coupling.

```text
UI Components
     │
     ├── Zustand
     │    └── UI state / page selection
     │
     ├── TanStack Query
     │    └── Server state / cache
     │
     └── Feature Hooks
              │
        Repository Layer
              │
          Mock APIs
```

## State Ownership

- Zustand owns interaction state such as selected pages, active document, active page, and workspace mode.
- TanStack Query owns server state, cache, and mutation lifecycle.
- Feature hooks coordinate business workflows and repository calls.
- Mock repositories simulate backend behavior and can later be replaced with real services without changing the UI architecture.

## Grid Strategy

The case study requires handling 20,000+ records with sorting and filtering.

This UI uses server-side pagination, sorting, and filtering instead of loading the entire dataset into the browser.

Benefits:

- Lower browser memory usage
- Faster initial load
- Predictable rendering
- Correct sorting/filtering across the complete dataset
- Page-level caching with TanStack Query

Trade-off: pagination requires explicit navigation, but it is a better fit for an enterprise document-management workflow than infinite scrolling.

## Document Workspace

The workspace supports:

- Page selection
- Edit
- Split
- Merge
- Delete
- Page-level comments

For very large documents, the production architecture would use partial or page-based loading rather than downloading the full document into browser memory.

## Document Operations

Document operations are centralized through `useDocumentOperations()`:

- `edit()`
- `split()`
- `merge()`
- `delete()`

Structural document operations use a confirmed, pessimistic flow because they can significantly change document structure.

Comments use optimistic updates:

- User posts a comment
- UI updates immediately
- API request runs
- Success reconciles
- Failure rolls back

This keeps collaboration responsive while preserving structural consistency for edits and page/document operations.

## How To Use The Claim Workspace

Use this quick flow during the interview demo:

1. Open a claim from the customer grid.
2. Choose a document from the left navigation.
3. Use the page list to select one or more pages.
4. Click the action you want from the selection toolbar.
5. Confirm destructive actions when prompted.

### Page Selection

- Click the checkbox on a page row to select or deselect it.
- Selection is used as the input for split, merge, and delete actions.
- The selected page count is shown in the toolbar.

### Edit Page / Document Name

- Select a document in the workspace.
- Click `Edit`.
- Update the document name in the edit panel.
- Save to apply the change.

### Split Pages

- Select one or more pages from the same document.
- Click `Split`.
- The selected pages are moved into a new document.
- The original document keeps the remaining pages.

### Merge Pages

- Select at least two pages.
- Click `Merge`.
- Confirm the merge action.
- The selected pages are combined into a new document.

### Delete Pages

- Select one or more pages.
- Click `Delete`.
- Review the confirmation prompt.
- Confirm to permanently remove the selected pages.

## RBAC

Frontend permissions control the UX by showing or hiding actions and disabling unavailable operations.

The backend remains the source of truth for authorization.

## Performance and Scalability

Key considerations:

- Server-side grid operations
- Query-level caching
- Minimal React re-renders
- Selective Zustand subscriptions
- Server state kept outside global UI state
- Partial document loading strategy
- Localized loading/error states
- Targeted cache updates after mutations

The architecture is designed to scale with increasing record volume, document size, and concurrent operations.

## Key Trade-offs

| Decision | Choice | Reason |
| --- | --- | --- |
| Large dataset | Pagination | Predictable memory and performance |
| Client state | Zustand | Lightweight UI state |
| Server state | TanStack Query | Caching and mutation lifecycle |
| API abstraction | Repository | Backend-independent UI |
| Comments | Optimistic | Immediate feedback |
| Document operations | Pessimistic | Safer structural consistency |
| Framework | React + Vite | Client-heavy application with no SSR requirement |

## Running Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Backend APIs and document-processing services are mocked for this case study. The repository abstraction allows them to be replaced with real services without changing the UI architecture.
