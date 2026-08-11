import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CustomerFilters } from './customers/components/CustomerFilters';
import { CustomerGrid } from './customers/components/CustomerGrid';
import { CustomerPagination } from './customers/components/CustomerPagination';
import { CustomerSort } from './customers/components/CustomerSort';
import { useCustomers } from './customers/hooks/useCustomers';
import type { CustomerSortField, CustomersQuery } from './customers/types/types';
import { StatCardSection } from './customers/components/StatCardSection';
import { Loader } from '../../shared/components/Loader';

const PAGE_SIZE = 10;

function createQuery(searchParams: URLSearchParams): CustomersQuery {
  const sortField = (searchParams.get('sortField') as CustomerSortField | null) ?? 'createdAt';
  const sortDirection = searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc';

  return {
    search: searchParams.get('search') ?? '',
    filters: {},
    sort: {
      field: sortField,
      direction: sortDirection,
    },
    page: Math.max(1, Number(searchParams.get('page') ?? '1') || 1),
    pageSize: PAGE_SIZE,
  };
}

export function ClaimsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => createQuery(searchParams), [searchParams]);
  const [searchInput, setSearchInput] = useState(query.search);
  const { data, error, isFetching, isLoading, refetch } = useCustomers(query);

  const customers = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const updateParams = useCallback((updater: (params: URLSearchParams) => void) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      updater(next);
      return next;
    });
  }, [setSearchParams]);

  const setSort = (sort: { field: CustomerSortField; direction: 'asc' | 'desc' }) => {
    updateParams((next) => {
      next.delete('page');
      next.set('sortField', sort.field);
      next.set('sortDirection', sort.direction);
    });
  };

  const setPage = (page: number) => {
    updateParams((next) => {
      next.set('page', String(page));
    });
  };

  const handleSelectRow = (customerId: string) => {
    navigate(`/claims/${customerId}`, {
      state: {
        from: `${location.pathname}${location.search}`,
      },
    });
  };

  const runSearch = useCallback(() => {
    const nextSearch = searchInput.trim();

    updateParams((next) => {
      if (nextSearch) {
        next.set('search', nextSearch);
      } else {
        next.delete('search');
      }
      next.delete('page');
    });
  }, [searchInput, updateParams]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hello Saswat 👋🏼,</h1>
          <p className="mt-1 text-sm text-shell-muted">Claims workspace shell</p>
        </div>
        <CustomerFilters value={searchInput} onChange={setSearchInput} onSubmit={runSearch} isFetching={isFetching} />
      </header>

      <StatCardSection />

      <section className="rounded-[28px] border border-shell-border bg-shell-panelSoft p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">All Customers</h2>
            <p className="mt-0.5 text-sm text-teal-600">Active Members</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CustomerSort field={query.sort.field} direction={query.sort.direction} onChange={setSort} />
          </div>
        </div>

        {isLoading && customers.length === 0 ? (
            <div className="flex justify-center">
              <Loader />
            </div>
        ) : (
          <CustomerGrid
            data={customers}
            isFetching={isFetching}
            error={error as Error | null}
            onRetry={() => refetch()}
            onSelectRow={handleSelectRow}
          />
        )}

        <CustomerPagination page={data?.page ?? query.page} totalPages={totalPages} total={total} pageSize={query.pageSize} onPageChange={setPage} />
      </section>
    </div>
  );
}
