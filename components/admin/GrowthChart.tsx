interface Point {
  label: string
  value: number
}

/**
 * Responsive SVG area chart for registration growth over time.
 * Pure presentational component (no client JS required).
 */
export default function GrowthChart({ data }: { data: Point[] }) {
  const W = 640
  const H = 220
  const padX = 8
  const padTop = 20
  const padBottom = 28

  const hasData = data.length > 0 && data.some((d) => d.value > 0)
  const max = Math.max(1, ...data.map((d) => d.value))
  const innerW = W - padX * 2
  const innerH = H - padTop - padBottom
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0

  const xy = (i: number, v: number) => {
    const x = padX + (data.length > 1 ? i * stepX : innerW / 2)
    const y = padTop + innerH - (v / max) * innerH
    return [x, y] as const
  }

  // Smooth-ish line using straight segments (crisp + light)
  const linePath = data
    .map((d, i) => {
      const [x, y] = xy(i, d.value)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  const areaPath = hasData
    ? `${linePath} L ${(padX + innerW).toFixed(1)} ${(padTop + innerH).toFixed(1)} L ${padX.toFixed(1)} ${(
        padTop + innerH
      ).toFixed(1)} Z`
    : ''

  // Gridlines (4 horizontal)
  const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => padTop + innerH - t * innerH)

  return (
    <div className="w-full">
      {hasData ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64E6FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="growthLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64E6FF" />
              <stop offset="100%" stopColor="#8A2BE2" />
            </linearGradient>
          </defs>

          {grid.map((y, i) => (
            <line
              key={i}
              x1={padX}
              y1={y}
              x2={W - padX}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          ))}

          <path d={areaPath} fill="url(#growthFill)" />
          <path d={linePath} fill="none" stroke="url(#growthLine)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

          {data.map((d, i) => {
            const [x, y] = xy(i, d.value)
            return <circle key={i} cx={x} cy={y} r={2.5} fill="#64E6FF" />
          })}
        </svg>
      ) : (
        <div className="flex h-[180px] items-center justify-center font-inter text-sm text-white/25">
          Not enough data yet to chart growth.
        </div>
      )}

      {/* X-axis labels (first / mid / last to avoid clutter) */}
      {hasData && data.length > 1 && (
        <div className="mt-2 flex justify-between font-inter text-[10px] uppercase tracking-wider text-white/30">
          <span>{data[0].label}</span>
          <span>{data[Math.floor(data.length / 2)].label}</span>
          <span>{data[data.length - 1].label}</span>
        </div>
      )}
    </div>
  )
}
