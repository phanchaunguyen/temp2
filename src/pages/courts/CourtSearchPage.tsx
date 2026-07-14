import { MainLayout } from '@/components/layout/MainLayout';
import { CourtCard } from '@/components/courts/CourtCard';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner, ErrorBanner, EmptyState } from '@/components/common/Feedback';
import { useCourts } from '@/hooks/useCourts';
import { SportType } from '@/types/booking.types';

const sportOptions: { value: SportType | ''; label: string }[] = [
  { value: '', label: 'Tất cả môn' },
  { value: 'badminton', label: 'Cầu lông' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'pickleball', label: 'Pickleball' },
  { value: 'futsal', label: 'Futsal' },
];

export default function CourtSearchPage() {
  const { courts, total, query, setQuery, isLoading, error } = useCourts({ page: 1, limit: 8 });

  return (
    <MainLayout>
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-headline-lg font-bold text-on-surface">Tìm sân cầu lông</h2>
          <p className="text-body-md text-on-surface-variant">Lọc theo môn thể thao hoặc khu vực để tìm sân phù hợp</p>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nhập địa chỉ, quận..."
            value={query.address ?? ''}
            onChange={(e) => setQuery({ ...query, address: e.target.value, page: 1 })}
            className="flex-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
          />
          <select
            value={query.sport_type ?? ''}
            onChange={(e) =>
              setQuery({ ...query, sport_type: (e.target.value || undefined) as SportType | undefined, page: 1 })
            }
            className="px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
          >
            {sportOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <LoadingSpinner label="Đang tìm sân phù hợp..." />}
        {error && <ErrorBanner message={error} />}

        {!isLoading && !error && courts.length === 0 && (
          <EmptyState
            icon="search_off"
            title="Không tìm thấy sân nào"
            description="Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác."
          />
        )}

        {!isLoading && !error && courts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {courts.map((court) => (
                <CourtCard key={court.court_id} court={court} />
              ))}
            </div>
            <Pagination
              page={query.page ?? 1}
              limit={query.limit ?? 8}
              total={total}
              onPageChange={(page) => setQuery({ ...query, page })}
            />
          </>
        )}
      </section>
    </MainLayout>
  );
}
