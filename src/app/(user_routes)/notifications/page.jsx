"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { FiBell, FiCheck, FiCheckCircle, FiAlertCircle } from "react-icons/fi"

// Notification type emojis
const notificationEmojis = {
  welcome: "🌱",
  forum: "💬",
  comment: "💭",
  connection_request: "🤝",
  rental_reminder: "⏰",
  farm_update: "🚜",
  weather_alert: "🌦️",
  market_update: "📈",
  system: "⚙️",
  default: "🔔",
}

const getNotificationEmoji = (type) => {
  return notificationEmojis[type] || notificationEmojis.default
}

const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  // @ts-ignore
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`

  // For older dates, show the actual date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [markingAsRead, setMarkingAsRead] = useState(new Set())

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Auto mark all as read when page loads
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter((n) => !n.is_read)
      if (unreadNotifications.length > 0) {
        markAllAsRead()
      }
    }
  }, [notifications])

  const fetchNotifications = async () => {
    try {
      setError(null)
      const response = await fetch("/api/notifications", {
        credentials: "include",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setNotifications(result.notifications || [])
      } else {
        setError(result.message || "Failed to fetch notifications")
        console.error("Failed to fetch notifications:", result)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Network error occurred while fetching notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    if (markingAsRead.has(notificationId)) return

    setMarkingAsRead((prev) => new Set([...prev, notificationId]))

    try {
      const response = await fetch("/api/notifications/mark-read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
        credentials: "include",
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId ? { ...notification, is_read: true } : notification,
          ),
        )
      } else {
        console.error("Failed to mark notification as read")
      }
    } catch (error) {
      console.error("Error marking as read:", error)
    } finally {
      setMarkingAsRead((prev) => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
        credentials: "include",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))
      } else {
        console.error("Failed to mark all notifications as read")
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <FiAlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Notifications</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with your farm activities and community interactions
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiCheckCircle className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <FiBell className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You'll see notifications here when there's activity on your account
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                  notification.is_read
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                }`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Emoji */}
                  <div className="text-2xl flex-shrink-0">{getNotificationEmoji(notification.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-medium mb-1">{notification.message}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{formatTimeAgo(notification.created_at)}</span>
                      <span>•</span>
                      <span className="capitalize">{notification.type.replace("_", " ")}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {!notification.is_read ? (
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    ) : (
                      <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>

                  {/* Loading indicator */}
                  {markingAsRead.has(notification.id) && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
