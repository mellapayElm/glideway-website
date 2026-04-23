import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GlideWay – Book a Ride",
  description: "Book safe, smooth rides with GlideWay. Fast, transparent pricing and real-time tracking.",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
