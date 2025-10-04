"use client"

import { GiHolosphere } from "react-icons/gi"
import { Prosto_One } from "next/font/google"

const prostoOne = Prosto_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prosto-one",
})

export function Footer() {
  const footerLinks = {
    column1: [
      { name: "About Us", href: "#about" },
      { name: "Features", href: "#features" },
      { name: "Contact", href: "#contact" },
    ],
    column2: [
      { name: "GitHub", href: "https://github.com/ahmrafi22/Agrosphere" },
      { name: "Documentation", href: "https://github.com/ahmrafi22/Agrosphere" },
      { name: "Comtributors", href: "https://github.com/ahmrafi22/Agrosphere/graphs/contributors" },
    ],
  }

  return (
    <footer className="sticky z-0 bottom-0 left-0 w-full bg-green-50 border-t border-green-200 py-16 md:py-20 lg:py-24 px-6 md:px-12 lg:px-20 min-h-[320px] md:min-h-[400px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 h-full">
        {/* Left Side - Logo and Brand */}
        <div className="flex items-center gap-4">
          <GiHolosphere className="text-green-400 text-7xl md:text-8xl lg:text-9xl" />
          <h2 className={`${prostoOne.className} text-4xl md:text-8xl lg:text-6xl font-bold text-green-500`}>
            Agrosphere
          </h2>
        </div>

        {/* Right Side - Links in Two Columns */}
        <div className="grid grid-cols-2 gap-x-16 gap-y-5 md:gap-x-20 lg:gap-x-24">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            {footerLinks.column1.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-green-700 hover:text-green-500 transition-colors duration-300 text-base md:text-lg lg:text-xl font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            {footerLinks.column2.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-green-700 hover:text-green-500 transition-colors duration-300 text-base md:text-lg lg:text-xl font-medium"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
