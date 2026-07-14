import { Court } from '@/types/booking.types';
import { useNavigate } from 'react-router-dom';

const sportLabel: Record<string, string> = {
  badminton: 'Cầu lông',
  tennis: 'Tennis',
  pickleball: 'Pickleball',
  futsal: 'Futsal',
};

export function CourtCard({ court }: { court: Court }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/courts/${court.court_id}`, { state: { court } })}
      className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group border border-outline-variant overflow-hidden"
    >
      <div className="relative h-48">
        <img className="w-full h-full object-cover" src={court.image_url} alt={court.name} />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-label-sm font-bold text-white ${
            court.is_active ? 'bg-primary' : 'bg-error'
          }`}
        >
          {court.is_active ? 'Trống sân' : 'Sắp hết'}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors">
          <span className="material-symbols-outlined text-sm">favorite</span>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
              {court.name}
            </h4>
            <span className="text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full">
              {sportLabel[court.sport_type] ?? court.sport_type}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-label-sm">{court.address}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-yellow-500">star</span>
            <span className="text-label-md font-bold">{court.rating.toFixed(1)}</span>
            <span className="text-label-sm text-on-surface-variant">({court.review_count})</span>
          </div>
          <p className="text-primary font-bold text-label-md">
            {court.price_per_hour.toLocaleString('vi-VN')}đ<span className="text-on-surface-variant font-normal">/h</span>
          </p>
        </div>
      </div>
    </div>
  );
}
