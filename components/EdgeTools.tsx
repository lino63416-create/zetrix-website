/**
 * Small gold line drawings of factory tools and machines that float gently in the
 * empty side margins on wide screens. Purely decorative: no clicks, hidden from
 * screen readers, and hidden on screens too narrow to have free margins.
 */

type Tool = { name: string; svg: React.ReactNode };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TOOLS: Tool[] = [
  {
    name: "welding torch",
    svg: (
      <g {...stroke}>
        <path d="M10 54l14-14" />
        <rect x="20" y="26" width="16" height="10" rx="3" transform="rotate(-45 28 31)" />
        <path d="M34 22l10-10 6 6-10 10" />
        <path d="M44 12l4-4" />
        <path d="M50 18l6 2M48 6l2 6M54 10l5-3" strokeWidth={1.8} />
        <circle cx="52" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    name: "angle grinder",
    svg: (
      <g {...stroke}>
        <rect x="8" y="26" width="30" height="12" rx="6" />
        <path d="M38 28h6v8h-6" />
        <circle cx="50" cy="44" r="10" />
        <circle cx="50" cy="44" r="2.5" />
        <path d="M44 32v6" />
        <path d="M18 26v-6h8v6" />
        <path d="M58 52l4 3M60 46h4M56 56l2 4" strokeWidth={1.8} />
      </g>
    ),
  },
  {
    name: "steel I-beam",
    svg: (
      <g {...stroke}>
        <path d="M12 14h40v8H36v20h16v8H12v-8h16V22H12z" />
        <path d="M18 18h28M18 46h28" strokeWidth={1.2} opacity={0.6} />
      </g>
    ),
  },
  {
    name: "gear",
    svg: (
      <g {...stroke}>
        <path d="M32 8l4 7 8-2 1 8 8 3-4 7 4 7-8 3-1 8-8-2-4 7-4-7-8 2-1-8-8-3 4-7-4-7 8-3 1-8 8 2z" />
        <circle cx="32" cy="32" r="8" />
      </g>
    ),
  },
  {
    name: "wrench and bolt",
    svg: (
      <g {...stroke}>
        <path d="M40 10a10 10 0 00-9 13L11 43a4 4 0 006 6l20-20a10 10 0 0013-9l-6 4-6-2-2-6z" />
        <path d="M46 42l6 3v7l-6 3-6-3v-7z" />
        <circle cx="46" cy="48.5" r="2" />
      </g>
    ),
  },
  {
    name: "crane hook",
    svg: (
      <g {...stroke}>
        <path d="M32 4v12" />
        <rect x="26" y="16" width="12" height="8" rx="2" />
        <path d="M32 24v8a12 12 0 1012 12" />
        <path d="M44 44l4-5" />
        <path d="M22 4h20" />
      </g>
    ),
  },
  {
    name: "laser cutting head",
    svg: (
      <g {...stroke}>
        <rect x="22" y="6" width="20" height="16" rx="3" />
        <path d="M25 22l3 12h8l3-12" />
        <path d="M30 34l2 6 2-6" />
        <path d="M32 40v10" strokeDasharray="2 3" />
        <path d="M14 54h36" />
        <path d="M26 50l-4-4M38 50l4-4M32 52v-2" strokeWidth={1.6} />
      </g>
    ),
  },
  {
    name: "welding helmet",
    svg: (
      <g {...stroke}>
        <path d="M14 30c0-12 8-20 18-20s18 8 18 20v12c0 8-8 14-18 14S14 50 14 42z" />
        <rect x="22" y="28" width="20" height="9" rx="2" />
        <path d="M10 30h4M50 30h4" />
        <path d="M26 46h12" />
      </g>
    ),
  },
];

// fixed layout (not random) so server and browser render the same markup
const SLOTS = [
  { side: "left", top: "16%", tool: 0, size: 64, delay: 0 },
  { side: "left", top: "38%", tool: 2, size: 58, delay: -3 },
  { side: "left", top: "60%", tool: 4, size: 62, delay: -6 },
  { side: "left", top: "82%", tool: 6, size: 56, delay: -2 },
  { side: "right", top: "22%", tool: 1, size: 66, delay: -4 },
  { side: "right", top: "44%", tool: 3, size: 60, delay: -1 },
  { side: "right", top: "66%", tool: 5, size: 58, delay: -5 },
  { side: "right", top: "86%", tool: 7, size: 56, delay: -7 },
] as const;

export default function EdgeTools() {
  return (
    <div className="edge-tools pointer-events-none fixed inset-y-0 z-30 hidden w-full min-[1400px]:block" aria-hidden>
      {SLOTS.map((s, i) => (
        <span
          key={i}
          className="edge-tool absolute text-gold-400"
          style={{
            top: s.top,
            [s.side]: `max(6px, calc((100vw - 80rem) / 4 - ${s.size / 2}px))`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        >
          <svg viewBox="0 0 64 64" className="h-full w-full">
            {TOOLS[s.tool].svg}
          </svg>
        </span>
      ))}
    </div>
  );
}
