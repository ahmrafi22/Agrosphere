"use client"

import { useState } from "react"
import { FiLogOut } from "react-icons/fi"
import { FaShieldAlt } from "react-icons/fa"
import { IoMoon, IoSunny } from "react-icons/io5"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import AdminLoginDialog from "./_components/admin-login-dialog"
import StatsTab from "./_components/stats-tab"
import UsersTab from "./_components/users-tab"
import ReportsTab from "./_components/reports-tab"
import NotificationsTab from "./_components/notifications-tab"

const Button = ({ children, onClick, variant = "default", size = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10"
  }
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(true)
  const [admin, setAdmin] = useState(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLands: 0,
    totalExpenses: 0,
    totalMarketplaceListings: 0,
  })
  const [loading, setLoading] = useState(false)
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("stats")

  const tabs = [
    { id: "stats", label: "Statistics" },
    { id: "users", label: "Users" },
    { id: "reports", label: "Reports" },
    { id: "notifications", label: "Push Notifications" }
  ]

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (adminData) => {
    setAdmin(adminData)
    setIsAuthenticated(true)
    setShowLoginDialog(false)
    fetchStats()
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      setIsAuthenticated(false)
      setAdmin(null)
      setShowLoginDialog(true)
      setStats({ totalUsers: 0, totalLands: 0, totalExpenses: 0, totalMarketplaceListings: 0 })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaShieldAlt className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Please login to access the admin panel</p>
        </div>

        <AdminLoginDialog
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return <StatsTab stats={stats} loading={loading} />
      case "users":
        return <UsersTab />
      case "reports":
        return <ReportsTab />
      case "notifications":
        return <NotificationsTab />
      default:
        return <StatsTab stats={stats} loading={loading} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {theme === "dark" ? <IoSunny className="h-4 w-4" /> : <IoMoon className="h-4 w-4" />}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
              <FiLogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>


        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="relative w-[65%] bg-gray-200  dark:bg-gray-800 rounded-full p-1">
            <div className="grid w-full grid-cols-4 relative">
              <motion.div
                className="absolute  top-1 bottom-1 bg-blue-400/70 dark:bg-gray-700 rounded-full shadow-sm"
                initial={false}
                animate={{
                  x: `${tabs.findIndex(tab => tab.id === activeTab) * 99}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{ width: "calc(100% / 4)" }}
              />
              
              {/* Tab Buttons */}
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}