import { useState } from "react";
import { Slot } from "@/lib/slots";
import SlotCard from "./SlotCard";
import { Search, Calendar } from "lucide-react";

interface AvailableSlotsProps {
  slots: Slot[];
  onBook: (id: string) => void;
}

const AvailableSlots = ({ slots, onBook }: AvailableSlotsProps) => {
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");

  const available = slots.filter((s) => {
    if (s.status !== "available") return false;
    if (dateFilter && s.date !== dateFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.id.toLowerCase().includes(q) || s.time.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <section className="animate-fade-in-up">
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold">Available Slots</h1>
          <div className="flex gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-9 pr-3 py-2.5 rounded-md border border-border bg-card text-foreground font-outfit text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search ID or Time..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2.5 rounded-md border border-border bg-card text-foreground font-outfit text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 w-48"
              />
            </div>
          </div>
        </div>
      </header>
      {available.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map((slot) => (
            <SlotCard key={slot.id} slot={slot} actionType="book" onAction={onBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          No available slots found matching your criteria.
        </div>
      )}
    </section>
  );
};

export default AvailableSlots;
