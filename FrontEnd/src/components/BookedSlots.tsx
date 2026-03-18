import { Slot } from "@/lib/slots";
import SlotCard from "./SlotCard";

interface BookedSlotsProps {
  slots: Slot[];
  onCancel: (id: string) => void;
}

const BookedSlots = ({ slots, onCancel }: BookedSlotsProps) => {
  const booked = slots.filter((s) => s.status === "booked");

  return (
    <section className="animate-fade-in-up">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage your upcoming appointments.</p>
      </header>
      {booked.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {booked.map((slot) => (
            <SlotCard key={slot.id} slot={slot} actionType="cancel" onAction={onCancel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          You haven't booked any slots yet.
        </div>
      )}
    </section>
  );
};

export default BookedSlots;
