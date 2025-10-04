"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GiHolosphere } from "react-icons/gi";
import { MorphingLoginButton } from "@/app/_components/MorphingLoginButton";
import { Prosto_One } from "next/font/google";

const prostoOne = Prosto_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const AgrosphereLanding = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroText = "🌱 AgroSphere – Your Smart Farming Companion";
  const subText =
    "Track expenses, manage lands, connect with nearby farmers, and plan your harvests — all in one platform.";
  const logoText = "Agrosphere";

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          backgroundColor: "#cdfadb",
          backgroundImage: `
            radial-gradient(at 79% 25%, #cdfadb 0%, transparent 60%), 
            radial-gradient(at 20% 59%, #f6fdc3 0%, transparent 50%), 
            radial-gradient(at 47% 39%, #ffcf96 0%, transparent 40%), 
            radial-gradient(at 74% 40%, #ff8080 0%, transparent 30%)
          `,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[80vw] mx-auto min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="w-full max-w-[70vw] mx-auto mt-6 px-6 py-4 bg-blue-800/60 backdrop-blur-md rounded-full border border-sky-600/80 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GiHolosphere
                className={`h-12 w-12 text-green-400 ${prostoOne.className}`}
              />
              <span
                className={`text-2xl font-bold text-white ${prostoOne.className}`}
              >
                Agrosphere
              </span>
            </div>
            <button
              className={`px-6 py-2 text-white font-medium hover:bg-emerald-600/20 rounded-full transition-all duration-300 ${prostoOne.className}`}
            >
              About Us
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1
              className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight ${prostoOne.className}`}
            >
              {heroText}
            </h1>
            <p
              className={`text-xl md:text-2xl text-gray-700 leading-relaxed ${prostoOne.className}`}
            >
              {subText}
            </p>
          </motion.div>

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6, ease: "easeOut" }}
            className="mt-12"
          >
            <MorphingLoginButton />
          </motion.div>
        </div>
      </div>

      {/* Large Logo at Bottom */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden z-0">
        <div className="flex items-center justify-center gap-6 py-8">
          {/* Icon with shadow */}
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <GiHolosphere className="h-48 w-48 text-green-400 drop-shadow-[0_5px_15px_rgba(34,197,94,0.5)]" />
            </motion.div>
          </div>

          {/* Text with shadow */}
          <div
            className={`flex text-9xl font-bold text-black overflow-hidden leading-[1.15]  ${prostoOne.className}`}
          >
            {logoText.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 1.2 + index * 0.08,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="inline-block overflow-hidden"

              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgrosphereLanding;