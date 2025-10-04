"use client"

import { Navbar } from "./_components/navbar"
import { HeroSection } from "./_components/hero-section"
import { FeaturesSection } from "./_components/features-section"
import { Footer } from "./_components/footer"
import CurvedLoop from "./_components/curved-loop"

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
        <section id="community" className="h-[60vh] w-full bg-white flex items-center justify-center py-4">
          <CurvedLoop
            marqueeText="Plan 🌱 Plant 🌾 Grow 🚜 Manage 🌻 Farming 👨‍🌾 Community 🤝 Harvest 🌽 Profit 💰 Cultivate 💚 "
            speed={2}
            curveAmount={220}
            direction="left"
            interactive={true}
            className="fill-black "
          />
        </section>
      </div>

      <div className="sticky z-0 bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  )
}
