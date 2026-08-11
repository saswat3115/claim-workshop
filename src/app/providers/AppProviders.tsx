import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { QueryProvider } from './QueryProvider';

export function AppProviders() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
