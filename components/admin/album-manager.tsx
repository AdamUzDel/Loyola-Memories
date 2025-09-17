"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Calendar, ImageIcon, Loader2 } from "lucide-react"
import { getAlbums, type Album, type CreateAlbumData } from "@/lib/database"

export function AlbumManager() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    event_date: "",
    location: "",
    photographer: "",
  })

  useEffect(() => {
    loadAlbums()
  }, [])

  const loadAlbums = async () => {
    try {
      setLoading(true)
      const data = await getAlbums()
      setAlbums(data)
    } catch (error) {
      console.error("Failed to load albums:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlbum = async () => {
    if (!formData.title.trim()) return

    try {
      setSubmitting(true)
      const albumData: CreateAlbumData = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        event_date: formData.event_date || undefined,
        location: formData.location || undefined,
        photographer: formData.photographer || undefined,
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
      setAlbums([newAlbum, ...albums])
      setFormData({ title: "", description: "", category: "", event_date: "", location: "", photographer: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create album:", error)
      alert("Failed to create album. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album)
    setFormData({
      title: album.title,
      description: album.description || "",
      category: album.category,
      event_date: album.event_date || "",
      location: album.location || "",
      photographer: album.photographer || "",
    })
  }

  const handleUpdateAlbum = async () => {
    if (!editingAlbum || !formData.title.trim()) return

    try {
      setSubmitting(true)
      const updateData = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        event_date: formData.event_date || undefined,
        location: formData.location || undefined,
        photographer: formData.photographer || undefined,
      }

      const response = await fetch(`/api/albums/${editingAlbum.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update album")
      }

      const updatedAlbum = await response.json()
      setAlbums(albums.map((album) => (album.id === editingAlbum.id ? updatedAlbum : album)))
      setEditingAlbum(null)
      setFormData({ title: "", description: "", category: "", event_date: "", location: "", photographer: "" })
    } catch (error) {
      console.error("Failed to update album:", error)
      alert("Failed to update album. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album? This will also delete all photos in the album.")) {
      return
    }

    try {
      const response = await fetch(`/api/albums/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete album")
      }

      setAlbums(albums.filter((album) => album.id !== id))
    } catch (error) {
      console.error("Failed to delete album:", error)
      alert("Failed to delete album. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading albums...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Album Management</h2>
          <p className="text-muted-foreground">Create and manage photo albums</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Album
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Album</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Album Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Graduation Ceremony 2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this album..."
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
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

              <div>
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., School Auditorium"
                />
              </div>

              <div>
                <Label htmlFor="photographer">Photographer</Label>
                <Input
                  id="photographer"
                  value={formData.photographer}
                  onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <Button
                onClick={handleCreateAlbum}
                className="w-full"
                disabled={submitting || !formData.title.trim() || !formData.category}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Album"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No albums found. Create your first album to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={album.cover_image_url || "/placeholder.svg?height=200&width=400&query=school album cover"}
                  alt={album.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    {album.photo_count}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-balance">{album.title}</h3>
                </div>

                {album.description && (
                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{album.description}</p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  {album.event_date && (
                    <>
                      <Calendar className="w-3 h-3" />
                      {new Date(album.event_date).toLocaleDateString()}
                    </>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {album.category}
                  </Badge>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => window.open(`/album/${album.id}`, "_blank")}>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditAlbum(album)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingAlbum} onOpenChange={() => setEditingAlbum(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Album Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
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

            <div>
              <Label htmlFor="edit-date">Event Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., School Auditorium"
              />
            </div>

            <div>
              <Label htmlFor="edit-photographer">Photographer</Label>
              <Input
                id="edit-photographer"
                value={formData.photographer}
                onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                placeholder="e.g., John Doe"
              />
            </div>

            <Button
              onClick={handleUpdateAlbum}
              className="w-full"
              disabled={submitting || !formData.title.trim() || !formData.category}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Album"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
