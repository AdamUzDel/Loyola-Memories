"use client"

import { useState, useEffect } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminLogin } from "@/components/admin/admin-login"
import { Header } from "@/components/header"
import { createBrowserClient } from "@supabase/ssr"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

const NEXT_PUBLIC_SUPABASE_URL = 'https://hnsnaafcoriabirletuj.supabase.co'
const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc25hYWZjb3JpYWJpcmxldHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAyOTEsImV4cCI6MjA3MzY5NjI5MX0.AueYyLDnuqlY__Z3UMizs6vxD6DFQktafC_F4DcphOc'


  const supabase = createBrowserClient(
    /* process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, */
    NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Verify user is an admin
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .eq("is_active", true)
          .single()

        if (adminData) {
          setIsAuthenticated(true)
        }
      }
      setIsLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AdminDashboard />
      </main>
    </div>
  )
}
