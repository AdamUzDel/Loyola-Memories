"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Compass as Compress, Check, AlertCircle, ImageIcon, Loader2 } from "lucide-react"
import { getAlbums, uploadPhoto, type Album, type CreateAlbumData, type CreatePhotoData } from "@/lib/database"
import {
  compressImage,
  needsCompression,
  formatFileSize,
  isValidImageType,
  generateThumbnail,
  type CompressionResult,
} from "@/lib/image-compression"

interface UploadFile {
  id: string
  file: File
  originalFile: File
  preview: string
  thumbnail?: string
  compressed: boolean
  compressionResult?: CompressionResult
  progress: number
  status: "pending" | "compressing" | "uploading" | "completed" | "error"
  error?: string
}

export function PhotoUpload() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [existingAlbums, setExistingAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("")
  const [createNewAlbum, setCreateNewAlbum] = useState(true)
  const [albumTitle, setAlbumTitle] = useState("")
  const [albumDescription, setAlbumDescription] = useState("")
  const [albumCategory, setAlbumCategory] = useState("")
  const [albumDate, setAlbumDate] = useState("")
  const [albumLocation, setAlbumLocation] = useState("")
  const [albumPhotographer, setAlbumPhotographer] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [loadingAlbums, setLoadingAlbums] = useState(true)

  useEffect(() => {
    loadExistingAlbums()
  }, [])

  const loadExistingAlbums = async () => {
    try {
      setLoadingAlbums(true)
      const albums = await getAlbums()
      setExistingAlbums(albums)
    } catch (error) {
      console.error("Failed to load albums:", error)
    } finally {
      setLoadingAlbums(false)
    }
  }

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const validFiles = Array.from(selectedFiles).filter((file) => {
      if (!isValidImageType(file)) {
        console.warn(`Skipping invalid file type: ${file.name}`)
        return false
      }
      return true
    })

    const newFiles: UploadFile[] = []

    for (const file of validFiles) {
      try {
        const preview = URL.createObjectURL(file)
        const thumbnail = await generateThumbnail(file)

        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          originalFile: file,
          preview,
          thumbnail,
          compressed: !needsCompression(file),
          progress: 0,
          status: "pending",
        })
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error)
      }
    }

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const compressFiles = async () => {
    setIsCompressing(true)
    const filesToCompress = files.filter((f) => !f.compressed && f.status !== "error")

    for (const fileItem of filesToCompress) {
      try {
        setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, status: "compressing" as const } : f)))

        const compressionResult = await compressImage(fileItem.originalFile)

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  file: compressionResult.file,
                  compressed: true,
                  compressionResult,
                  status: "pending" as const,
                  progress: 100,
                }
              : f,
          ),
        )
      } catch (error) {
        console.error(`Failed to compress ${fileItem.file.name}:`, error)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  status: "error" as const,
                  error: "Compression failed",
                }
              : f,
          ),
        )
      }
    }

    setIsCompressing(false)
  }

  const uploadFiles = async () => {
    if (!albumTitle && !selectedAlbumId) {
      alert("Please provide an album title or select an existing album")
      return
    }

    if (createNewAlbum && !albumCategory) {
      alert("Please select a category for the new album")
      return
    }

    setIsUploading(true)

    try {
      let targetAlbumId = selectedAlbumId

      if (createNewAlbum && albumTitle) {
        const albumData: CreateAlbumData = {
          title: albumTitle,
          description: albumDescription || undefined,
          category: albumCategory,
          event_date: albumDate || undefined,
          location: albumLocation || undefined,
          photographer: albumPhotographer || undefined,
        }

        const response = await fetch("/api/albums", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(albumData),
        })

        if (!response.ok) {
          throw new Error("Failed to create album")
        }

        const newAlbum = await response.json()
        targetAlbumId = newAlbum.id

        await loadExistingAlbums()
      }

      if (!targetAlbumId) {
        throw new Error("No album selected or created")
      }

      const filesToUpload = files.filter((f) => f.status === "pending")

      for (const file of filesToUpload) {
        try {
          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, status: "uploading" as const, progress: 0 } : f)),
          )

          setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 25 } : f)))

          const imageUrl = await uploadPhoto(file.file, targetAlbumId)

          setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 75 } : f)))

          const photoData: CreatePhotoData = {
            album_id: targetAlbumId,
            filename: `${targetAlbumId}/${Date.now()}.${file.file.name.split(".").pop()}`,
            original_filename: file.originalFile.name,
            url: imageUrl,
            file_size: file.file.size,
            width: file.compressionResult?.dimensions?.width,
            height: file.compressionResult?.dimensions?.height,
          }

          const response = await fetch("/api/photos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(photoData),
          })

          if (!response.ok) {
            throw new Error("Failed to save photo data")
          }

          setFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, status: "completed" as const, progress: 100 } : f)),
          )
        } catch (error) {
          console.error(`Failed to upload ${file.file.name}:`, error)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    status: "error" as const,
                    error: error instanceof Error ? error.message : "Upload failed",
                  }
                : f,
            ),
          )
        }
      }

      const successCount = files.filter((f) => f.status === "completed").length
      if (successCount > 0) {
        alert(`Successfully uploaded ${successCount} photo(s)!`)

        if (createNewAlbum) {
          setAlbumTitle("")
          setAlbumDescription("")
          setAlbumCategory("")
          setAlbumDate("")
          setAlbumLocation("")
          setAlbumPhotographer("")
        }

        setFiles((prev) => prev.filter((f) => f.status !== "completed"))
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Failed to upload photos. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const selectedFiles = event.dataTransfer.files
      handleFileSelect(selectedFiles)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  const totalOriginalSize = files.reduce((sum, f) => sum + f.originalFile.size, 0)
  const totalCompressedSize = files.reduce((sum, f) => sum + f.file.size, 0)
  const totalSavings = totalOriginalSize - totalCompressedSize
  const compressionRatio = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Album Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Album Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="create-new"
                name="album-option"
                checked={createNewAlbum}
                onChange={() => setCreateNewAlbum(true)}
                className="w-4 h-4"
              />
              <Label htmlFor="create-new">Create New Album</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="use-existing"
                name="album-option"
                checked={!createNewAlbum}
                onChange={() => setCreateNewAlbum(false)}
                className="w-4 h-4"
              />
              <Label htmlFor="use-existing">Add to Existing Album</Label>
            </div>
          </div>

          {!createNewAlbum && (
            <div>
              <Label htmlFor="existing-album">Select Album</Label>
              {loadingAlbums ? (
                <div className="flex items-center space-x-2 p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading albums...</span>
                </div>
              ) : (
                <Select value={selectedAlbumId} onValueChange={setSelectedAlbumId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an existing album" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingAlbums.map((album) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.title} ({album.photo_count} photos)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Album Information - Only show if creating new album */}
      {createNewAlbum && (
        <Card>
          <CardHeader>
            <CardTitle>New Album Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="album-title">Album Title *</Label>
                <Input
                  id="album-title"
                  placeholder="e.g., Graduation Ceremony 2024"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="album-category">Category *</Label>
                <Select value={albumCategory} onValueChange={setAlbumCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="celebration">Celebrations</SelectItem>
                    <SelectItem value="orientation">Orientation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="album-description">Description</Label>
              <Textarea
                id="album-description"
                placeholder="Describe this album and the memories it contains..."
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="album-date">Event Date</Label>
                <Input id="album-date" type="date" value={albumDate} onChange={(e) => setAlbumDate(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="album-location">Location</Label>
                <Input
                  id="album-location"
                  placeholder="e.g., School Main Hall"
                  value={albumLocation}
                  onChange={(e) => setAlbumLocation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="album-photographer">Photographer</Label>
                <Input
                  id="album-photographer"
                  placeholder="e.g., Mr. James Akol"
                  value={albumPhotographer}
                  onChange={(e) => setAlbumPhotographer(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ImageIcon className="w-5 h-5" />
            Upload Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drop Zone */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2 text-foreground">Drop photos here or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports JPG, PNG, WebP files. Images will be compressed to max 1MB for optimal storage.
            </p>
            <Input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              id="file-upload"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Photos
              </label>
            </Button>
          </div>

          {/* Storage Statistics */}
          {files.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Photos</p>
                  <p className="font-semibold">{files.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Original Size</p>
                  <p className="font-semibold">{formatFileSize(totalOriginalSize)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Compressed Size</p>
                  <p className="font-semibold">{formatFileSize(totalCompressedSize)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Space Saved</p>
                  <p className="font-semibold text-green-600">{compressionRatio.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Selected Photos ({files.length})</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={compressFiles}
                    disabled={isUploading || isCompressing || files.every((f) => f.compressed)}
                  >
                    <Compress className="w-4 h-4 mr-2" />
                    {isCompressing ? "Compressing..." : "Compress All"}
                  </Button>
                  <Button
                    onClick={uploadFiles}
                    disabled={
                      isUploading ||
                      (createNewAlbum && (!albumTitle || !albumCategory)) ||
                      (!createNewAlbum && !selectedAlbumId) ||
                      files.some((f) => f.status === "error") ||
                      files.length === 0
                    }
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload All
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={file.thumbnail || file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* File Info Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-between p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          {file.compressed && (
                            <Badge variant="secondary" className="text-xs">
                              <Compress className="w-3 h-3 mr-1" />
                              Compressed
                            </Badge>
                          )}
                          {file.status === "completed" && (
                            <Badge variant="secondary" className="text-xs bg-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              Uploaded
                            </Badge>
                          )}
                          {file.status === "error" && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Error
                            </Badge>
                          )}
                          {file.status === "compressing" && (
                            <Badge variant="secondary" className="text-xs">
                              <Compress className="w-3 h-3 mr-1" />
                              Compressing...
                            </Badge>
                          )}
                          {file.status === "uploading" && (
                            <Badge variant="secondary" className="text-xs">
                              <Upload className="w-3 h-3 mr-1" />
                              Uploading...
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === "uploading"}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div>
                        <p className="text-white text-xs font-medium truncate mb-1">{file.file.name}</p>
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                          <span>{formatFileSize(file.file.size)}</span>
                          {file.compressionResult && (
                            <span className="text-green-400">
                              -{file.compressionResult.compressionRatio.toFixed(0)}%
                            </span>
                          )}
                        </div>
                        {(file.status === "uploading" || file.status === "compressing") && (
                          <Progress value={file.progress} className="mt-2 h-1" />
                        )}
                        {file.error && <p className="text-red-400 text-xs mt-1">{file.error}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
