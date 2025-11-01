"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSeedling } from "react-icons/fa";
import {
  FiArrowRight,
  FiCloud,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingDown,
  FiTrendingUp,
  FiThermometer,
  FiMapPin,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";

const bentoBoxes = [
  {
    id: "expenses",
    title: "Financial Overview",
    description: "Track your earnings, expenses and net profit",
    icon: FiDollarSign,
    gradient: "from-blue-400 via-sky-500 to-sky-600 ",
    route: "/expensetracker",
  },
  {
    id: "weather",
    title: "Weather",
    description: "Current weather and forecasts",
    icon: FiCloud,
    gradient: "from-amber-400 via-orange-500 to-orange-600",
    route: "/weather",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Buy and sell agricultural products",
    icon: FiShoppingCart,
    gradient: "from-violet-400 via-purple-500 to-purple-600",
    route: "/marketplace",
  },
  {
    id: "current-season",
    title: "Crop Planning",
    description: "Plan seasonal crops and view harvests",
    icon: FaSeedling,
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    route: "/crop-planning",
  },
];

export default function DashboardPage() {
  const [expenseData, setExpenseData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [marketplaceData, setMarketplaceData] = useState(null);
  const [cropPlanData, setCropPlanData] = useState(null);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingMarketplace, setIsLoadingMarketplace] = useState(true);
  const [isLoadingCropPlan, setIsLoadingCropPlan] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchExpenseData();
    fetchWeatherData();
    fetchMarketplaceData();
    fetchCropPlanData();
  }, []);

  const fetchExpenseData = async () => {
    try {
      const response = await fetch("/api/expenses", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setExpenseData(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const fetchWeatherData = async () => {
    try {
      // Default to Dhaka, Bangladesh for demo
      const response = await fetch(
        "/api/weather?city=Dhaka&country=Bangladesh",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setWeatherData(result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const fetchMarketplaceData = async () => {
    try {
      const response = await fetch("/api/marketplace/my-listings", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMarketplaceData(result);
        }
      }
    } catch (error) {
      console.error("Error fetching marketplace data:", error);
    } finally {
      setIsLoadingMarketplace(false);
    }
  };

  const fetchCropPlanData = async () => {
    try {
      const response = await fetch("/api/crop-plans", {
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCropPlanData(result);
        }
      }
    } catch (error) {
      console.error("Error fetching crop plan data:", error);
    } finally {
      setIsLoadingCropPlan(false);
    }
  };

  const handleBoxClick = (box) => {
    if (box.route) {
      router.push(box.route);
    }
  };

  const renderExpenseContent = () => {
    if (isLoadingExpenses) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-white/30 border-t-white"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 border-3 border-white/10"></div>
          </div>
        </div>
      );
    }

    const earnings = expenseData?.currentMonth?.earning || 0;
    const expenses = expenseData?.currentMonth?.expense || 0;
    const net = earnings - expenses;
    const isPositiveNet = net >= 0;

    return (
      <div className="space-y-4">
        {/* Financial Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Earnings */}
          <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/15 dark:border-white/8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 dark:bg-green-300 rounded-full flex-shrink-0"></div>
              <p className="text-xs text-black dark:text-white/70 uppercase tracking-wide font-medium">
                Earnings
              </p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-black dark:text-green-200 break-words">
              ৳ {earnings.toLocaleString()}
            </p>
          </div>

          {/* Expenses */}
          <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/15 dark:border-white/8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-400 dark:bg-red-300 rounded-full flex-shrink-0"></div>
              <p className="text-xs text-black dark:text-white/70 uppercase tracking-wide font-medium">
                Expenses
              </p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-black dark:text-red-200 break-words">
              ৳ {expenses.toLocaleString()}
            </p>
          </div>

          {/* Net Profit/Loss */}
          <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/15 dark:border-white/8">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  isPositiveNet
                    ? "bg-emerald-400 dark:bg-emerald-300"
                    : "bg-orange-400 dark:bg-orange-300"
                }`}
              ></div>
              <p className="text-xs text-black dark:text-white/70 uppercase tracking-wide font-medium">
                Net
              </p>
            </div>
            <p
              className={`text-lg sm:text-xl font-bold break-words ${
                isPositiveNet
                  ? "text-black dark:text-emerald-200"
                  : "text-orange-300 dark:text-orange-200"
              }`}
            >
              {isPositiveNet ? "+" : ""}৳ {net.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Monthly Comparison */}
        {expenseData?.monthlyComparison && (
          <div className="bg-white/5 dark:bg-white/3 backdrop-blur-sm rounded-xl p-3 border border-white/8 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  expenseData.monthlyComparison.isPositive
                    ? "bg-green-500/15 dark:bg-green-500/10"
                    : "bg-red-500/15 dark:bg-red-500/10"
                }`}
              >
                {expenseData.monthlyComparison.isPositive ? (
                  <FiTrendingUp className="h-4 w-4 text-green-400 dark:text-green-300" />
                ) : (
                  <FiTrendingDown className="h-4 w-4 text-red-400 dark:text-red-300" />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    expenseData.monthlyComparison.isPositive
                      ? "text-black dark:text-green-200"
                      : "text-black dark:text-red-200"
                  }`}
                >
                  {expenseData.monthlyComparison.percentageChange > 0
                    ? "+"
                    : ""}
                  {Math.abs(expenseData.monthlyComparison.percentageChange)}%
                </p>
                <p className="text-xs text-gray-800 dark:text-white/60 truncate">
                  vs last month
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWeatherContent = () => {
    if (isLoadingWeather) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-white/30 border-t-white"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 border-3 border-white/10"></div>
          </div>
        </div>
      );
    }

    if (!weatherData?.current) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-full p-4 mb-3 border border-white/15 dark:border-white/8">
            <FiCloud className="w-6 h-6 text-white/60 dark:text-white/50" />
          </div>
          <p className="text-white/95 dark:text-white/90 font-medium mb-1">
            Weather Unavailable
          </p>
          <p className="text-xs text-white/70 dark:text-white/60 text-center max-w-32">
            Unable to load weather data
          </p>
        </div>
      );
    }

    const { temperature, condition, location } = weatherData.current;

    return (
      <div className="space-y-4">
        {/* Temperature Display */}
        <div className="flex items-center justify-center py-2">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
              <FiThermometer className="h-6 w-6 sm:h-8 sm:w-8 text-white/80 dark:text-white/70 flex-shrink-0" />
              <span className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                {temperature}°C
              </span>
            </div>
            <p className="text-xs sm:text-sm text-black dark:text-white/80 font-medium capitalize">
              {condition}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white/5 dark:bg-white/3 backdrop-blur-sm rounded-xl p-3 border border-white/8 dark:border-white/5">
          <div className="flex items-center gap-2">
            <FiMapPin className="h-3 w-3 sm:h-4 sm:w-4 text-white/70 dark:text-white/60 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-black dark:text-white/80 truncate">{location}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderMarketplaceContent = () => {
    if (isLoadingMarketplace) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-white/30 border-t-white"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 border-3 border-white/10"></div>
          </div>
        </div>
      );
    }

    const latestListing = marketplaceData?.listings?.[0];

    if (!latestListing) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-full p-4 mb-3 border border-white/15 dark:border-white/8">
            <FiPackage className="w-6 h-6 text-white/60 dark:text-white/50" />
          </div>
          <p className="text-white/95 dark:text-white/90 font-medium mb-1">
            No Posts Yet
          </p>
          <p className="text-xs text-white/70 dark:text-white/60 text-center max-w-32">
            Create your first listing
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Latest Post Card */}
        <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/15 dark:border-white/8">
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-1 line-clamp-1">
              {latestListing.crop_name}
            </h3>
            <p className="text-xs sm:text-sm text-black dark:text-white/70 capitalize">
              Latest Listing
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
            <div>
              <p className="text-xs text-black dark:text-white/60 uppercase tracking-wide font-medium mb-1">
                Price
              </p>
              <p className="text-sm font-semibold text-black dark:text-green-200 wrap-break-words">
                ৳ {latestListing.price_per_unit?.toLocaleString() || "N/A"}/
                {latestListing.unit || "unit"}
              </p>
            </div>
            <div>
              <p className="text-xs text-black dark:text-white/60 uppercase tracking-wide font-medium mb-1">
                Available
              </p>
              <p className="text-sm font-semibold text-black dark:text-white wrap-break-words">
                {latestListing.quantity_available || 0}{" "}
                {latestListing.unit || "units"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-black dark:text-white/80">
            <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">
              Posted: {new Date(latestListing.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCropPlanContent = () => {
    if (isLoadingCropPlan) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-white/30 border-t-white"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 border-3 border-white/10"></div>
          </div>
        </div>
      );
    }

    const latestCropPlan = cropPlanData?.cropPlans?.[0];

    if (!latestCropPlan) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-full p-4 mb-3 border border-white/15 dark:border-white/8">
            <FaSeedling className="w-6 h-6 text-white/60 dark:text-white/50" />
          </div>
          <p className="text-white/95 dark:text-white/90 font-medium mb-1">
            No Plans Yet
          </p>
          <p className="text-xs text-white/70 dark:text-white/60 text-center max-w-32">
            Create your first crop plan
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Latest Crop Plan Card */}
        <div className="bg-white/8 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/15 dark:border-white/8">
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-1 line-clamp-1">
              {latestCropPlan.crop_name}
            </h3>
            <p className="text-xs sm:text-sm text-black dark:text-white/70 capitalize">
              {latestCropPlan.season} Season
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
            <div>
              <p className="text-xs text-black dark:text-white/60 uppercase tracking-wide font-medium mb-1">
                Area
              </p>
              <p className="text-sm font-semibold text-black dark:text-white break-words">
                {latestCropPlan.land_area || "N/A"} acres
              </p>
            </div>
            <div>
              <p className="text-xs text-black dark:text-white/60 uppercase tracking-wide font-medium mb-1">
                Expected Yield
              </p>
              <p className="text-sm font-semibold text-black dark:text-white break-words">
                {latestCropPlan.estimated_yield || "N/A"}{" "}
                {latestCropPlan.yield_unit || "kg"}
              </p>
            </div>
          </div>

          {latestCropPlan.planting_date && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-black dark:text-white/80">
              <FiCalendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                Planted: {new Date(latestCropPlan.planting_date).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>

        {/* Modern Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {bentoBoxes.map((box, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                box.route
                  ? "hover:scale-[1.02] hover:-translate-y-1"
                  : "hover:scale-[1.01]"
              }`}
              onClick={() => handleBoxClick(box)}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${box.gradient} opacity-60 dark:opacity-40`}
              />

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 dark:bg-white/3 rounded-full -translate-y-16 translate-x-16 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 dark:bg-white/2 rounded-full translate-y-12 -translate-x-12 blur-xl"></div>

              <CardHeader className="relative z-10 pb-3 sm:pb-4">
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="p-2 sm:p-3 rounded-xl bg-white/15 dark:bg-white/10 backdrop-blur-sm text-gray-900 dark:text-white border border-white/20 dark:border-white/10 group-hover:bg-white/25 dark:group-hover:bg-white/15 transition-colors duration-300 flex-shrink-0">
                      <box.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-black dark:text-white mb-1 truncate">
                        {box.title}
                      </CardTitle>
                      <CardDescription className="text-black dark:text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {box.description}
                      </CardDescription>
                    </div>
                  </div>
                  {box.route && (
                    <div className="p-1.5 sm:p-2 rounded-lg bg-white/8 dark:bg-white/5 backdrop-blur-sm border border-white/15 dark:border-white/8 group-hover:bg-white/15 dark:group-hover:bg-white/10 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0">
                      <FiArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-shadow-gray-900 dark:text-white/80" />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-0">
                {box.id === "expenses" && renderExpenseContent()}
                {box.id === "weather" && renderWeatherContent()}
                {box.id === "marketplace" && renderMarketplaceContent()}
                {box.id === "current-season" && renderCropPlanContent()}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
