"use client"

// @ts-ignore
import { Button } from "@/components/ui/button"
import { getUserIdFromStorage, removeAuthCookies } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FiBell,  FiCloud,  FiDollarSign, FiHome, FiLogOut, FiMap, FiMapPin, FiMessageSquare, FiMoon, FiShoppingCart, FiSun, FiUser, FiUsers, FiX, FiTool, FiCreditCard } from "react-icons/fi"
import { TbMessageChatbot } from "react-icons/tb";
import { RiSeedlingLine } from "react-icons/ri"
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: FiHome,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: FiUser,
  },
  {
    title: "Network",
    href: "/network",
    icon: FiUsers,
  },
  {
    title: "Forum",
    href: "/forum",
    icon: HiOutlineChatBubbleLeftRight,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: FiMessageSquare,
  },
  {
    title: "Nearby Farmers",
    href: "/nearby",
    icon: FiMapPin,
  },
  {
    title: "Expense Tracker",
    href: "/expensetracker",
    icon: FiDollarSign,
  },
  {
    title: "My Lands",
    href: "/lands",
    icon: FiMap,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: FiShoppingCart,
  },
  {
    title: "Equipment Rental",
    href: "/renting",
    icon: FiTool,
  },
  {
    title: "Loan Manager",
    href: "/loan-manager",
    icon: FiCreditCard,
  },
  {
    title: "Crop Planning",
    href: "/crop-planning",
    icon: RiSeedlingLine,
  },
  {
    title: "Weather",
    href: "/weather",
    icon: FiCloud,
  },
    {
    title: "Chatbot",
    href: "/chatbot",
    icon: TbMessageChatbot,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: FiBell,
  },
]

export default function SideNavbar({ isOpen, onClose }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [userId, setUserId] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  // @ts-ignore
  const [hasLoadedNotifications, setHasLoadedNotifications] = useState(false)

  useEffect(() => {
    setUserId(getUserIdFromStorage())
    fetchUnreadCount()
  }, [])

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/notifications/unread-count", {
        credentials: "include",
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUnreadCount(result.count)
        }
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      removeAuthCookies()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleLinkClick = (href) => {
    // clicking on notifications, mark as loaded and reset count
    if (href === "/notifications") {
      setHasLoadedNotifications(true)
      setUnreadCount(0)
    }
    onClose()
  }

  // Get active item index for background positioning
  const getActiveItemIndex = () => {
    for (let i = 0; i < navigationItems.length; i++) {
      const item = navigationItems[i]
      const href = item.href === "/profile" ? `/profile/${userId}` : item.href
      if (pathname === href || (item.href === "/dashboard" && pathname.startsWith("/dashboard"))) {
        return i
      }
    }
    return -1
  }

  const activeIndex = getActiveItemIndex()

  // Calculate background position dynamically
  const getBackgroundPosition = (index) => {
    const itemHeight = 44 // py-3 (12px * 2) + icon height (20px)
    const itemSpacing = 4 // space-y-1 gap
    const totalItemHeight = itemHeight + itemSpacing
    return index * totalItemHeight + itemSpacing
  }

  const DesktopSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden">
        <nav className="space-y-1 px-2 relative">
          {/* Animated Background */}
          <AnimatePresence>
            {activeIndex !== -1 && (
              <motion.div
                layoutId="desktop-active-bg"
                className="absolute bg-primary rounded-full -translate-y-1 z-0"
                initial={false}
                animate={{
                  top: `${getBackgroundPosition(activeIndex)}px`,
                  height: "44px",
                  left: "8px",
                  right: isHovered ? "8px" : "8px",
                  width: isHovered ? "auto" : "60px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                }}
              />
            )}
          </AnimatePresence>

          {navigationItems.map((item, 
// @ts-ignore
          index) => {
            const href = item.href === "/profile" ? `/profile/${userId}` : item.href
            const isActive = pathname === href || (item.href === "/dashboard" && pathname.startsWith("/dashboard"))

            return (
              <Link
                key={item.href}
                href={href}
                onClick={() => handleLinkClick(item.href)}
                className={cn(
                  "flex items-center rounded-lg py-3 text-sm font-medium transition-colors duration-200 relative z-10",
                  "justify-start pl-[18px]",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-accent-foreground",
                )}
              >
                <div className="relative shrink-0">
                  <item.icon 
// @ts-ignore
                  className="h-5 w-5" />
                  {/* Notification dot */}
                  {item.href === "/notifications" && unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                <motion.span 
                  className="whitespace-nowrap overflow-hidden ml-3 block"
                  initial={false}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    width: isHovered ? "auto" : 0,
                    marginLeft: isHovered ? 12 : 0,
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1], 
                    opacity: { 
                      duration: 0.4, 
                      ease: "easeInOut",
                      delay: isHovered ? 0.1 : 0 
                    }
                  }}
                >
                  {item.title}
                </motion.span>

                {/* Tooltip for collapsed state */}
                <AnimatePresence>
                  {!isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.9 }}
                      animate={{ opacity: 0, x: -10, scale: 0.9 }}
                      whileHover={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md border z-50 whitespace-nowrap pointer-events-none"
                    >
                      {item.title}
                      {item.href === "/notifications" && unreadCount > 0 && (
                        <span className="ml-1 text-green-500">({unreadCount})</span>
                      )}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )

  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-lg font-semibold"
        >
          Navigation
        </motion.h2>
        <
// @ts-ignore
        Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-accent transition-colors duration-200"
        >
          <FiX 
// @ts-ignore
          className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <nav className="space-y-1 px-3 relative">
          {/* Animated Background for Mobile */}
          <AnimatePresence>
            {activeIndex !== -1 && (
              <motion.div
                layoutId="mobile-active-bg"
                className="absolute bg-primary rounded-full z-0"
                initial={false}
                animate={{
                  top: `${getBackgroundPosition(activeIndex) - 2}px`,
                  height: "44px",
                  left: "12px",
                  right: "12px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                }}
              />
            )}
          </AnimatePresence>

          {navigationItems.map((item, index) => {
            const href = item.href === "/profile" ? `/profile/${userId}` : item.href
            const isActive = pathname === href || (item.href === "/dashboard" && pathname.startsWith("/dashboard"))

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Link
                  href={href}
                  onClick={() => handleLinkClick(item.href)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 relative z-10",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                >
                  <div className="relative shrink-0">
                    <item.icon 
// @ts-ignore
                    className="h-5 w-5" />
                    {/* Notification dot */}
                    {item.href === "/notifications" && unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <span>{item.title}</span>
                  {item.href === "/notifications" && unreadCount > 0 && (
                    <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Mobile Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="border-t p-3"
      >
        <div className="space-y-2">
          <
// @ts-ignore
          Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full justify-start gap-3 transition-all duration-200 hover:bg-accent/50"
          >
            {theme === "dark" ? (
              // @ts-ignore
              <FiSun className="h-5 w-5 shrink-0" />
            ) : (
              // @ts-ignore
              <FiMoon className="h-5 w-5 shrink-0" />
            )}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </Button>

          <
// @ts-ignore
          Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/50 transition-all duration-200"
          >
            <FiLogOut 
// @ts-ignore
            className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </Button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar - Retractable Overlay */}
      <motion.aside
        className="hidden md:flex flex-col border-r bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 shadow-sm"
        initial={{ width: 80 }}
        animate={{ width: isHovered ? 240 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <DesktopSidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                opacity: { duration: 0.2 },
              }}
              className="fixed left-0 top-0 h-full w-80 max-w-[85vw] z-50 md:hidden shadow-xl"
            >
              <MobileSidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
