"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiHolosphere } from "react-icons/gi";
import { Menu, X } from "lucide-react";

import { Prosto_One } from "next/font/google";

const prostoOne = Prosto_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Community", href: "#community" },
  { name: "Technology", href: "#technology" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoText = "erehpSorgA" ;
  const letters = logoText.split("");

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-red-500 w-fit mx-auto mt-5 rounded-full backdrop-blur-md shadow-lg"
          : "bg-red-500 w-fit mx-auto mt-5 rounded-full"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between lg:justify-center lg:gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

                <div className="hidden lg:flex items-center gap-8">
                {navLinks.slice(0, 2).map((link, index) => (
                  <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                  {link.name}
                  </motion.a>
                ))}
                </div>

                <motion.a
                href="#"
                className="flex items-center gap-2 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                >
                  <GiHolosphere className="text-primary text-3xl" />
                </motion.div>
                <div className="flex overflow-hidden">
                  {letters.reverse().map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                    delay: 0.65 + index * 0.4 * 0.08,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={prostoOne.className + " text-2xl"}
                  >
                    {/* {letter} */}
                  </motion.span>
                  ))}
                </div>
                </motion.a>

                {/* Right Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(2, 4).map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 2), duration: 0.75 }}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-7 pb-4 border-t border-border pt-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
