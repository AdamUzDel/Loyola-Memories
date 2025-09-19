"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
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
  // Added touch handling state for swipe functionality
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance to trigger navigation
  const minSwipeDistance = 50

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

  // Added touch event handlers for swipe functionality
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrevious()
    }
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
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Enhanced close button with better visibility and mobile sizing */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80 hover:border-white/40 w-12 h-12 md:w-10 md:h-10"
        onClick={onClose}
      >
        <X className="w-7 h-7 md:w-6 md:h-6" />
      </Button>

      {/* Enhanced navigation buttons with better visibility and mobile sizing */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80 hover:border-white/40 w-14 h-14 md:w-12 md:h-12"
        onClick={handlePrevious}
      >
        <ChevronLeft className="w-8 h-8 md:w-7 md:h-7" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80 hover:border-white/40 w-14 h-14 md:w-12 md:h-12"
        onClick={handleNext}
      >
        <ChevronRight className="w-8 h-8 md:w-7 md:h-7" />
      </Button>

      {/* Added swipe indicator for mobile users */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm md:hidden">
        Swipe left or right to navigate
      </div>

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
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 border border-white/20"
                onClick={handleDownload}
              >
                Download
              </Button>
              {navigator.share && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border border-white/20"
                  onClick={handleShare}
                >
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
