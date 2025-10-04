import { Inter, Poppins, Prosto_One } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"],
    variable: "--font-inter",
 })

const prostoOne = Prosto_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prosto-one",
})

const poppins = Poppins({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "Agrosphere ",
  description: "Comprehensive agriculture management platform for modern farming",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
            <body
        className={`font-sans  ${inter.variable} ${prostoOne.variable} ${poppins.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
