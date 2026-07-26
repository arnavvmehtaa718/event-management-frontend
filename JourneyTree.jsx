import {
  Search,
  QrCode,
  Award,
  ScanLine,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const GOLD = "#F6C445";
const INK = "#0B0A08";
const PANEL = "#16150E";
const BORDER = "#2B2A20";
const TEXT = "#F5F3EC";
const MUTED = "#8B8A7C";
const MONO = "ui-monospace, monospace";

const STAGES = [
  {
    side: "right",
    step: "01",
    eyebrow: "discovery",
    title: "Find events that matter",
    desc: "Search understands what you're looking for — filter by category, city, or format.",
    bullets: ["Keyword & filter search", "Category, city & mode filters", "Online, offline & hybrid"],
    delayFrac: 0.08,
  },
  {
    side: "left",
    step: "02",
    eyebrow: "registration",
    title: "Register in seconds",
    desc: "One tap and you're in — instant QR ticket, confirmation email, and calendar invite.",
    bullets: ["One-tap registration", "Instant QR ticket", "Email & calendar sync"],
    delayFrac: 0.5,
  },
  {
    side: "right",
    step: "03",
    eyebrow: "check-in",
    title: "Scan. Verify. Done.",
    desc: "Organizers scan your QR at the door. Attendance is tracked and certificates issue instantly.",
    bullets: ["QR scan at the door", "Instant attendance marking", "Auto-issued certificates"],
    delayFrac: 0.9,
  },
];

const DURATION = 20;

function DiscoveryPanel() {
  return (
    <div className="rounded-xl border p-3.5" style={{ background: PANEL, borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: MUTED, fontFamily: MONO }}>discovery feed</span>
        <span
          className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold"
          style={{ background: "#1E2A1E", color: "#7ED957" }}
        >
          live feed
        </span>
      </div>
      <div className="mt-2.5 space-y-2">
        {[
          { tag: "Technology", title: "AI/ML Workshop 2026", loc: "Bangalore" },
          { tag: "Design", title: "Design Systems Summit", loc: "Mumbai" },
        ].map((e) => (
          <div key={e.title} className="rounded-lg border p-2.5" style={{ borderColor: BORDER }}>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold"
              style={{ background: GOLD, color: "#171407" }}
            >
              {e.tag}
            </span>
            <p className="mt-1.5 text-[12.5px] font-bold" style={{ color: TEXT }}>{e.title}</p>
            <p className="text-[10.5px]" style={{ color: MUTED, fontFamily: MONO }}>{e.loc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationPanel() {
  return (
    <div className="rounded-xl border p-3.5" style={{ background: PANEL, borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: MUTED, fontFamily: MONO }}>registration flow</span>
        <span
          className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold"
          style={{ background: "#1E2A1E", color: "#7ED957" }}
        >
          one tap
        </span>
      </div>
      <div className="mt-2.5 rounded-lg border p-2.5" style={{ borderColor: BORDER }}>
        <p className="text-[12.5px] font-bold" style={{ color: TEXT }}>AI/ML Workshop 2026</p>
        <p className="text-[10.5px]" style={{ color: MUTED, fontFamily: MONO }}>Aug 15 · Bangalore · Hybrid</p>
        <div className="mt-2 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: GOLD }}
          >
            <QrCode size={15} style={{ color: "#171407" }} />
          </div>
          <div>
            <p className="text-[11.5px] font-semibold" style={{ color: TEXT }}>Ticket #EH-4829</p>
            <p className="text-[10px]" style={{ color: MUTED }}>QR issued instantly</p>
          </div>
        </div>
      </div>
      <div
        className="mt-2 flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px]"
        style={{ background: "#152014", color: "#7ED957" }}
      >
        <CheckCircle2 size={13} />
        Registration confirmed
      </div>
    </div>
  );
}

function CheckinPanel() {
  return (
    <div className="rounded-xl border p-3.5" style={{ background: PANEL, borderColor: BORDER }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: MUTED, fontFamily: MONO }}>check-in portal</span>
        <span
          className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold"
          style={{ background: "#1E2A1E", color: "#7ED957" }}
        >
          live
        </span>
      </div>
      <div className="mt-2.5 space-y-2">
        <div className="flex items-center gap-2 rounded-lg border p-2.5" style={{ borderColor: BORDER }}>
          <ScanLine size={16} style={{ color: GOLD }} />
          <div>
            <p className="text-[11.5px] font-semibold" style={{ color: TEXT }}>Scan QR ticket</p>
            <p className="text-[10px]" style={{ color: MUTED }}>Point camera at attendee QR</p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-2.5 py-2"
          style={{ background: "#152014" }}
        >
          <Award size={16} style={{ color: "#7ED957" }} />
          <div>
            <p className="text-[11.5px] font-semibold" style={{ color: "#F5F3EC" }}>Certificate issued</p>
            <p className="text-[10px]" style={{ color: "#7ED957" }}>Auto-generated</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PANELS = [DiscoveryPanel, RegistrationPanel, CheckinPanel];

export default function JourneyTree() {
  return (
    <div
      className="w-full px-6 py-16 sm:px-10"
      style={{ background: INK, fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
    >
      <style>{`
        @keyframes spineComet {
          from { top: 0%; }
          to { top: 100%; }
        }
        @keyframes nodePulse {
          0%, 92%, 100% {
            background: ${PANEL};
            border-color: ${BORDER};
            box-shadow: none;
            transform: translate(-50%, -50%) scale(1);
          }
          4% {
            background: ${GOLD};
            border-color: ${GOLD};
            box-shadow: 0 0 22px 5px rgba(246,196,69,0.55);
            transform: translate(-50%, -50%) scale(1.3);
          }
        }
        .tree-node { animation: nodePulse ${DURATION}s linear infinite; }
      `}</style>

      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]"
            style={{ borderColor: BORDER, color: MUTED, fontFamily: MONO }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
            the journey
          </span>
          <h2 className="mt-4 text-[30px] sm:text-[36px] font-bold leading-[1.1]" style={{ color: TEXT }}>
            One flow, three moments.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed" style={{ color: MUTED }}>
            From the first search to the door scan, it's one connected path — not three disconnected tools.
          </p>
        </div>

        <div
          className="relative mt-14 grid gap-y-14"
          style={{ gridTemplateColumns: "1fr 40px 1fr" }}
        >
          <div
            className="absolute w-px"
            style={{
              left: "50%",
              top: "0",
              bottom: "0",
              background: BORDER,
              gridColumn: "2",
            }}
          />
          <div
            className="pointer-events-none absolute h-3 w-3 rounded-full"
            style={{
              left: "calc(50% - 6px)",
              boxShadow: `0 0 16px 4px ${GOLD}`,
              background: GOLD,
              animation: `spineComet ${DURATION}s linear infinite`,
            }}
          />

          {STAGES.map((stage, i) => {
            const Panel = PANELS[i];
            const isRight = stage.side === "right";
            const delay = -(stage.delayFrac * DURATION);

            const content = (
              <div className={isRight ? "" : "text-right"}>
                <span
                  className="inline-flex items-center gap-2 text-[11px]"
                  style={{ color: MUTED, fontFamily: MONO }}
                >
                  {stage.step} · {stage.eyebrow}
                </span>
                <h3 className="mt-2 text-[21px] font-bold leading-tight" style={{ color: TEXT }}>
                  {stage.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                  {stage.desc}
                </p>
                <ul className={`mt-3 space-y-1.5 ${isRight ? "" : "flex flex-col items-end"}`}>
                  {stage.bullets.map((b) => (
                    <li
                      key={b}
                      className={`flex items-center gap-1.5 text-[12.5px] ${isRight ? "" : "flex-row-reverse"}`}
                      style={{ color: "#C9C7B8" }}
                    >
                      <span className="h-1 w-1 rounded-full" style={{ background: GOLD }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Panel />
                </div>
              </div>
            );

            return (
              <div key={stage.step} className="contents">
                <div style={{ gridColumn: "1", gridRow: i + 1, visibility: isRight ? "hidden" : "visible" }}>
                  {!isRight && content}
                </div>
                <div
                  className="relative flex items-center justify-center"
                  style={{ gridColumn: "2", gridRow: i + 1 }}
                >
                  <div
                    className="tree-node rounded-full border-2"
                    style={{
                      width: "16px",
                      height: "16px",
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      animationDelay: `${delay}s`,
                    }}
                  />
                </div>
                <div style={{ gridColumn: "3", gridRow: i + 1, visibility: isRight ? "visible" : "hidden" }}>
                  {isRight && content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
