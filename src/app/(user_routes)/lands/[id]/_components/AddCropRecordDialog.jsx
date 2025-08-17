"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { FiX, FiCalendar, FiDollarSign, FiSave } from "react-icons/fi"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const allSeasons = ["Winter", "Spring", "Summer", "Monsoon"]
const yieldUnits = ["kg", "ton", "quintal", "maund"]

export function AddCropRecordDialog({ landId, onSuccess, existingRecords = [] }) {
  const [formData, setFormData] = useState({
    cropName: "",
    season: "",
    year: new Date().getFullYear(),
    plantingDate: "",
    harvestDate: "",
    totalYield: "",
    yieldUnit: "kg",
    totalExpenses: "",
    totalRevenue: "",
    notes: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get available seasons for the selected year (exclude existing ones)
  const availableSeasons = useMemo(() => {
    const usedSeasons = existingRecords
      .filter(record => record.year === formData.year)
      .map(record => record.season)
    
    return allSeasons.filter(season => !usedSeasons.includes(season))
  }, [existingRecords, formData.year])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.cropName || !formData.season || !formData.plantingDate) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/crop-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          landId,
          cropName: formData.cropName,
          season: formData.season,
          year: formData.year,
          plantingDate: formData.plantingDate,
          harvestDate: formData.harvestDate || null,
          totalYield: formData.totalYield ? parseFloat(formData.totalYield) : null,
          yieldUnit: formData.yieldUnit || null,
          totalExpenses: formData.totalExpenses ? parseFloat(formData.totalExpenses) : null,
          totalRevenue: formData.totalRevenue ? parseFloat(formData.totalRevenue) : null,
          notes: formData.notes || null
        })
      })

      const result = await response.json()
      
      if (result.success) {
        onSuccess()
        setFormData({
          cropName: "",
          season: "",
          year: new Date().getFullYear(),
          plantingDate: "",
          harvestDate: "",
          totalYield: "",
          yieldUnit: "kg",
          totalExpenses: "",
          totalRevenue: "",
          notes: ""
        })
      } else {
        alert(result.message || "Failed to add crop record")
      }
    } catch (error) {
      console.error("Error adding crop record:", error)
      alert("Failed to add crop record")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // If year changes, reset season if it's not available in the new year
      if (field === 'year' && prev.season) {
        const usedSeasons = existingRecords
          .filter(record => record.year === parseInt(value))
          .map(record => record.season)
        
        if (usedSeasons.includes(prev.season)) {
          newData.season = ""
        }
      }
      
      return newData
    })
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <FiSave className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          Add Crop Record
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Crop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cropName}
                onChange={(e) => handleChange("cropName", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., Rice, Wheat, Potato"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Season <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.season}
                onChange={(e) => handleChange("season", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Season</option>
                {availableSeasons.length > 0 ? (
                  availableSeasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))
                ) : (
                  <option value="" disabled>No seasons available for this year</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                min="2020"
                max="2030"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2 flex items-center gap-2">
            <FiCalendar className="h-5 w-5" />
            Important Dates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Planting Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.plantingDate}
                onChange={(e) => handleChange("plantingDate", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harvest Date <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="date"
                value={formData.harvestDate}
                onChange={(e) => handleChange("harvestDate", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Yield Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Yield Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Yield <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalYield}
                onChange={(e) => handleChange("totalYield", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit
              </label>
              <select
                value={formData.yieldUnit}
                onChange={(e) => handleChange("yieldUnit", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                {yieldUnits.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2 flex items-center gap-2">
            <FiDollarSign className="h-5 w-5" />
            Financial Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Expenses (৳) <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalExpenses}
                onChange={(e) => handleChange("totalExpenses", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., 50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Revenue (৳) <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalRevenue}
                onChange={(e) => handleChange("totalRevenue", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., 75000"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
            placeholder="Any additional notes about this crop season..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-1/3 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <FiSave className="h-5 w-5" />
                Add Record
              </>
            )}
          </button>
        </div>
      </form>
    </DialogContent>
  )
}
