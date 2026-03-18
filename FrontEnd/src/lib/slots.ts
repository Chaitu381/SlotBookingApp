export interface Slot {
  id: string;
  date: string;
  time: string;
  status: "available" | "booked";
}

const STORAGE_KEY = "chronos_slots";

export const generateInitialSlots = (): Slot[] => {
  const slots: Slot[] = [];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
  const today = new Date();
  const dates = [
    today.toISOString().split("T")[0],
    new Date(today.getTime() + 86400000).toISOString().split("T")[0],
    new Date(today.getTime() + 86400000 * 2).toISOString().split("T")[0],
  ];

  dates.forEach((date) => {
    times.forEach((time, index) => {
      slots.push({
        id: `SLOT-${date.replace(/-/g, "")}-${index}`,
        date,
        time,
        status: "available",
      });
    });
  });

  return slots;
};

export const loadSlots = (): Slot[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return generateInitialSlots();
};

export const saveSlots = (slots: Slot[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
};
