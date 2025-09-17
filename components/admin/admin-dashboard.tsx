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

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [adminUser, setAdminUser] = useState<any>(null)

const NEXT_PUBLIC_SUPABASE_URL = 'https://hnsnaafcoriabirletuj.supabase.co'
const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc25hYWZjb3JpYWJpcmxldHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAyOTEsImV4cCI6MjA3MzY5NjI5MX0.AueYyLDnuqlY__Z3UMizs6vxD6DFQktafC_F4DcphOc'


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
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .single()

        setAdminUser(adminData)
      }
    }

    getAdminUser()
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
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Album Created",
                      title: "Graduation Ceremony 2024",
                      time: "2 hours ago",
                      icon: FolderPlus,
                    },
                    {
                      action: "Photos Uploaded",
                      title: "45 photos added to Sports Day 2024",
                      time: "5 hours ago",
                      icon: Upload,
                    },
                    {
                      action: "Album Updated",
                      title: "Cultural Festival 2023",
                      time: "1 day ago",
                      icon: Edit,
                    },
                    {
                      action: "Photos Deleted",
                      title: "3 photos removed from Science Fair",
                      time: "2 days ago",
                      icon: Trash2,
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.title}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
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
                      <p className="text-2xl font-bold">1,247</p>
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
                      <p className="text-2xl font-bold">25</p>
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
                      <p className="text-2xl font-bold">2,456</p>
                      <p className="text-sm text-muted-foreground">Total Views</p>
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
            {/* Recent Albums */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Albums</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: "Graduation Ceremony 2024",
                      photos: 45,
                      date: "2024-06-15",
                      status: "published",
                    },
                    {
                      title: "Sports Day 2024",
                      photos: 67,
                      date: "2024-03-20",
                      status: "published",
                    },
                    {
                      title: "Science Fair 2024",
                      photos: 34,
                      date: "2024-05-08",
                      status: "draft",
                    },
                  ].map((album, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{album.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {album.photos} photos • {new Date(album.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={album.status === "published" ? "default" : "secondary"}>{album.status}</Badge>
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
                      <span>2.4 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-600 h-2 rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Videos</span>
                      <span>0.8 GB / 5 GB</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "16%" }}></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Total: 3.2 GB used of 15 GB available</p>
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
