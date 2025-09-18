"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Calendar, ImageIcon, FolderOpen } from "lucide-react"
import { getAlbums, getPhotos } from "@/lib/database"

interface Album {
  id: string
  title: string
  category: string
  photo_count: number
  created_at: string
}

interface Photo {
  id: string
  album_id: string
  created_at: string
}

export function AdminStats() {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalAlbums: 0,
    totalViews: 0, // This would need a views tracking system
    storageUsed: 0, // This would need file size tracking
    storageLimit: 15,
    monthlyUploads: 0,
    popularAlbums: [] as Album[],
    categoryStats: [] as { category: string; count: number; photos: number }[],
    monthlyStats: [] as { month: string; uploads: number; views: number }[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [albums, photos] = await Promise.all([getAlbums(), getPhotos()])

        // Calculate category stats
        const categoryMap = new Map<string, { count: number; photos: number }>()
        albums.forEach((album: Album) => {
          const existing = categoryMap.get(album.category) || { count: 0, photos: 0 }
          categoryMap.set(album.category, {
            count: existing.count + 1,
            photos: existing.photos + album.photo_count,
          })
        })

        const categoryStats = Array.from(categoryMap.entries()).map(([category, data]) => ({
          category,
          count: data.count,
          photos: data.photos,
        }))

        // Calculate monthly uploads for the last 6 months
        const now = new Date()
        const monthlyStats = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthName = date.toLocaleDateString("en-US", { month: "short" })
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

          const monthPhotos = photos.filter((photo: Photo) => {
            const photoDate = new Date(photo.created_at)
            return photoDate >= monthStart && photoDate <= monthEnd
          })

          monthlyStats.push({
            month: monthName,
            uploads: monthPhotos.length,
            views: 0, // Would need view tracking
          })
        }

        // Get current month uploads
        const currentMonth = new Date()
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const monthlyUploads = photos.filter((photo: Photo) => new Date(photo.created_at) >= monthStart).length

        // Sort albums by photo count for popular albums
        const popularAlbums = albums.sort((a: Album, b: Album) => b.photo_count - a.photo_count).slice(0, 3)

        setStats({
          totalPhotos: photos.length,
          totalAlbums: albums.length,
          totalViews: 0, // Would need view tracking system
          storageUsed: 0, // Would need file size calculation
          storageLimit: 15,
          monthlyUploads,
          popularAlbums,
          categoryStats,
          monthlyStats,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-12 w-12 bg-muted rounded-lg mb-3"></div>
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPhotos.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Photos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalAlbums}</p>
                <p className="text-sm text-muted-foreground">Albums</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-xs text-muted-foreground">Feature coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.monthlyUploads}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Albums */}
        <Card>
          <CardHeader>
            <CardTitle>Albums with Most Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularAlbums.length > 0 ? (
                stats.popularAlbums.map((album, index) => (
                  <div key={album.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{album.title}</p>
                      <p className="text-sm text-muted-foreground">{album.photo_count} photos</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="capitalize">
                        {album.category}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No albums yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Albums by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.categoryStats.length > 0 ? (
                stats.categoryStats.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">
                        {category.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{category.count} albums</span>
                    </div>
                    <span className="font-medium">{category.photos} photos</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No categories yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Used Storage</span>
                  <span>
                    {stats.storageUsed} GB / {stats.storageLimit} GB
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-orange-600 h-3 rounded-full"
                    style={{ width: `${(stats.storageUsed / stats.storageLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Storage calculation feature coming soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.monthlyStats.slice(-3).map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{month.month}</span>
                  </div>
                  <div className="text-right text-sm">
                    <p>{month.uploads} uploads</p>
                    <p className="text-muted-foreground">Views coming soon</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
