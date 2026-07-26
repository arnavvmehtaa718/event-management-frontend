import { useState } from "react";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    tag: "CONFERENCE",
    title: "Product Design Summit",
    date: "Aug 14",
    location: "Bengaluru",
    top: "6%",
    left: "4%",
    width: "58%",
    rotate: -7,
    z: 1,
  },
  {
    tag: "MEETUP",
    title: "AI Builders Night",
    date: "Sep 03",
    location: "Mumbai",
    top: "32%",
    left: "38%",
    width: "58%",
    rotate: 6,
    z: 2,
  },
  {
    tag: "FESTIVAL",
    title: "Indie Music Fest",
    date: "Sep 19",
    location: "Goa",
    top: "60%",
    left: "6%",
    width: "58%",
    rotate: -5,
    z: 3,
  },
];

export default function EventFlashCardScatter() {
  const [active, setActive] = useState(null);

  return (
    <div
      className="relative w-full max-w-[480px] aspect-square rounded-3xl border overflow-hidden"
      style={{
        background: "#111014",
        borderColor: "#2B2A20",
        backgroundImage:
          "linear-gradient(#1C1B15 1px, transparent 1px), linear-gradient(90deg, #1C1B15 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes cardDrop {
          from { opacity: 0; transform: translateY(24px) rotate(var(--r)) scale(0.94); }
          to { opacity: 1; transform: translateY(0) rotate(var(--r)) scale(1); }
        }
      `}</style>

      <span
        className="absolute left-6 top-5 z-20 text-[11px] font-medium tracking-wide"
        style={{ color: "#8B8A7C", fontFamily: "ui-monospace, monospace" }}
      >
        featured events
      </span>

      {CARDS.map((card, i) => {
        const isActive = active === i;
        return (
          <div
            key={card.title}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="absolute rounded-2xl border p-4 cursor-pointer transition-all duration-300"
            style={{
              top: card.top,
              left: card.left,
              width: card.width,
              zIndex: isActive ? 20 : card.z,
              background: "#18170F",
              borderColor: isActive ? "#F6C445" : "#2B2A20",
              boxShadow: isActive
                ? "0 24px 48px -20px rgba(246,196,69,0.25)"
                : "0 16px 32px -18px rgba(0,0,0,0.7)",
              transform: isActive
                ? "rotate(0deg) scale(1.06)"
                : `rotate(${card.rotate}deg) scale(1)`,
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              animation: `cardDrop 0.6s cubic-bezier(0.22,1,0.36,1) both`,
              animationDelay: `${i * 0.15}s`,
              "--r": `${card.rotate}deg`,
            }}
          >
            <div className="flex items-start justify-between">
              <span
                className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide"
                style={{ background: "#F6C445", color: "#171407" }}
              >
                {card.tag}
              </span>
              <ArrowUpRight
                size={16}
                style={{ color: isActive ? "#F6C445" : "#4A4838" }}
                className="transition-colors"
              />
            </div>

            <h3
              className="mt-2.5 text-[16px] font-bold leading-tight"
              style={{ color: "#F5F3EC" }}
            >
              {card.title}
            </h3>

            <div className="mt-2.5 flex items-center gap-3 text-[11.5px]" style={{ color: "#A9A798" }}>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} style={{ color: "#F6C445" }} />
                {card.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} style={{ color: "#F6C445" }} />
                {card.location}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
