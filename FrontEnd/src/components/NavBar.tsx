interface NavBarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  bookedCount: number;
}

const sections = [
  { id: "home", label: "Dashboard" },
  { id: "available", label: "Available" },
  { id: "booked", label: "My Bookings" },
];

const NavBar = ({ activeSection, onNavigate, bookedCount }: NavBarProps) => (
  <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
    <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
      <span className="font-semibold tracking-[0.1em] text-foreground">CHRONOS</span>
      <div className="flex gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeSection === s.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
            {s.id === "booked" && bookedCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose text-rose-foreground text-xs font-semibold">
                {bookedCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

export default NavBar;
