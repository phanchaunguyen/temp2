interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2 rounded-full disabled:opacity-30 hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <span className="text-label-md text-on-surface-variant">
        Trang {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="p-2 rounded-full disabled:opacity-30 hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}
