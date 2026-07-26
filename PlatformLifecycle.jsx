import {
  UserPlus,
  Search,
  Ticket,
  QrCode,
  Award,
  Bell,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const DURATION = 9; // seconds for one full lifecycle loop
const VB_W = 1200;
const VB_H = 360;

const STAGES = [
  { icon: UserPlus, title: "Create account", y: 250 },
  { icon: Search, title: "Browse events", y: 110 },
  { icon: Ticket, title: "Registration", y: 250 },
  { icon: QrCode, title: "QR check-in", y: 110 },
  { icon: Award, title: "Certificates", y: 250 },
  { icon: Bell, title: "Notifications", y: 110 },
  { icon: MessageSquare, title: "Feedback", y: 250 },
  { icon: BarChart3, title: "Analytics", y: 110 },
];

const MARGIN_X = 70;
const STEP_X = (VB_W - MARGIN_X * 2) / (STAGES.length - 1);
const POINTS = STAGES.map((s, i) => ({ x: MARGIN_X + i * STEP_X, y: s.y }));

function smoothPath(pts) {
  const d = [`M${pts[0].x},${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`);
  }
  return d.join(" ");
}

const PATH_D = smoothPath(POINTS);

export default function PlatformLifecycle() {
  return (
    <div
      className="w-full bg-[#151321] px-6 py-16 sm:px-10"
      style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
    >
      <style>{`
        @keyframes nodePulse {
          0%, 96%, 100% {
            background: #1E1B2E;
            border-color: #2E2A42;
            box-shadow: none;
            transform: translate(-50%, -50%) scale(1);
          }
          2% {
            background: #FF5470;
            border-color: #FF5470;
            box-shadow: 0 0 26px 6px rgba(255, 84, 112, 0.55);
            transform: translate(-50%, -50%) scale(1.22);
          }
          9% {
            background: #1E1B2E;
            border-color: #00C2A8;
            box-shadow: 0 0 14px 2px rgba(0, 194, 168, 0.35);
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes iconPulse {
          0%, 96%, 100% { color: #8B8698; }
          2%, 9% { color: #F7F3ED; }
        }
        @keyframes labelPulse {
          0%, 96%, 100% { color: #6E6A80; }
          2%, 9% { color: #F7F3ED; }
        }
        .lifecycle-node { animation: nodePulse ${DURATION}s linear infinite; }
        .lifecycle-icon { animation: iconPulse ${DURATION}s linear infinite; }
        .lifecycle-label { animation: labelPulse ${DURATION}s linear infinite; }
      `}</style>

      <div className="mx-auto max-w-5xl">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#00C2A8] uppercase">
          / the lifecycle
        </p>
        <h2 className="mt-3 text-[30px] sm:text-[36px] font-bold leading-[1.1] text-[#F7F3ED]">
          One flow, start to end.
        </h2>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#B9B4C7]">
          Watch an attendee move through the platform, one stage lighting up
          after the next.
        </p>

        <div className="relative mt-12 w-full overflow-x-auto">
          <div
            className="relative mx-auto min-w-[720px]"
            style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
          >
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="litGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF5470" />
                  <stop offset="100%" stopColor="#00C2A8" />
                </linearGradient>
                <radialGradient id="cometGrad">
                  <stop offset="0%" stopColor="#FFF3F0" />
                  <stop offset="45%" stopColor="#FF5470" />
                  <stop offset="100%" stopColor="#FF5470" stopOpacity="0" />
                </radialGradient>
                <filter id="cometGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={PATH_D}
                fill="none"
                stroke="#2E2A42"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={PATH_D}
                fill="none"
                stroke="url(#litGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.35"
              />

              <circle r="9" fill="url(#cometGrad)" filter="url(#cometGlow)">
                <animateMotion
                  dur={`${DURATION}s`}
                  repeatCount="indefinite"
                  path={PATH_D}
                  rotate="auto"
                />
              </circle>
              <circle r="3.5" fill="#FFF6F4">
                <animateMotion
                  dur={`${DURATION}s`}
                  repeatCount="indefinite"
                  path={PATH_D}
                  rotate="auto"
                />
              </circle>
            </svg>

            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const pt = POINTS[i];
              const leftPct = (pt.x / VB_W) * 100;
              const topPct = (pt.y / VB_H) * 100;
              const labelBelow = stage.y > VB_H / 2;
              const delay = -((i / (STAGES.length - 1)) * DURATION);

              return (
                <div
                  key={stage.title}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                >
                  <div
                    className="lifecycle-node flex h-11 w-11 items-center justify-center rounded-full border-2"
                    style={{ animationDelay: `${delay}s`, transform: "translate(-50%, -50%)" }}
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className="lifecycle-icon"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  </div>
                  <span
                    className="lifecycle-label absolute w-24 text-center text-[11px] font-medium leading-tight"
                    style={{
                      animationDelay: `${delay}s`,
                      top: labelBelow ? "26px" : "-40px",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    {stage.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
