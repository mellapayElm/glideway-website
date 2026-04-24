import { GlideWayMobileApp } from "@/components/mobile/glideway-mobile-app"

export const metadata = {
  title: "GlideWay - Your Ride, Your Way",
  description: "Book rides instantly with GlideWay mobile app",
}

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="relative">
        {/* Phone bezel */}
        <div className="absolute -inset-3 bg-gray-800 rounded-[3rem] shadow-2xl" />
        <div className="absolute -inset-2 bg-gray-900 rounded-[2.5rem]" />
        
        {/* Dynamic Island */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30" />
        
        {/* Screen */}
        <div className="relative w-[375px] h-[812px] rounded-[2rem] overflow-hidden">
          <GlideWayMobileApp />
        </div>
        
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-30" />
      </div>
    </div>
  )
}
