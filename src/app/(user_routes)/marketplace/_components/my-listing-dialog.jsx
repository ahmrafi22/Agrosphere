"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FiEdit, FiShoppingCart, FiTrash2 } from "react-icons/fi"

const cropEmojis = {
  "Rice": "🍚", "Wheat": "🌾", "Maize": "🌽", "Potato": "🥔", "Onion": "🧅",
  "Garlic": "🧄", "Chili": "🌶️", "Tomato": "🍅", "Vegetables": "🥬",
  "Fruits": "🍎", "Spices": "🌿", "Other": "🌱"
}
const getCropEmoji = (cropName) => cropEmojis[cropName] || cropEmojis.Other

export default function MyListingsDialog({ open, onOpenChange, myListings, onEdit, onDelete }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>My Marketplace Listings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {myListings.length === 0 ? (
            <div className="text-center py-8">
              <FiShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">You have not created any listings yet.</p>
            </div>
          ) : (
            myListings.map((listing) => (
              <div key={listing.id} className="border dark:border-gray-700 rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-2xl">{getCropEmoji(listing.crop_name)}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{listing.crop_name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' :
                      listing.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-green-600">৳{listing.price_per_unit}/{listing.unit}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {listing.quantity_available} {listing.unit}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(listing)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                    aria-label="Edit Listing"
                  >
                    <FiEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    aria-label="Delete Listing"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}