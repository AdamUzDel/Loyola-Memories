"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, MapPin, Camera, Download, Share2, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PhotoModal } from "@/components/photo-modal"

interface Photo {
  id: number
  url: string
  caption: string
  timestamp: string
}

interface Album {
  id: number
  title: string
  description: string
  coverImage: string
  date: string
  year: string
  category: string
  location: string
  photographer: string
  photos: Photo[]
}

interface AlbumDetailProps {
  album: Album
}

export function AlbumDetail({ album }: AlbumDetailProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: album.title,
          text: album.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Albums
        </Button>

        {/* Album Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cover Image */}
            <div className="lg:w-1/3">
              <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                <img
                  src={album.coverImage || "/placeholder.svg"}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Album Info */}
            <div className="lg:w-2/3">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">{album.title}</h1>
                  <Badge variant="outline" className="mb-4">
                    {album.category}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-6 text-pretty">{album.description}</p>

              {/* Album Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(album.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{album.location}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Camera className="w-4 h-4" />
                  <span>{album.photographer}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <ZoomIn className="w-4 h-4" />
                  <span>{album.photos.length} Photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Photos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer bg-muted"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Photo Number */}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          photos={album.photos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={setSelectedPhoto}
        />
      )}
    </>
  )
}
