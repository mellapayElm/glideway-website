import { GlideWaySplash } from "@/components/mobile/glideway-splash"

export const metadata = {
  title: "Welcome to GlideWay | Your Ride. Your Way.",
  description: "Ride smoothly. Arrive safely. Welcome to GlideWay - Your premium ride-sharing service."
}

export default function SplashPage() {
  return (
    <main className="w-full">
      <GlideWaySplash />
    </main>
  )
}
