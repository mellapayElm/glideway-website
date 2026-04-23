import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "GlideWay Management Portal",
  description: "Secure operations dashboard for authorized GlideWay staff only.",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
