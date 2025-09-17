"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Calendar, ImageIcon, FolderOpen } from "lucide-react"

export function AdminStats() {
  const stats = {
    totalPhotos: 1247,
    totalAlbums: 25,
    totalViews: 2456,
    storageUsed: 3.2,
    storageLimit: 15,
    monthlyUploads: 156,
    popularAlbums: [
      { title: "Graduation Ceremony 2024", views: 456, photos: 45 },
      { title: "Sports Day 2024", views: 389, photos: 67 },
      { title: "Cultural Festival 2023", views: 234, photos: 89 },
    ],
    categoryStats: [
      { category: "graduation", count: 5, photos: 234 },
      { category: "sports", count: 8, photos: 456 },
      { category: "cultural", count: 4, photos: 189 },
      { category: "academic", count: 6, photos: 267 },
      { category: "celebration", count: 2, photos: 101 },
    ],
    monthlyStats: [
      { month: "Jan", uploads: 45, views: 234 },
      { month: "Feb", uploads: 67, views: 345 },
      { month: "Mar", uploads: 89, views: 456 },
      { month: "Apr", uploads: 56, views: 234 },
      { month: "May", uploads: 78, views: 567 },
      { month: "Jun", uploads: 123, views: 789 },
    ],
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
            <CardTitle>Most Popular Albums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularAlbums.map((album, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{album.title}</p>
                    <p className="text-sm text-muted-foreground">{album.photos} photos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{album.views}</p>
                    <p className="text-sm text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
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
              {stats.categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {category.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{category.count} albums</span>
                  </div>
                  <span className="font-medium">{category.photos} photos</span>
                </div>
              ))}
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
              <p className="text-sm text-muted-foreground">
                {(((stats.storageLimit - stats.storageUsed) / stats.storageLimit) * 100).toFixed(1)}% remaining
              </p>
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
                    <p className="text-muted-foreground">{month.views} views</p>
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
