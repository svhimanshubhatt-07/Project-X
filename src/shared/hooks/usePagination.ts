import { useState, useMemo } from 'react';
import { PaginatedResult, PaginationParams } from '../types/pagination.types';

export function usePagination<T>(items: T[], initialLimit: number = 10) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialLimit);

  const paginatedData = useMemo<PaginatedResult<T>>(() => {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const normalizedPage = Math.min(Math.max(1, currentPage), totalPages);
    
    const startIndex = (normalizedPage - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total,
      page: normalizedPage,
      limit: pageSize,
      totalPages,
    };
  }, [items, currentPage, pageSize]);

  return {
    ...paginatedData,
    setPage: setCurrentPage,
    setPageSize,
    nextPage: () => setCurrentPage((p) => Math.min(paginatedData.totalPages, p + 1)),
    prevPage: () => setCurrentPage((p) => Math.max(1, p - 1)),
  };
}
