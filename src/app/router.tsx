import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './App';
import { ClaimsPage } from '../features/claims/ClaimsPage';
import { ClaimDetailsPage } from '../features/claims/ClaimDetailsPage';
import { DocumentDetailsPage } from '../features/documents/DocumentDetailsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/claims" replace /> },
      { path: 'claims', element: <ClaimsPage /> },
      { path: 'claims/:claimId', element: <ClaimDetailsPage /> },
      { path: 'claims/:claimId/documents/:documentId', element: <DocumentDetailsPage /> },
    ],
  },
]);
