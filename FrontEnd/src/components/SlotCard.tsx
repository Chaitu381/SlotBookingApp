import { Slot } from "@/lib/slots";

interface SlotCardProps {
  slot: Slot;
  actionType: "book" | "cancel";
  onAction: (id: string) => void;
}

const SlotCard = ({ slot, actionType, onAction }: SlotCardProps) => {
  const formattedDate = new Date(slot.date + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-muted-foreground hover:-translate-y-0.5 hover:shadow-md">
      <span
        className={`absolute top-6 right-6 w-2 h-2 rounded-full ${
          slot.status === "available"
            ? "bg-emerald shadow-[0_0_8px_hsl(var(--emerald))]"
            : "bg-rose"
        }`}
      />
      <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {slot.id}
      </span>
      <div className="text-xl font-semibold">{slot.time}</div>
      <div className="text-muted-foreground text-sm mb-6">{formattedDate}</div>
      {actionType === "book" ? (
        <button
          onClick={() => onAction(slot.id)}
          className="w-full py-3 rounded-md bg-emerald text-emerald-foreground font-semibold transition-colors duration-200 hover:opacity-90"
        >
          Book Now
        </button>
      ) : (
        <button
          onClick={() => onAction(slot.id)}
          className="w-full py-3 rounded-md bg-rose/10 text-rose font-semibold transition-colors duration-200 hover:bg-rose/20"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};

export default SlotCard;
