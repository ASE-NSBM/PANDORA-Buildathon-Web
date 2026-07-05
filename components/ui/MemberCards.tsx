import Image from 'next/image'
import { Mail } from 'lucide-react'

export interface Member {
  role: string
  name: string
  email?: string
  org?: string
  image?: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : name.slice(0, 2)).toUpperCase()
}

/**
 * Responsive grid of member cards. `columns` controls the max-width row layout
 * (e.g. 4 committee members or 5 development-team members in a single line on
 * large screens, wrapping gracefully on smaller viewports).
 */
export default function MemberCards({
  members,
  columns = 4,
}: {
  members: Member[]
  columns?: 4 | 5
}) {
  const lgCols = columns === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 ${lgCols} gap-4 sm:gap-6`}>
      {members.map((m) => (
        <div
          key={`${m.name}-${m.role}`}
          className="group relative flex h-[290px] flex-col items-center justify-start overflow-hidden
                     rounded-card border border-white/10 px-6 pb-6 pt-8 text-center backdrop-blur-2xl
                     bg-gradient-to-br from-midnight-blue/90 via-deep-ocean/70 to-bio-cyan/15
                     transition-all duration-300 hover:border-bright-cyan/40 hover:shadow-cyan-glow
                     sm:h-[310px] sm:px-8 sm:pb-8"
        >
          {/* Soft cyan corner glow (bottom-right) */}
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-bright-cyan/10 blur-2xl transition-all duration-500 group-hover:bg-bright-cyan/20" />
          {/* Subtle top highlight edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bright-cyan/40 to-transparent" />

          {/* Fixed-height image container keeps every avatar on one baseline */}
          <div className="flex h-20 w-full items-start justify-center sm:h-24">
            {m.image ? (
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-bright-cyan/60 shadow-cyan-glow sm:h-24 sm:w-24">
                <Image
                  src={m.image}
                  alt={m.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            ) : (
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold text-white ring-2 ring-bright-cyan/60 shadow-cyan-glow sm:h-24 sm:w-24 sm:text-3xl"
                style={{ background: 'linear-gradient(135deg, #1E5F7A 0%, #24A3C7 60%, #64E6FF 100%)' }}
              >
                {initials(m.name)}
              </div>
            )}
          </div>

          <h3 className="mt-5 flex min-h-[2.6em] items-center justify-center text-center font-display font-semibold leading-tight text-white text-sm sm:text-base">
            {m.name}
          </h3>
          <p className="mt-1.5 flex min-h-[2.4em] items-center justify-center text-center font-poppins text-bright-cyan/80 text-[9px] sm:text-[10px] tracking-[0.14em] uppercase leading-tight">
            {m.role}
          </p>
          {m.email && (
            <a
              href={`mailto:${m.email}`}
              title={m.email}
              className="focus-ring mt-3 flex items-center gap-1.5 max-w-full font-poppins text-[11px] sm:text-xs text-white/60 hover:text-bright-cyan transition-colors duration-200"
            >
              <Mail size={13} className="text-bright-cyan shrink-0" />
              <span className="min-w-0 truncate">{m.email}</span>
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
