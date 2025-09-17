"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  id: number
  url: string
  caption: string
  timestamp: string
}

interface PhotoModalProps {
  photo: Photo
  photos: Photo[]
  onClose: () => void
  onNavigate: (photo: Photo) => void
}

export function PhotoModal({ photo, photos, onClose, onNavigate }: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const index = photos.findIndex((p) => p.id === photo.id)
    setCurrentIndex(index)
  }, [photo, photos])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex])

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    setCurrentIndex(newIndex)
    onNavigate(photos[newIndex])
  }

  const handleNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    onNavigate(photos[newIndex])
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = photo.url
    link.download = `loyola-memory-${photo.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.caption,
          text: `Check out this photo from Loyola Secondary School: ${photo.caption}`,
          url: photo.url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
        onClick={handlePrevious}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
        onClick={handleNext}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Main Content */}
      <div className="max-w-4xl max-h-full w-full flex flex-col">
        {/* Image */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <img
            src={photo.url || "/placeholder.svg"}
            alt={photo.caption}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>

        {/* Photo Info */}
        <div className="bg-black/50 backdrop-blur rounded-lg p-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{photo.caption}</h3>
              <p className="text-sm text-white/70">
                {new Date(photo.timestamp).toLocaleString()} • Photo {currentIndex + 1} of {photos.length}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
