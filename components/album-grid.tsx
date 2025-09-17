"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ImageIcon } from "lucide-react"
import { getAlbums, type Album } from "@/lib/database"

const categories = [
  { value: "all", label: "All Albums" },
  { value: "Academic", label: "Academic" },
  { value: "Sports", label: "Sports" },
  { value: "Cultural", label: "Cultural" },
  { value: "Social", label: "Social" },
  { value: "Religious", label: "Religious" },
]

const years = ["All Years", "2024", "2023", "2022", "2021"]

export function AlbumGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedYear, setSelectedYear] = useState("All Years")
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlbums() {
      try {
        setLoading(true)
        const filters = {
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          year: selectedYear !== "All Years" ? Number.parseInt(selectedYear) : undefined,
        }
        const data = await getAlbums(filters)
        setAlbums(data)
      } catch (error) {
        console.error("Error fetching albums:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlbums()
  }, [selectedCategory, selectedYear])

  if (loading) {
    return (
      <section id="albums" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Memory Albums</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">Loading albums...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="albums" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Memory Albums</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse through our collection of memorable moments, organized by events and years
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    : ""
                }
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className={
                  selectedYear === year
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    : ""
                }
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link key={album.id} href={`/album/${album.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={album.cover_image_url || "/placeholder.svg?height=200&width=400&query=school album cover"}
                    alt={album.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      {album.photo_count}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-2 text-balance">{album.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{album.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {album.event_date ? new Date(album.event_date).toLocaleDateString() : "No date"}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {album.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {albums.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No albums found for the selected filters.</p>
          </div>
        )}
      </div>
    </section>
  )
}
