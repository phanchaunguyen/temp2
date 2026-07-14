import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CourtCard } from '@/components/courts/CourtCard';
import { LoadingSpinner, ErrorBanner } from '@/components/common/Feedback';
import { useCourts } from '@/hooks/useCourts';

export default function HomePage() {
  const navigate = useNavigate();
  const { courts, isLoading, error } = useCourts({ page: 1, limit: 4 });

  return (
    <MainLayout>
      {/* Hero & quick action */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-80 rounded-xl overflow-hidden shadow-2xl group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-12 gap-4">
            <h2 className="text-display text-white max-w-md font-bold leading-tight">
              Nâng tầm đam mê cầu lông của bạn
            </h2>
            <p className="text-body-lg text-white/90 max-w-sm">
              Hệ thống đặt sân thông minh, nhanh chóng và uy tín hàng đầu.
            </p>
            <button
              onClick={() => navigate('/courts')}
              className="mt-4 w-fit bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-surface-variant transition-all hover:-translate-y-1 active:scale-95"
            >
              Khám phá sân ngay
            </button>
          </div>
        </div>

        <div className="bg-surface-container-highest rounded-xl p-6 flex flex-col gap-4 border border-outline-variant shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <h3 className="text-headline-md font-bold text-on-surface">Đặt sân của tôi</h3>
          </div>
          <p className="text-body-md text-on-surface-variant z-10">
            Theo dõi lịch đặt sân, đổi giờ, hoặc hủy khi cần — tất cả tại một nơi.
          </p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-auto z-10 border border-primary text-primary font-bold text-label-md py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Xem lịch đặt sân
          </button>
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-primary/5 opacity-20 pointer-events-none">
            sports_tennis
          </span>
        </div>
      </section>

      {/* Featured courts */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-headline-lg font-bold text-on-surface">Sân cầu lông nổi bật</h3>
            <p className="text-body-md text-on-surface-variant">Những địa điểm được đánh giá tốt nhất gần bạn</p>
          </div>
          <button
            onClick={() => navigate('/courts')}
            className="text-primary font-bold text-label-md flex items-center gap-2 hover:translate-x-1 transition-transform"
          >
            Xem tất cả <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {isLoading && <LoadingSpinner label="Đang tải sân nổi bật..." />}
        {error && <ErrorBanner message={error} />}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {courts.map((court) => (
              <CourtCard key={court.court_id} court={court} />
            ))}
          </div>
        )}
      </section>

      {/* Promotion */}
      <section>
        <div className="relative h-56 rounded-xl overflow-hidden shadow-lg border border-primary/20 bg-primary">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-between px-12">
            <div className="max-w-xl text-white">
              <h3 className="text-headline-lg font-bold">Ưu đãi thành viên mới!</h3>
              <p className="text-body-lg mt-2 opacity-90">
                Giảm ngay 50% cho lần đặt sân đầu tiên khi đăng ký tài khoản hôm nay.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="mt-6 bg-white text-primary px-6 py-2.5 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform active:scale-95"
              >
                Nhận mã ngay
              </button>
            </div>
            <div className="hidden md:block">
              <span className="material-symbols-outlined text-[160px] text-white/20">confirmation_number</span>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
