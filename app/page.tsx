"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AlbumGrid } from "@/components/album-grid"
import { AdvancedFilters } from "@/components/advanced-filters"
import { SearchResults } from "@/components/search-results"
import { Footer } from "@/components/footer"
import { getAlbums, type Album } from "@/lib/database"

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

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    years: [],
    months: [],
    photoCountRange: [0, 100],
    dateRange: { start: "", end: "" },
  })
  const [albums, setAlbums] = useState<Album[]>([])

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const data = await getAlbums()
        setAlbums(data)
      } catch (error) {
        console.error("Error fetching albums for search:", error)
      }
    }
    fetchAlbums()
  }, [])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return albums
      .filter((album) => {
        const matchesSearch =
          album.title.toLowerCase().includes(query) ||
          album.description?.toLowerCase().includes(query) ||
          album.category.toLowerCase().includes(query) ||
          album.location?.toLowerCase().includes(query) ||
          album.photographer?.toLowerCase().includes(query)

        const albumYear = album.event_date ? new Date(album.event_date).getFullYear().toString() : ""
        const albumMonth = album.event_date
          ? (new Date(album.event_date).getMonth() + 1).toString().padStart(2, "0")
          : ""

        const matchesFilters =
          (filters.categories.length === 0 || filters.categories.includes(album.category)) &&
          (filters.years.length === 0 || filters.years.includes(albumYear)) &&
          (filters.months.length === 0 || filters.months.includes(albumMonth)) &&
          album.photo_count >= filters.photoCountRange[0] &&
          album.photo_count <= filters.photoCountRange[1]

        return matchesSearch && matchesFilters
      })
      .map((album) => ({
        id: album.id,
        title: album.title,
        description: album.description || "",
        coverImage: album.cover_image_url || "/school-album.jpg",
        photoCount: album.photo_count,
        date: album.event_date || "",
        category: album.category.toLowerCase(),
        type: "album" as const,
        searchableText:
          `${album.title} ${album.description} ${album.category} ${album.location} ${album.photographer}`.toLowerCase(),
        matchedText: undefined,
      }))
  }, [searchQuery, filters, albums])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const showSearchResults = searchQuery.trim().length > 0

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} onFilterToggle={() => setShowFilters(true)} />
      <main>
        {!showSearchResults && <HeroSection />}
        {showSearchResults ? <SearchResults query={searchQuery} results={searchResults} /> : <AlbumGrid />}
      </main>
      <Footer />

      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        currentFilters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  )
}
