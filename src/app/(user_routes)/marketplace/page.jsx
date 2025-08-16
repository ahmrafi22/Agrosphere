"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { FiAlertTriangle, FiChevronDown, FiClock, FiMail, FiMapPin, FiPhone, FiPlus, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi"
import CreateListingDialog from "./_components/create-listing-dialog"
import MyListingsDialog from "./_components/my-listing-dialog"
import Image from "next/image"
import Link from "next/link"

const cropEmojis = {
  "Rice": "🍚", "Wheat": "🌾", "Maize": "🌽", "Potato": "🥔", "Onion": "🧅",
  "Garlic": "🧄", "Chili": "🌶️", "Tomato": "🍅", "Vegetables": "🥬",
  "Fruits": "🍎", "Spices": "🌿", "Other": "🌱"
}
const getCropEmoji = (cropName) => cropEmojis[cropName] || cropEmojis.Other

export default function MarketplacePage() {
  const [listings, setListings] = useState([])
  const [myListings, setMyListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // State for the combined search bar
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [searchType, setSearchType] = useState("crop_name") 

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isMyListingsDialogOpen, setIsMyListingsDialogOpen] = useState(false)
  const [editingListing, setEditingListing] = useState(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setError(null)
      const params = new URLSearchParams()
      // The fetch logic remains the same, it correctly handles empty strings
      if (searchTerm) params.append("crop_name", searchTerm)
      if (locationFilter) params.append("location", locationFilter)
      
      const response = await fetch(`/api/marketplace?${params}`, { credentials: "include" })
      const result = await response.json()

      if (response.ok && result.success) setListings(result.listings || [])
      else setError(result.message || "Failed to fetch marketplace listings")
    } catch (error) {
      console.error("Error fetching listings:", error)
      setError("Network error occurred while fetching listings")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMyListings = async () => {
    try {
      const response = await fetch("/api/marketplace/my-listings", { credentials: "include" })
      const result = await response.json()
      if (response.ok && result.success) setMyListings(result.listings || [])
      else console.error("Failed to fetch my listings:", result.message)
    } catch (error) {
      console.error("Error fetching my listings:", error)
    }
  }

  const handleSearch = () => {
    setIsLoading(true)
    fetchListings()
  }
  
  const handleSearchTypeChange = (newType) => {
    setSearchType(newType)
    setSearchTerm("")
    setLocationFilter("")
  }

  const handleSearchInputChange = (value) => {
    if (searchType === "crop_name") {
      setSearchTerm(value)
    } else {
      setLocationFilter(value)
    }
  }

  const handleSaveListing = async (formData) => {
    try {
      const url = editingListing ? `/api/marketplace/${editingListing.id}` : "/api/marketplace"
      const method = editingListing ? "PUT" : "POST"

      const response = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), credentials: "include"
      })
      const result = await response.json()

      if (response.ok && result.success) {
        setIsCreateDialogOpen(false)
        setEditingListing(null)
        await fetchListings()
        await fetchMyListings()
      } else {
        alert(`Error: ${result.message || "Could not save listing."}`)
      }
    } catch (error) {
      alert("An error occurred while saving the listing.")
    }
  }

  const handleEdit = (listing) => {
    setEditingListing(listing)
    setIsMyListingsDialogOpen(false)
    setIsCreateDialogOpen(true)
  }

  const handleDelete = async (listingId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    try {
      const response = await fetch(`/api/marketplace/${listingId}`, { method: "DELETE", credentials: "include" })
      const result = await response.json()
      if (response.ok && result.success) {
        await fetchListings()
        await fetchMyListings()
      } else {
        alert(`Error: ${result.message || "Could not delete listing."}`)
      }
    } catch (error) {
      alert("An error occurred while deleting the listing.")
    }
  }
  
  const handleOpenMyListings = (open) => {
    if (open) fetchMyListings()
    setIsMyListingsDialogOpen(open)
  }
  
  const handleOpenCreateDialog = (open) => {
    if (!open) setEditingListing(null)
    setIsCreateDialogOpen(open)
  }

  const formatTimeAgo = (dateString) => {
    // @ts-ignore
    const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000)
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-9 w-48" />
          <div className="flex gap-3"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
              </div>
              <Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between items-center"><Skeleton className="h-6 w-20" /><Skeleton className="h-4 w-16" /></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Marketplace</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleOpenMyListings(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm">
              <FiShoppingCart className="h-4 w-4" /> My Listings
            </button>
            <button onClick={() => handleOpenCreateDialog(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium shadow-sm">
              <FiPlus className="h-4 w-4" /> Create Listing
            </button>
          </div>
        </header>

        <MyListingsDialog open={isMyListingsDialogOpen} onOpenChange={handleOpenMyListings} myListings={myListings} onEdit={handleEdit} onDelete={handleDelete} />
        <CreateListingDialog open={isCreateDialogOpen} onOpenChange={handleOpenCreateDialog} editingListing={editingListing} onSave={handleSaveListing} cropEmojis={cropEmojis} />

        {/* SEARCH BAR */}
        <div className="flex justify-center my-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-[65%]">
            <div className="flex w-full items-center border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden bg-white dark:bg-gray-800 shadow-sm focus-within:ring-2 focus-within:ring-green-500 transition-all">
              <div className="relative">
                <select
                  value={searchType}
                  onChange={(e) => handleSearchTypeChange(e.target.value)}
                  className="h-full pl-4 pr-8 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-r border-gray-300 dark:border-gray-600 text-sm font-medium appearance-none focus:outline-none cursor-pointer"
                >
                  <option  value="crop_name">Crop</option>
                  <option value="location">Location</option>
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {searchType === 'crop_name' ? <FiSearch className="h-4 w-4" /> : <FiMapPin className="h-4 w-4" />}
                </span>
                <input
                  type="text"
                  placeholder={searchType === 'crop_name' ? "e.g., Rice, Potato..." : "e.g., Dhaka, Chittagong..."}
                  value={searchType === 'crop_name' ? searchTerm : locationFilter}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 bg-transparent focus:outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <button onClick={handleSearch} className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex-shrink-0 font-medium shadow-sm">
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <FiAlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">{getCropEmoji(listing.crop_name)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{listing.crop_name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {listing.seller_profile_pic ? (
                        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={listing.seller_profile_pic}
                            alt={listing.seller_name}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <FiUser className="h-4 w-4 flex-shrink-0" />
                      )}
                      <Link
                        href={`/profile/${listing.user_id}`}
                        className="truncate text-green-700 dark:text-green-400 hover:underline"
                      >
                        {listing.seller_name}
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow space-y-4">
                  {listing.description && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>}
                  
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">৳{listing.price_per_unit}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{listing.unit}</span></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available: {listing.quantity_available} {listing.unit}</p>
                  </div>

                  {listing.location && <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><FiMapPin className="h-4 w-4 flex-shrink-0" /><span>{listing.location}</span></div>}
                  
                  <div className="space-y-2">
                    {listing.contact_phone && <div className="flex items-center gap-2 text-sm"><FiPhone className="h-4 w-4 text-gray-400" /><a href={`tel:${listing.contact_phone}`} className="text-green-600 hover:underline">{listing.contact_phone}</a></div>}
                    {listing.contact_email && <div className="flex items-center gap-2 text-sm"><FiMail className="h-4 w-4 text-gray-400" /><a href={`mailto:${listing.contact_email}`} className="text-blue-600 hover:underline truncate">{listing.contact_email}</a></div>}
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1.5"><FiClock className="h-3 w-3" /><span>{formatTimeAgo(listing.created_at)}</span></div>
                  {listing.seller_area && <span>{listing.seller_area}</span>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isLoading && listings.length === 0 && !error && (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <FiShoppingCart className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No listings found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">{searchTerm || locationFilter ? "Try adjusting your search or filter to find what you're looking for." : "There are currently no listings. Why not be the first to sell your crops?"}</p>
            <button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center justify-center gap-2 mx-auto px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium shadow-sm">
              <FiPlus /> Create First Listing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}