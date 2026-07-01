import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin · PANDORA BuilderThan',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-deep-ocean">{children}</div>
}
