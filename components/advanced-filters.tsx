"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar, X, RotateCcw } from "lucide-react"

interface FilterOptions {
  categories: string[]
  years: string[]
  months: string[]
  photoCountRange: [number, number]
  dateRange: {
    start: string
    end: string
  }
}

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  onFiltersChange: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

const categoryOptions = [
  { value: "graduation", label: "Graduation", color: "bg-blue-500" },
  { value: "sports", label: "Sports", color: "bg-green-500" },
  { value: "cultural", label: "Cultural", color: "bg-purple-500" },
  { value: "academic", label: "Academic", color: "bg-orange-500" },
  { value: "celebration", label: "Celebrations", color: "bg-pink-500" },
  { value: "orientation", label: "Orientation", color: "bg-teal-500" },
]

const yearOptions = ["2024", "2023", "2022", "2021", "2020"]

const monthOptions = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

export function AdvancedFilters({ isOpen, onClose, onFiltersChange, currentFilters }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)

    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleYearChange = (year: string, checked: boolean) => {
    const newYears = checked ? [...filters.years, year] : filters.years.filter((y) => y !== year)

    const newFilters = { ...filters, years: newYears }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleMonthChange = (month: string, checked: boolean) => {
    const newMonths = checked ? [...filters.months, month] : filters.months.filter((m) => m !== month)

    const newFilters = { ...filters, months: newMonths }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePhotoCountChange = (value: number[]) => {
    const newFilters = { ...filters, photoCountRange: [value[0], value[1]] as [number, number] }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      categories: [],
      years: [],
      months: [],
      photoCountRange: [0, 100],
      dateRange: { start: "", end: "" },
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const getActiveFilterCount = () => {
    return filters.categories.length + filters.years.length + filters.months.length
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl mt-8 mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Advanced Filters</CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()} active</Badge>}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Event Categories
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryOptions.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.value}
                    checked={filters.categories.includes(category.value)}
                    onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}
                  />
                  <Label htmlFor={category.value} className="text-sm font-medium cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                      {category.label}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Years */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Years
            </h3>
            <div className="flex flex-wrap gap-2">
              {yearOptions.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={filters.years.includes(year)}
                    onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
                  />
                  <Label htmlFor={`year-${year}`} className="text-sm font-medium cursor-pointer">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Months */}
          <div>
            <h3 className="font-semibold mb-3">Months</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {monthOptions.map((month) => (
                <div key={month.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`month-${month.value}`}
                    checked={filters.months.includes(month.value)}
                    onCheckedChange={(checked) => handleMonthChange(month.value, checked as boolean)}
                  />
                  <Label htmlFor={`month-${month.value}`} className="text-xs font-medium cursor-pointer">
                    {month.label.slice(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Count Range */}
          <div>
            <h3 className="font-semibold mb-3">Photo Count Range</h3>
            <div className="px-2">
              <Slider
                value={filters.photoCountRange}
                onValueChange={handlePhotoCountChange}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{filters.photoCountRange[0]} photos</span>
                <span>{filters.photoCountRange[1]} photos</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Reset All
            </Button>
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
