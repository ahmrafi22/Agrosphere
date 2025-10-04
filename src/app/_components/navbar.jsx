"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Community", href: "#community" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const linkRefs = useRef([])
  const [bgPosition, setBgPosition] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = ["home", "features", "community"]
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveIndex(i)
          break
        }
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const activeLink = linkRefs.current[activeIndex]
    if (activeLink) {
      const parent = activeLink.parentElement
      if (parent) {
        const parentRect = parent.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        setBgPosition({
          left: linkRect.left - parentRect.left,
          width: linkRect.width,
        })
      }
    }
  }, [activeIndex])

  const handleLinkClick = (index, href) => {
    setActiveIndex(index)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled ? "mt-3" : "mt-3"
      }`}
    >
      <div
        className="relative rounded-full px-3 md:px-6 py-2 md:py-3 overflow-hidden"
        style={{
          background: "rgba(74, 222, 128, 0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 222, 128, 0.3)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        {/* Glassmorphism shine effects */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
          }}
        />
        <div
          className="absolute top-0 left-0 w-[1px] h-full"
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent, rgba(255, 255, 255, 0.3))",
          }}
        />

        <div className="relative flex items-center justify-center gap-1">
          {activeIndex !== -1 && bgPosition.width > 0 && (
            <motion.div
              layoutId="active-bg"
              className="absolute bg-green-400/60 rounded-full z-0"
              initial={false}
              animate={{
                left: bgPosition.left,
                width: bgPosition.width,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              style={{
                top: "4px",
                bottom: "4px",
              }}
            />
          )}

          {navLinks.map((link, index) => (
            <a
              key={link.name}
              ref={(el) => {
                linkRefs.current[index] = el
              }}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick(index, link.href)
              }}
              className={`relative z-10 text-xs md:text-sm font-medium transition-colors whitespace-nowrap px-3 md:px-4 py-1 ${
                activeIndex === index ? "text-white" : "text-stone-800 hover:text-white"
              }`}
            >
              {link.name}
            </a>
          ))}

          <button className="relative z-10 text-xs md:text-sm font-medium px-3 md:px-4 py-1 ml-2 rounded-full bg-green-400/20 border-2 border-green-400 text-stone-800 hover:bg-green-400/40 transition-colors whitespace-nowrap">
            JOIN
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
