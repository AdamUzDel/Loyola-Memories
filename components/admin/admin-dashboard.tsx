"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FolderPlus, ImageIcon, Users, BarChart3, Settings, Eye, Edit, Trash2, LogOut } from "lucide-react"
import { PhotoUpload } from "./photo-upload"
import { AlbumManager } from "./album-manager"
import { AdminStats } from "./admin-stats"
import { createBrowserClient } from "@supabase/ssr"
import { getAlbums, getPhotos } from "@/lib/database"

interface Album {
  id: string
  title: string
  photo_count: number
  created_at: string
  category: string
}

const NEXT_PUBLIC_SUPABASE_URL = 'https://hnsnaafcoriabirletuj.supabase.co'
const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc25hYWZjb3JpYWJpcmxldHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAyOTEsImV4cCI6MjA3MzY5NjI5MX0.AueYyLDnuqlY__Z3UMizs6vxD6DFQktafC_F4DcphOc'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [adminUser, setAdminUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalAlbums: 0,
    totalViews: 0,
    recentAlbums: [] as Album[],
  })
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    /* process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, */
    NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    // Get current admin user info
    const getAdminUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setAdminUser({ email: session.user.email, full_name: session.user.user_metadata?.full_name })
      }
    }

    const fetchStats = async () => {
      try {
        const [albums, photos] = await Promise.all([getAlbums(), getPhotos()])

        // Get recent albums (last 5)
        const recentAlbums = albums
          .sort((a: Album, b: Album) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)

        setStats({
          totalPhotos: photos.length,
          totalAlbums: albums.length,
          totalViews: 0, // Would need view tracking system
          recentAlbums,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    getAdminUser()
    fetchStats()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage photos, albums, and school memories</p>
          {adminUser && (
            <p className="text-sm text-muted-foreground mt-1">Welcome back, {adminUser.full_name || adminUser.email}</p>
          )}
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Button
          className="h-20 flex flex-col gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
          onClick={() => setActiveTab("upload")}
        >
          <Upload className="w-6 h-6" />
          <span>Upload Photos</span>
        </Button>

        <Button
          variant="outline"
          className="h-20 flex flex-col gap-2 bg-transparent"
          onClick={() => setActiveTab("albums")}
        >
          <FolderPlus className="w-6 h-6" />
          <span>Create Album</span>
        </Button>

        <Button
          variant="outline"
          className="h-20 flex flex-col gap-2 bg-transparent"
          onClick={() => setActiveTab("manage")}
        >
          <Settings className="w-6 h-6" />
          <span>Manage Content</span>
        </Button>

        <Button
          variant="outline"
          className="h-20 flex flex-col gap-2 bg-transparent"
          onClick={() => setActiveTab("stats")}
        >
          <BarChart3 className="w-6 h-6" />
          <span>View Stats</span>
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Albums</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentAlbums.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentAlbums.map((album) => (
                      <div key={album.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                          <FolderPlus className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{album.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {album.photo_count} photos • {album.category}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(album.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No albums created yet</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{loading ? "..." : stats.totalPhotos.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Photos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <FolderPlus className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{loading ? "..." : stats.totalAlbums}</p>
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
                      <p className="text-xs text-muted-foreground">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <PhotoUpload />
        </TabsContent>

        <TabsContent value="albums" className="mt-6">
          <AlbumManager />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Albums Management */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Albums</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentAlbums.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentAlbums.slice(0, 3).map((album) => (
                      <div key={album.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <p className="font-medium">{album.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {album.photo_count} photos • {new Date(album.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {album.category}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No albums yet</p>
                )}
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
                      <span>Photos</span>
                      <span>Calculating...</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Storage calculation feature coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <AdminStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}
