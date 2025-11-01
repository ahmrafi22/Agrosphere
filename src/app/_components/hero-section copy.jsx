"use client"

import { motion } from "framer-motion"
import { GiHolosphere } from "react-icons/gi"
import Image from "next/image"
import { MorphingLoginButton } from "./MorphingLoginButton"


export function HeroSection({ loginFormOpen, setLoginFormOpen }) {
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
                <div className="text-center w-full max-w-[95%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] xl:max-w-[70%] mx-auto mt-0 md:mt-4">
                    <div className="relative inline-block mb-8 md:mb-12 w-full">
                        <div className="relative space-y-1 md:space-y-3 w-full">
                            {/* Mobile Only: First Line - Icon + Agrosphere */}
                            <div className="w-full overflow-hidden md:hidden -translate-x-1.5">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="whitespace-nowrap text-stone-800 leading-tight flex items-center justify-center gap-2"
                                    style={{ fontSize: "clamp(1.5rem, 7vw, 2.5rem)" }}
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
                                        <GiHolosphere className="drop-shadow-[0_5px_5px_rgba(34,197,94,0.5)] text-green-400" style={{ width: "clamp(2rem, 6vw, 3rem)", height: "clamp(2rem, 6vw, 3rem)" }} />
                                    </motion.span>

                                    {["Agrosphere"].map((word, wordIndex) => (
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
                                                        fontFamily: "'Prosto One', sans-serif",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {char === " " ? "\u00A0" : char}
                                                </motion.span>
                                            ))}
                                        </span>
                                    ))}
                                </motion.h1>
                            </div>

                            {/* Mobile Only: Second Line - Smart Farming */}
                            <div className="overflow-hidden md:hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 1.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="whitespace-nowrap text-stone-800 leading-tight"
                                    style={{ 
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: "clamp(1.25rem, 5.5vw, 2rem)"
                                    }}
                                >
                                    {["Smart", " ", "Farming"].map((word, wordIndex) => (
                                        <span key={wordIndex} className="inline-block">
                                            {word.split("").map((char, charIndex) => (
                                                <motion.span
                                                    key={charIndex}
                                                    initial={{ y: "100%", opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        delay: 1.0 + wordIndex * 0.05 + charIndex * 0.01,
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

                            {/* Tablet/Desktop Only: First Line - Icon + Agrosphere */}
                            <div className="overflow-hidden hidden md:block">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="whitespace-nowrap text-stone-800 leading-tight flex items-center justify-center gap-2"
                                    style={{ fontSize: "clamp(1.5rem, 3.5vw, 4rem)" }}
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
                                        <GiHolosphere className="text-green-400 drop-shadow-[0_5px_5px_rgba(34,197,94,0.5)]" style={{ width: "clamp(2rem, 3.5vw, 5rem)", height: "clamp(2rem, 3.5vw, 5rem)" }} />
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

                            {/* Rest */}
                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="whitespace-nowrap text-stone-800 leading-tight"
                                    style={{ 
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: "clamp(1.25rem, 3.5vw, 4rem)"
                                    }}
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

                            {/* Images + Modern Farmers */}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                                {/* Farmer Images */}
                                <div className="relative flex items-center shrink-0" style={{ height: "clamp(3.5rem, 5.5vw, 7rem)" }}>
                                    {/* Left Image  */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0, rotate: 0 }}
                                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative z-30"
                                    >
                                        <motion.div
                                        >
                                            <Image
                                                src="/men1.png"
                                                alt="Male Farmer"
                                                width={96}
                                                height={96}
                                                quality={100}
                                                priority
                                                className="rounded-2xl object-cover object-[10%_10%]"
                                                style={{ 
                                                    width: "clamp(3.5rem, 5.5vw, 6rem)", 
                                                    height: "clamp(3.5rem, 5.5vw, 6rem)" 
                                                }}
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Center Image  */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0, rotate: 0 }}
                                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative z-20 -ml-6"
                                    >
                                        <motion.div
                                        >
                                            <Image
                                                src="/women1.png"
                                                alt="Female Farmer"
                                                width={96}
                                                height={96}
                                                quality={100}
                                                priority
                                                className="rounded-2xl object-cover object-[10%_10%]"
                                                style={{ 
                                                    width: "clamp(3.5rem, 5.5vw, 6rem)", 
                                                    height: "clamp(3.5rem, 5.5vw, 6rem)" 
                                                }}
                                            />
                                        </motion.div>
                                    </motion.div>

                                    {/* Right Image  */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0, rotate: 0 }}
                                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                                        transition={{ delay: 2.0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative z-10 -ml-6"
                                    >
                                        <motion.div
                                        >
                                            <Image
                                                src="/dada1.png"
                                                alt="Male Farmer with Wheat"
                                                width={96}
                                                height={96}
                                                quality={100}
                                                priority
                                                className="rounded-2xl object-cover object-[10%_10%]"
                                                style={{ 
                                                    width: "clamp(3.5rem, 5.5vw, 6rem)", 
                                                    height: "clamp(3.5rem, 5.5vw, 6rem)" 
                                                }}
                                            />
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Last Text */}
                                <div className="overflow-hidden shrink-0">
                                    <motion.h1
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ delay: 2.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                        className="whitespace-nowrap text-stone-800 leading-tight"
                                        style={{ 
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: "clamp(1.25rem, 3.5vw, 4rem)"
                                        }}
                                    >
                                        {["MODERN", " ", "Farmers"].map((word, wordIndex) => (
                                            <span key={wordIndex} className="inline-block">
                                                {word.split("").map((char, charIndex) => (
                                                    <motion.span
                                                        key={charIndex}
                                                        initial={{ 
                                                            y: "100%", 
                                                            opacity: word === "MODERN" ? 0 : 0 
                                                        }}
                                                        animate={{ 
                                                            y: 0, 
                                                            opacity: word === "MODERN" ? 1 : 1 
                                                        }}
                                                        transition={{
                                                            delay: 2.2 + wordIndex * 0.05 + charIndex * 0.01,
                                                            duration: word === "MODERN" ? 0.6 : 0.4,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                        className="inline-block"
                                                        style={{
                                                            fontWeight: word === "MODERN" ? "900" : "normal",
                                                        }}
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
                    className="absolute bottom-[8%] md:bottom-[10%] left-1/2 -translate-x-1/2"
                >
                    <MorphingLoginButton 
                        externalOpen={loginFormOpen}
                        onExternalOpenChange={setLoginFormOpen}
                    />
                </motion.div>
            </div>
        </section>
    )
}
