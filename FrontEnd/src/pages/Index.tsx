import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavBar from "@/components/NavBar";
import Dashboard from "@/components/Dashboard";
import AvailableSlots from "@/components/AvailableSlots";
import BookedSlots from "@/components/BookedSlots";
import { toast } from "sonner";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const queryClient = useQueryClient();

  // FETCH SLOTS FROM BACKEND
  const { data: slots = [], isLoading, isError } = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:5000/slots");
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();

      return data.map((slot: any) => ({
        id: String(slot.id),
        time: slot.time,
        date: slot.date,
        status: slot.booked === 0 ? "available" : "booked",
      }));
    },
  });

  // BOOK SLOT
  const bookMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("http://127.0.0.1:5000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(id) }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to book slot");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      toast.success("Booking Confirmed!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to book slot");
    },
  });

  const bookSlot = (id: string) => {
    bookMutation.mutate(id);
  };

  // CANCEL SLOT
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("http://127.0.0.1:5000/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(id) }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel slot");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      toast.success("Booking Cancelled!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel slot");
    },
  });

  const cancelSlot = (id: string) => {
    cancelMutation.mutate(id);
  };

  // Handle loading and error states
  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar activeSection={activeSection} onNavigate={setActiveSection} bookedCount={0} />
        <main className="max-w-[1100px] mx-auto px-6 py-12">
          <div className="text-center text-rose">
            <p className="text-xl font-semibold">Failed to load slots</p>
            <p className="text-muted-foreground mt-2">Please refresh the page and try again</p>
          </div>
        </main>
      </div>
    );
  }

  const bookedCount = slots.filter((s: any) => s.status === "booked").length;

  return (
    <div className="min-h-screen bg-background">
      <NavBar activeSection={activeSection} onNavigate={setActiveSection} bookedCount={bookedCount} />

      <main className="max-w-[1100px] mx-auto px-6 py-12">
        {activeSection === "home" && <Dashboard slots={slots} />}
        {activeSection === "available" && <AvailableSlots slots={slots} onBook={bookSlot} />}
        {activeSection === "booked" && <BookedSlots slots={slots} onCancel={cancelSlot} />}
      </main>
    </div>
  );
};

export default Index;