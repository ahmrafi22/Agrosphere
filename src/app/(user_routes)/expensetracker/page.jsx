"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { FiPlus, FiTrendingUp, FiTrendingDown, FiTrash2, FiDollarSign } from "react-icons/fi"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { AddTransactionDialog } from "./_components/AddTransactionDialog"

// Improved Animated number component with fixed duration
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 800 
    const steps = 50
    const startValue = displayValue
    const difference = value - startValue
    let current = 0

    if (value === displayValue) return

    const timer = setInterval(() => {
      current += 1
      const progress = current / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4) 
      const newValue = startValue + (difference * easeOutQuart)
      
      if (current >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(newValue)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const formatNumber = (num) => {
    const isNegative = num < 0
    const absoluteNum = Math.abs(num)
    const formatted = absoluteNum.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })
    return (isNegative ? "-৳" : "৳") + formatted
  }

  return <span>{formatNumber(displayValue)}</span>
}

export default function ExpenseTrackerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showCurrentMonth, setShowCurrentMonth] = useState(true)
  const [showMonthlyChart, setShowMonthlyChart] = useState(true)
  const [isYearlyLoading, setIsYearlyLoading] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/expenses", { credentials: "include" })
      if (response.ok) {
        const result = await response.json()
        if (result.success) setDashboardData(result.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionAdded = () => {
    setIsDialogOpen(false)
    fetchDashboardData()
  }

  const handleDelete = async (id) => {

    const previousData = dashboardData;
    setDashboardData(prev => ({
        ...prev,
        recentTransactions: prev.recentTransactions.filter(t => t.id !== id)
    }));
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: "DELETE", credentials: "include" })
      if (!response.ok) {

          setDashboardData(previousData);
      }
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting transaction:", error)
      setDashboardData(previousData); 
    }
  }

  const handleYearChange = async (year) => {
    setSelectedYear(year)
    setIsYearlyLoading(true)
    try {
      const response = await fetch(`/api/expenses/yearly/${year}`, { credentials: "include" })
      if (response.ok) {
        const result = await response.json()
        if (result.success) setDashboardData((prev) => ({ ...prev, yearlyData: result.data }))
      }
    } catch (error) {
      console.error("Error fetching yearly data:", error)
    } finally {
      setIsYearlyLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-[85vw] mx-auto pt-8 space-y-8">
          <div className="flex items-center justify-between">
              <div>
                  <Skeleton className="h-9 w-64 mb-3" />
                  <Skeleton className="h-5 w-96" />
              </div>
              <Skeleton className="h-11 w-28" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                  <Skeleton className="h-56 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-72 w-full" />
              </div>
              <div className="lg:col-span-2 space-y-8">
                  <Skeleton className="h-[500px] w-full" />
                  <Skeleton className="h-[600px] w-full" />
              </div>
          </div>
        </div>
      </div>
    );
  }

  const currentData = showCurrentMonth ? dashboardData?.currentMonth : dashboardData?.last7Days
  const chartData = showMonthlyChart ? dashboardData?.last6Months : dashboardData?.last6Years

  return (
    <div className="min-h-screen ">
      <div className="max-w-[85vw] mx-auto pt-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Track your farm finances effectively</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium">
                <FiPlus className="h-5 w-5" />
                Add Transaction
              </button>
            </DialogTrigger>
            <AddTransactionDialog onSuccess={handleTransactionAdded} />
          </Dialog>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Current Month/Last 7 Days */}
            <div className="bg-green-100/60 dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {showCurrentMonth ? "Current Month" : "Last 7 Days"}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${!showCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>7D</span>
                  <button 
                    onClick={() => setShowCurrentMonth(!showCurrentMonth)} 
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${showCurrentMonth ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg" : "bg-gray-200 dark:bg-gray-600"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-md ${showCurrentMonth ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className={`text-sm font-medium ${showCurrentMonth ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>Month</span>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                      <FiTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Earnings</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    <AnimatedNumber value={currentData?.earning || 0} />
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-lg">
                      <FiTrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Expenses</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    <AnimatedNumber value={currentData?.expense || 0} />
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Net Balance</span>
                    <span className={`text-2xl font-bold ${(currentData?.earning || 0) - (currentData?.expense || 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      <AnimatedNumber value={(currentData?.earning || 0) - (currentData?.expense || 0)} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yearly Data */}
            <div className="bg-emerald-100/70 dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Yearly Overview</h3>
                <select 
                  value={selectedYear} 
                  onChange={(e) => handleYearChange(Number.parseInt(e.target.value))} 
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {dashboardData?.availableYears?.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div className="space-y-5">
                {isYearlyLoading ? (
                  <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Total Earnings</span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        <AnimatedNumber value={dashboardData?.yearlyData?.earning || 0} />
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Total Expenses</span>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        <AnimatedNumber value={dashboardData?.yearlyData?.expense || 0} />
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Net Income</span>
                        <span className={`text-xl font-bold ${(dashboardData?.yearlyData?.earning || 0) - (dashboardData?.yearlyData?.expense || 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          <AnimatedNumber value={(dashboardData?.yearlyData?.earning || 0) - (dashboardData?.yearlyData?.expense || 0)} />
                        </span>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg py-2 font-medium">
                      Year: {selectedYear}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="bg-green-100/70 dark:bg-gray-800 rounded-2xl p-7 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Insights</h3>
              { dashboardData?.monthlyComparison ? (
                  <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <div className={`p-3 rounded-full ${dashboardData?.monthlyComparison?.isPositive ? "bg-green-100 dark:bg-green-800/50" : "bg-red-100 dark:bg-red-800/50"}`}>
                      {dashboardData?.monthlyComparison?.isPositive ? <FiTrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" /> : <FiTrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />}
                      </div>
                      <div>
                      <span className={`text-2xl font-bold ${dashboardData?.monthlyComparison?.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          {dashboardData?.monthlyComparison?.percentageChange > 0 ? "+" : ""}{dashboardData?.monthlyComparison?.percentageChange || 0}%
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">vs last month</p>
                      </div>
                  </div>
                  <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">This month net:</span>
                      <span className={`font-bold text-lg ${(dashboardData?.monthlyComparison?.currentMonthNet || 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          ৳{(dashboardData?.monthlyComparison?.currentMonthNet || 0).toLocaleString()}
                      </span>
                      </div>
                      <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Last month net:</span>
                      <span className={`font-bold text-lg ${(dashboardData?.monthlyComparison?.previousMonthNet || 0) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                          ৳{(dashboardData?.monthlyComparison?.previousMonthNet || 0).toLocaleString()}
                      </span>
                      </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {dashboardData?.monthlyComparison?.suggestion}
                    </p>
                  </div>
                  </div>
              ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Not enough data for monthly insights.</p>
                  </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <div className="bg-green-100/80 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showMonthlyChart ? "Last 6 Months" : "Last 6 Years"}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${!showMonthlyChart ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>Years</span>
                  <button 
                    onClick={() => setShowMonthlyChart(!showMonthlyChart)} 
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${showMonthlyChart ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg" : "bg-gray-200 dark:bg-gray-600"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-md ${showMonthlyChart ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className={`text-sm font-medium ${showMonthlyChart ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>Months</span>
                </div>
              </div>
              <div className="h-[420px] bg-white dark:bg-gray-900/30 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.3)" />
                    <XAxis 
                      dataKey={showMonthlyChart ? "month" : "year"} 
                      tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }} 
                      axisLine={{ stroke: "#d1d5db" }} 
                      tickLine={false} 
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `৳${(value/1000).toFixed(0)}k`} 
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: " rgba(255, 255, 255, 0.95)", 
                        backdropFilter: "blur(8px)", 
                        border: "1px solid , #e5e7eb", 
                        borderRadius: "12px", 
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        fontWeight: 500,
                        color: "#374151"
                      }}
                      formatter={(value, name) => [`৳${value.toLocaleString()}`, name === "earning" ? "Earnings" : "Expenses"]}
                      labelFormatter={(label) => `${showMonthlyChart ? "Month" : "Year"}: ${label}`}
                      cursor={{ fill: "rgba(209, 213, 219, 0.2)" }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: "20px", fontWeight: 500, color: " #374151" }} 
                      iconType="circle" 
                    />
                    <Bar 
                      dataKey="earning" 
                      fill="url(#greenGradient)" 
                      name="Earnings" 
                      radius={[6, 6, 0, 0]} 
                      maxBarSize={chartData?.length <= 3 ? 40 : 80} 
                    />
                    <Bar 
                      dataKey="expense" 
                      fill="url(#redGradient)" 
                      name="Expenses" 
                      radius={[6, 6, 0, 0]} 
                      maxBarSize={chartData?.length <= 3 ? 40 : 80} 
                    />
                    <defs>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-green-100/70 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
                  Last {dashboardData?.recentTransactions?.length || 0}
                </span>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {dashboardData?.recentTransactions?.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <FiDollarSign className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg font-medium">No transactions yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Add your first expense or earning to get started</p>
                  </div>
                ) : (
                  dashboardData?.recentTransactions?.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group border border-gray-100 dark:border-gray-600/30 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${transaction.type === "earning" ? "bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800" : "bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-800"}`}>
                          {transaction.type === "earning" ? 
                            <FiTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" /> : 
                            <FiTrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                        }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className={`font-bold text-lg ${transaction.type === "earning" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                              {transaction.type === "earning" ? "+৳" : "-৳"}{transaction.amount.toLocaleString()}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">{transaction.category}</p>
                          {transaction.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{transaction.description}</p>}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(transaction.id)} 
                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 hover:scale-110" 
                        title="Delete transaction"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}