"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Camera } from "lucide-react"
import { getAlbums, getPhotos } from "@/lib/database"

export function HeroSection() {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalAlbums: 0,
    yearsSpan: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [albums, photos] = await Promise.all([getAlbums(), getPhotos()])

        // Calculate years span
        const dates = albums
          .map((album) => album.event_date || album.created_at)
          .filter(Boolean)
          .map((date) => new Date(date).getFullYear())

        const minYear = Math.min(...dates)
        const maxYear = Math.max(...dates)
        const yearsSpan = dates.length > 0 ? maxYear - minYear + 1 : 0

        setStats({
          totalPhotos: photos.length,
          totalAlbums: albums.length,
          yearsSpan,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats({
          totalPhotos: 0,
          totalAlbums: 0,
          yearsSpan: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const scrollToAlbums = () => {
    const albumsSection = document.getElementById("albums")
    if (albumsSection) {
      albumsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Preserving Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              {" "}
              Memories
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            A digital archive of precious moments from Loyola Secondary School, Wau. Relive the joy, celebrate
            achievements, and cherish friendships that shaped our journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
              onClick={scrollToAlbums}
            >
              <Camera className="w-5 h-5 mr-2" />
              Explore Albums
            </Button>
            <Button variant="outline" size="lg" onClick={scrollToAlbums}>
              <Calendar className="w-5 h-5 mr-2" />
              Browse by Year
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{loading ? "..." : `${stats.totalPhotos}+`}</div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{loading ? "..." : `${stats.totalAlbums}+`}</div>
              <div className="text-sm text-muted-foreground">Albums</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {loading ? "..." : stats.yearsSpan > 0 ? `${stats.yearsSpan}+` : "New"}
              </div>
              <div className="text-sm text-muted-foreground">Years</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
