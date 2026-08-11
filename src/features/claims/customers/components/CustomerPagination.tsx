import { ChevronLeft, ChevronRight } from 'lucide-react';
import { numberFormat } from '../../../../shared/utils/number';
import { useCallback } from 'react';

type CustomerPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(totalPages - 1, page + 1);

  if (left > 2) {
    pages.push('ellipsis');
  }

  for (let current = left; current <= right; current += 1) {
    pages.push(current);
  }

  if (right < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

const navButtonClass = 'flex h-8 w-8 items-center justify-center rounded-md border border-shell-border bg-white text-shell-text transition disabled:cursor-not-allowed disabled:opacity-40';

export function CustomerPagination({ page, totalPages, total, pageSize, onPageChange }: CustomerPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const visiblePages = getVisiblePages(page, totalPages);

  const pageButtonClass = useCallback((isActive: boolean) =>
    [
      'flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-medium transition',
      isActive
        ? 'border-[#5f3df7] bg-[#5f3df7] text-white shadow-sm'
        : 'border-shell-border bg-white text-shell-text hover:bg-shell-panelSoft',
    ].join(' '), []);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-shell-muted">
      <span className="text-[#c0c3cf] text-small">
        Showing data {start} to {end} of {numberFormat(total)} entries
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className={navButtonClass}
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        <div className="flex items-center gap-3">
          {visiblePages.map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-1 text-lg leading-none text-shell-muted">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? 'page' : undefined}
                className={pageButtonClass(item === page)}
              >
                {numberFormat(item)}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className={navButtonClass}
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
