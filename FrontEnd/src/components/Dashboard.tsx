import { Slot } from "@/lib/slots";

interface StatCardProps {
  label: string;
  value: number;
  colorClass?: string;
}

const StatCard = ({ label, value, colorClass }: StatCardProps) => (
  <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
    <span className="block text-sm font-medium text-muted-foreground mb-2">{label}</span>
    <span className={`text-4xl font-semibold tabular-nums ${colorClass || "text-foreground"}`}>
      {value}
    </span>
  </div>
);

interface DashboardProps {
  slots: Slot[];
}

const Dashboard = ({ slots }: DashboardProps) => {
  const total = slots.length;
  const available = slots.filter((s) => s.status === "available").length;
  const booked = slots.filter((s) => s.status === "booked").length;

  return (
    <section className="animate-fade-in-up">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold">Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time availability and booking metrics.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total Slots" value={total} />
        <StatCard label="Available" value={available} colorClass="text-emerald" />
        <StatCard label="Your Bookings" value={booked} colorClass="text-rose" />
      </div>
    </section>
  );
};

export default Dashboard;
