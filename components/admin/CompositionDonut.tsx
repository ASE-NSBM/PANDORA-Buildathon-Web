interface Segment {
  label: string
  value: number
  color: string
}

/**
 * Responsive SVG donut chart for team-size composition.
 * Pure presentational component (no client JS required).
 */
export default function CompositionDonut({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: Segment[]
  centerValue: number
  centerLabel: string
}) {
  const size = 180
  const stroke = 22
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const C = 2 * Math.PI * r

  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const hasData = total > 0

  let offset = 0

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-around">
      <div className="relative shrink-0">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-40 w-40 -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          {hasData &&
            segments.map((s, i) => {
              if (s.value === 0) return null
              const frac = s.value / total
              const dash = frac * C
              const seg = (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${C - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              )
              offset += dash
              return seg
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-poppins text-2xl font-bold text-white">{centerValue}</span>
          <span className="font-inter text-[10px] uppercase tracking-widest text-white/40">{centerLabel}</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {segments.map((s) => {
          const pct = hasData ? Math.round((s.value / total) * 100) : 0
          return (
            <div key={s.label} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-inter text-xs text-white/60">{s.label}</span>
              <span className="ml-auto font-inter text-xs font-semibold text-white/80">{pct}%</span>
            </div>
          )
        })}
        {!hasData && <p className="font-inter text-xs text-white/25">No teams yet.</p>}
      </div>
    </div>
  )
}
