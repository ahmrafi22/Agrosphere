"use client"

import { motion } from "framer-motion"
import { GiHolosphere } from "react-icons/gi"
import Image from "next/image"
import { MorphingLoginButton } from "./MorphingLoginButton"


export function HeroSection() {
    return (
        <section id="about" className="h-screen w-full relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1.1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 50% 100%, rgba(74, 222, 128, 0.4) 0%, transparent 60%),
                        radial-gradient(circle at 50% 100%, rgba(34, 197, 94, 0.4) 0%, transparent 70%),
                        radial-gradient(circle at 50% 100%, rgba(240, 253, 244, 0.5) 0%, transparent 80%)
                    `,
                }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
                <div className="text-center max-w-[70%] mx-auto mt-8 md:mt-4">
                    <div className="relative inline-block mb-8 md:mb-12">
                        <div className="relative space-y-2 md:space-y-3">
                            {/* First Line: Icon + Agrosphere Smart Farming */}
                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl text-stone-800 leading-tight flex items-center justify-center flex-wrap gap-2"
                                >
                                    <motion.span
                                        initial={{ y: "100%", opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.8,
                                            duration: 0.4,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className="inline-block"
                                    >
                                        <GiHolosphere className="w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-green-400" />
                                    </motion.span>

                                    {["Agrosphere", " ", "Smart", " ", "Farming"].map((word, wordIndex) => (
                                        <span key={wordIndex} className="inline-block">
                                            {word.split("").map((char, charIndex) => (
                                                <motion.span
                                                    key={charIndex}
                                                    initial={{ y: "100%", opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        delay: 0.8 + wordIndex * 0.05 + charIndex * 0.01,
                                                        duration: 0.4,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                    className="inline-block"
                                                    style={{
                                                        fontFamily: word === "Agrosphere" ? "'Prosto One', sans-serif" : "'Poppins', sans-serif",
                                                        fontWeight: word === "Agrosphere" ? "bold" : "normal",
                                                    }}
                                                >
                                                    {char === " " ? "\u00A0" : char}
                                                </motion.span>
                                            ))}
                                        </span>
                                    ))}
                                </motion.h1>
                            </div>

                            {/* Second Line: Companion for */}
                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl text-stone-800 leading-tight"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                >
                                    {["Companion", " ", "for"].map((word, wordIndex) => (
                                        <span key={wordIndex} className="inline-block">
                                            {word.split("").map((char, charIndex) => (
                                                <motion.span
                                                    key={charIndex}
                                                    initial={{ y: "100%", opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        delay: 1.2 + wordIndex * 0.05 + charIndex * 0.01,
                                                        duration: 0.4,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {char === " " ? "\u00A0" : char}
                                                </motion.span>
                                            ))}
                                        </span>
                                    ))}
                                </motion.h1>
                            </div>

                            {/* Third Line: Images + Modern Farmers */}
                            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                                {/* Farmer Images */}
                                <div className="relative flex items-center h-20 sm:h-24 md:h-20 lg:h-24 xl:h-28">
                                    {/* Left Image  */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0, rotate: 0 }}
                                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative z-30"
                                    >
                                        <motion.div
                                            animate={{ rotate: -8 }}
                                            transition={{ delay: 2.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            className="bg-amber-400 rounded-2xl p-2 md:p-3 shadow-lg"
                                        >
                                            <Image
                                                src="/men.png"
                                                alt="Male Farmer"
                                                width={64}
                                                height={64}
                                                className="h-16 sm:h-20 md:h-16 lg:h-20 xl:h-24 w-16 sm:w-20 md:w-16 lg:w-20 xl:w-24 object-contain"
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Center Image - Female Farmer */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0, rotate: 0 }}
                                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative z-20 -ml-4 md:-ml-6"
                                    >
                                        <motion.div
                                            animate={{ rotate: 0 }}
                                            transition={{ delay: 2.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            className="bg-blue-500 rounded-2xl p-2 md:p-3 shadow-lg"
                                        >
                                            <Image
                                                src="/women.png"
                                                alt="Female Farmer"
                                                width={64}
                                                height={64}
                                                className="h-16 sm:h-20 md:h-16 lg:h-20 xl:h-24 w-16 sm:w-20 md:w-16 lg:w-20 xl:w-24 object-contain"
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Right Image - Male Farmer with Wheat */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0, rotate: 0 }}
                                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 2.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative z-10 -ml-4 md:-ml-6"
                                    >
                                        <motion.div
                                            animate={{ rotate: 8 }}
                                            transition={{ delay: 2.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            className="bg-sky-400 rounded-2xl p-2 md:p-3 shadow-lg"
                                        >
                                            <Image
                                                src="/dada.png"
                                                alt="Male Farmer with Wheat"
                                                width={64}
                                                height={64}
                                                className="h-16 sm:h-20 md:h-16 lg:h-20 xl:h-24 w-16 sm:w-20 md:w-16 lg:w-20 xl:w-24 object-contain"
                                            />
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Modern Farmers Text */}
                                <div className="overflow-hidden">
                                    <motion.h1
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ delay: 2.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl text-stone-800 leading-tight"
                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                    >
                                        {["Modern", " ", "Farmers"].map((word, wordIndex) => (
                                            <span key={wordIndex} className="inline-block">
                                                {word.split("").map((char, charIndex) => (
                                                    <motion.span
                                                        key={charIndex}
                                                        initial={{ y: "100%", opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{
                                                            delay: 2.2 + wordIndex * 0.05 + charIndex * 0.01,
                                                            duration: 0.4,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                        className="inline-block"
                                                    >
                                                        {char === " " ? "\u00A0" : char}
                                                    </motion.span>
                                                ))}
                                            </span>
                                        ))}
                                    </motion.h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-[10%] left-1/2 -translate-x-1/2"
                >
                    <MorphingLoginButton />
                </motion.div>
            </div>
        </section>
    )
}
