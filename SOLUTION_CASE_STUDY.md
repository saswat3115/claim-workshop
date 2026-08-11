# Insurance Claims Management UI - Solution Study

## 1. What I Built

I built a React + TypeScript frontend for an Insurance Claims Management case study.

The UI includes:

- a large customer/claims grid
- server-side pagination, sorting, and filtering
- a claim workspace for documents
- page selection
- edit, split, merge, and delete document actions
- page-level comments
- role-based UI action control

The goal was to keep the app scalable for large datasets and document-heavy workflows.

## 2. Case Study Goal

The case study asks for a UI that can handle:

- 20,000+ grid records
- very large documents
- safe document operations
- comments at page level
- performance and scalability
- RBAC-based action control

I designed the app to keep UI state, server state, and business actions separate.

## 3. Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand for UI state
- TanStack Query for server state and mutations
- Repository pattern for backend abstraction
- Mock APIs for this case study

## 4. Architecture

The app is split into clear layers:

- UI components handle rendering.
- Zustand stores UI interaction state like selected pages and active workspace context.
- TanStack Query handles server data, caching, and mutation state.
- Feature hooks coordinate business actions.
- Repositories isolate the UI from backend implementation details.
- Mock repositories simulate the backend for the case study.

Simple flow:

```text
UI Components
  → Zustand for UI state
  → TanStack Query for server state
  → Feature Hooks
  → Repository Layer
  → Mock APIs
```

## 5. Grid Strategy

The case study mentions large datasets, so I used:

- server-side pagination
- server-side sorting
- server-side filtering

Why:

- lower browser memory usage
- faster initial load
- predictable rendering
- correct sorting/filtering across the full dataset

I chose pagination over infinite scroll because this is a business workflow, not a casual content feed.

## 6. Document Workspace

The workspace supports document review and page-level actions.

Features:

- open a claim from the grid
- switch between documents
- select pages
- edit document name
- split selected pages into a new document
- merge selected pages into a new document
- delete selected pages with confirmation
- add page-level comments

For very large documents, the production approach would use partial or page-based loading instead of loading the full document into browser memory.

## 7. Document Operations

All structural operations go through one hook:

- `edit()`
- `split()`
- `merge()`
- `delete()`

This keeps the workspace clean and makes the behavior easy to extend later.

### Why this matters

- one place for document actions
- easier to maintain
- easier to test
- easy to replace mock APIs with real APIs later

## 8. Optimistic vs Pessimistic UI

I used different patterns depending on the action.

### Comments: optimistic

Comments update immediately in the UI, then the request is sent.

This gives fast feedback and fits collaboration behavior.

### Document operations: pessimistic

Edit, split, merge, and delete are confirmed before applying.

This is safer because these actions change document structure.

## 9. RBAC (Not implemented as there is no BE)

## 10. Performance Strategy

Main performance choices:

- server-side data operations for the grid
- TanStack Query caching
- selective Zustand subscriptions
- local loading and error states
- targeted cache updates after mutations
- partial document loading strategy for large files

These choices keep the UI responsive and reduce unnecessary re-renders.

## 11. Trade-offs

| Area | Choice | Why |
| --- | --- | --- |
| Large dataset | Pagination | Better memory and performance |
| Client state | Zustand | Lightweight UI state |
| Server state | TanStack Query | Caching and mutation lifecycle |
| API access | Repository pattern | Backend-independent UI |
| Comments | Optimistic updates | Immediate feedback |
| Document actions | Pessimistic updates | Safer structural changes |
| Framework | React + Vite | Fast client-side app setup |

## 12. How The App Works

1. User opens the customer grid.
2. User selects a claim row.
3. The workspace loads the claim documents.
4. User selects pages in the document.
5. User performs edit, split, merge, or delete.
6. The UI shows local loading and confirmation states.
7. TanStack Query updates the claim cache after success.
8. The workspace reconciles active page/document state.

## 13. Local Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## 14. Final Summary

This solution keeps the app scalable, maintainable, and easy to replace with real backend services later.

The main design idea is simple:

- Zustand for UI state
- TanStack Query for server state
- repository layer for backend abstraction
- optimistic UI for comments
- pessimistic confirmation for structural document operations
