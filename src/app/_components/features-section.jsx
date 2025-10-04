"use client"

import { motion } from "framer-motion"
import { GiWheat, GiFarmTractor, GiMoneyStack } from "react-icons/gi"
import { FaRobot } from "react-icons/fa"
import { WiDaySunny } from "react-icons/wi"
import { MdLandscape } from "react-icons/md"
import { IoMdPeople } from "react-icons/io"
import { HiBell } from "react-icons/hi"

const features = [
  {
    icon: MdLandscape,
    emoji: "🧑‍🌾",
    title: "Land Management",
    description: "Track your land portfolio with soil insights",
    color: "bg-green-50",
    iconColor: "text-green-500",
    size: "large",
  },
  {
    icon: GiWheat,
    emoji: "📊",
    title: "Crop Planning",
    description: "Plan crops & track yields",
    color: "bg-amber-50",
    iconColor: "text-amber-500",
    size: "medium",
  },
  {
    icon: GiMoneyStack,
    emoji: "💰",
    title: "Financial Tracking",
    description: "Manage expenses & loans",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
    size: "medium",
  },
  {
    icon: IoMdPeople,
    emoji: "🤝",
    title: "Community",
    description: "Connect with farmers nearby",
    color: "bg-sky-50",
    iconColor: "text-sky-500",
    size: "small",
  },
  {
    icon: WiDaySunny,
    emoji: "🌦️",
    title: "Weather Insights",
    description: "Plan with real-time weather",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
    size: "small",
  },
  {
    icon: FaRobot,
    emoji: "🤖",
    title: "AI Assistant",
    description: "Get expert farming advice instantly",
    color: "bg-green-50",
    iconColor: "text-green-600",
    size: "large",
  },
  {
    icon: HiBell,
    emoji: "🔔",
    title: "Stay Updated",
    description: "Notifications & alerts",
    color: "bg-stone-50",
    iconColor: "text-stone-600",
    size: "small",
  },
  {
    icon: GiFarmTractor,
    emoji: "🛠️",
    title: "Equipment Rental",
    description: "Access tools & resources",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    size: "medium",
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="min-h-screen w-full relative overflow-hidden py-12 md:py-20 px-4 md:px-8 bg-white"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(74, 222, 128, 0.4) 0%, transparent 60%),
            radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 0%, rgba(240, 253, 244, 0.5) 0%, transparent 80%)
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-1 auto-rows-fr">
          {/* Large Feature 1 - Land Management */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -right-12 -top-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <MdLandscape className="w-48 h-48 text-green-500" />
            </div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">{features[0].emoji}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">{features[0].title}</h3>
              <p className="text-stone-600 text-base md:text-lg mb-4">{features[0].description}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm text-stone-700">Track Land</span>
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm text-stone-700">Soil Insights</span>
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm text-stone-700">Crop Suggestions</span>
              </div>
            </div>
          </motion.div>

          {/* Medium Feature 1 - Crop Planning */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="lg:col-span-2 bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <GiWheat className="w-32 h-32 text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">{features[1].emoji}</div>
              <h3 className="text-xl md:text-2xl font-bold text-stone-800 mb-2">{features[1].title}</h3>
              <p className="text-stone-600">{features[1].description}</p>
            </div>
          </motion.div>

          {/* Small Feature 1 - Community */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <IoMdPeople className="w-24 h-24 text-sky-500" />
            </div>
            <div className="relative z-10">
              <div className="text-4xl mb-3">{features[3].emoji}</div>
              <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-2">{features[3].title}</h3>
              <p className="text-sm text-stone-600">{features[3].description}</p>
            </div>
          </motion.div>

          {/* Small Feature 2 - Weather */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <WiDaySunny className="w-24 h-24 text-orange-400" />
            </div>
            <div className="relative z-10">
              <div className="text-4xl mb-3">{features[4].emoji}</div>
              <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-2">{features[4].title}</h3>
              <p className="text-sm text-stone-600">{features[4].description}</p>
            </div>
          </motion.div>

          {/* Medium Feature 2 - Financial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -left-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <GiMoneyStack className="w-32 h-32 text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">{features[2].emoji}</div>
              <h3 className="text-xl md:text-2xl font-bold text-stone-800 mb-2">{features[2].title}</h3>
              <p className="text-stone-600">{features[2].description}</p>
            </div>
          </motion.div>

          {/* Large Feature 2 - AI Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -left-12 -bottom-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <FaRobot className="w-48 h-48 text-green-600" />
            </div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">{features[5].emoji}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">{features[5].title}</h3>
              <p className="text-stone-600 text-base md:text-lg mb-4">{features[5].description}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm text-stone-700">24/7 Support</span>
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm text-stone-700">Expert Tips</span>
                <span className="px-3 py-1 bg-white/60 rounded-full text-sm text-stone-700">Smart Advice</span>
              </div>
            </div>
          </motion.div>

          {/* Medium Feature 3 - Equipment */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="lg:col-span-1 bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -top-6 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
              <GiFarmTractor className="w-24 h-24 text-amber-600" />
            </div>
            <div className="relative z-10">
              <div className="text-4xl mb-3">{features[7].emoji}</div>
              <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-2">{features[7].title}</h3>
              <p className="text-sm text-stone-600">{features[7].description}</p>
            </div>
          </motion.div>

          {/* Small Feature 3 - Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
            className="lg:col-span-1 bg-gradient-to-br from-stone-50 to-stone-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <HiBell className="w-24 h-24 text-stone-600" />
            </div>
            <div className="relative z-10">
              <div className="text-4xl mb-3">{features[6].emoji}</div>
              <h3 className="text-lg md:text-xl font-bold text-stone-800 mb-2">{features[6].title}</h3>
              <p className="text-sm text-stone-600">{features[6].description}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
