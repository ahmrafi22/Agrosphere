"use client"

import { Navbar } from "./_components/navbar"
import { HeroSection } from "./_components/hero-section"
import { FeaturesSection } from "./_components/features-section"
import { Footer } from "./_components/footer"
import { Loop } from "./_components/loop"

export default function Home() {
  return (
      <div className="relative w-full min-h-screen">
        <Navbar />

        <div className="relative z-10">
        {/* First Page - Hero */}
        <div id="home" className="bg-white">
          <HeroSection />
        </div>

        {/* Second Page - Features */}
        <div id="features" className="bg-white">
          <FeaturesSection />
        </div>

        {/* Third Page - Curved Loop */}
        <Loop />
      </div>

      <div className="sticky z-0 bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  )
}
