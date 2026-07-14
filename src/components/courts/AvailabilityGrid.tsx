import { TimeSlot } from '@/types/booking.types';

interface AvailabilityGridProps {
  date: string;
  bookedSlots: TimeSlot[];
  selectedSlot: { start: string; end: string } | null;
  onSelectSlot: (start: string, end: string) => void;
  openHour?: number;
  closeHour?: number;
}

function isBooked(hour: number, date: string, bookedSlots: TimeSlot[]) {
  const slotStart = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00`);
  return bookedSlots.some((slot) => {
    const bookedStart = new Date(slot.start_time);
    const bookedEnd = new Date(slot.end_time);
    return slotStart >= bookedStart && slotStart < bookedEnd;
  });
}

export function AvailabilityGrid({
  date,
  bookedSlots,
  selectedSlot,
  onSelectSlot,
  openHour = 6,
  closeHour = 22,
}: AvailabilityGridProps) {
  const hours = Array.from({ length: closeHour - openHour }, (_, i) => openHour + i);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {hours.map((hour) => {
        const booked = isBooked(hour, date, bookedSlots);
        const start = `${date}T${String(hour).padStart(2, '0')}:00:00`;
        const end = `${date}T${String(hour + 1).padStart(2, '0')}:00:00`;
        const isSelected = selectedSlot?.start === start;

        return (
          <button
            key={hour}
            disabled={booked}
            onClick={() => onSelectSlot(start, end)}
            className={`py-3 rounded-lg text-label-md font-bold border transition-all ${
              booked
                ? 'bg-surface-container text-outline border-outline-variant cursor-not-allowed opacity-50'
                : isSelected
                ? 'bg-primary text-on-primary border-primary scale-105'
                : 'bg-white text-on-surface border-outline-variant hover:border-primary hover:text-primary'
            }`}
          >
            {String(hour).padStart(2, '0')}:00
          </button>
        );
      })}
    </div>
  );
}
