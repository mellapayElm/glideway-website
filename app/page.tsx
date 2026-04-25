'use client';

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { MissionSection } from "@/components/mission-section"
import { FareEstimateSection } from "@/components/fare-estimate-section"
import { RideTypesSection } from "@/components/ride-types-section"
import { FeaturesSection } from "@/components/features-section"
import { DriverSection } from "@/components/driver-section"
import { SupportSection } from "@/components/support-section"
import { AuthSection } from "@/components/auth-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <MissionSection />
      <FareEstimateSection />
      <RideTypesSection />
      <FeaturesSection />
      <DriverSection />
      <SupportSection />
      <AuthSection />
      <Footer />
    </main>
  )
}
