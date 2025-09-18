/* import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CreateAlbumData, CreatePhotoData, Album, Photo } from "./database"

function createServerSupabaseClient() {
  const cookieStore = cookies()

const NEXT_PUBLIC_SUPABASE_URL = 'https://hnsnaafcoriabirletuj.supabase.co'
const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc25hYWZjb3JpYWJpcmxldHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAyOTEsImV4cCI6MjA3MzY5NjI5MX0.AueYyLDnuqlY__Z3UMizs6vxD6DFQktafC_F4DcphOc'


  return createServerClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function createAlbum(data: CreateAlbumData): Promise<Album> {
  const supabase = createServerSupabaseClient()
  const { data: album, error } = await supabase.from("albums").insert([data]).select().single()

  if (error) {
    console.error("Error creating album:", error)
    throw new Error("Failed to create album")
  }

  return album
}

export async function createPhoto(data: CreatePhotoData): Promise<Photo> {
  const supabase = createServerSupabaseClient()
  const { data: photo, error } = await supabase.from("photos").insert([data]).select().single()

  if (error) {
    console.error("Error creating photo:", error)
    throw new Error("Failed to create photo")
  }

  return photo
}

export async function updateAlbum(id: string, data: Partial<CreateAlbumData>): Promise<Album | null> {
  const supabase = createServerSupabaseClient()
  const { data: album, error } = await supabase
    .from("albums")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating album:", error)
    return null
  }

  return album
}

export async function deleteAlbum(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  // First delete all photos in the album
  await supabase.from("photos").delete().eq("album_id", id)

  // Then delete the album
  const { error } = await supabase.from("albums").delete().eq("id", id)

  if (error) {
    console.error("Error deleting album:", error)
    return false
  }

  return true
}

export async function deletePhoto(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("photos").delete().eq("id", id)

  if (error) {
    console.error("Error deleting photo:", error)
    return false
  }

  return true
}

export async function uploadPhoto(file: File, albumId: string): Promise<string> {
  const supabase = createServerSupabaseClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${albumId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage.from("photos").upload(fileName, file)

  if (error) {
    console.error("Error uploading photo:", error)
    throw new Error("Failed to upload photo")
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(fileName)

  return publicUrl
}
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CreateAlbumData, CreatePhotoData, Album, Photo } from "./database"

function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  const NEXT_PUBLIC_SUPABASE_URL = 'https://hnsnaafcoriabirletuj.supabase.co'
  const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc25hYWZjb3JpYWJpcmxldHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAyOTEsImV4cCI6MjA3MzY5NjI5MX0.AueYyLDnuqlY__Z3UMizs6vxD6DFQktafC_F4DcphOc'

  return createServerClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function createAlbum(data: CreateAlbumData): Promise<Album> {
  const supabase = createServerSupabaseClient()
  const { data: album, error } = await supabase.from("albums").insert([data]).select().single()

  if (error) {
    console.error("Error creating album:", error)
    throw new Error("Failed to create album")
  }

  return album
}

export async function createPhoto(data: CreatePhotoData): Promise<Photo> {
  console.log("[v0] Server DB: Creating photo with data:", {
    album_id: data.album_id,
    filename: data.filename,
    url: data.url ? "URL present" : "URL missing",
    file_size: data.file_size,
  })

  const supabase = createServerSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  console.log("[v0] Server DB: Auth check:", {
    user: user ? user.id : "No user",
    authError: authError?.message,
  })

  const { data: photo, error } = await supabase.from("photos").insert([data]).select().single()

  if (error) {
    console.error("[v0] Server DB: Error creating photo:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to create photo: ${error.message}`)
  }

  console.log("[v0] Server DB: Photo created successfully:", photo.id)

  try {
    await setAlbumCoverIfNeeded(data.album_id)
  } catch (error) {
    console.error("[v0] Server DB: Error setting album cover:", error)
    // Don't throw error here as photo was created successfully
  }

  return photo
}

async function setAlbumCoverIfNeeded(albumId: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Check if album already has a cover
  const { data: album } = await supabase.from("albums").select("cover_image_url").eq("id", albumId).single()

  if (album?.cover_image_url) {
    return // Album already has a cover
  }

  // Get the first photo in the album
  const { data: firstPhoto } = await supabase
    .from("photos")
    .select("url")
    .eq("album_id", albumId)
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (firstPhoto?.url) {
    const { error } = await supabase
      .from("albums")
      .update({ cover_image_url: firstPhoto.url, updated_at: new Date().toISOString() })
      .eq("id", albumId)

    if (error) {
      console.error("[v0] Server DB: Error updating album cover:", error)
    }
  }
}

export async function updateAlbum(id: string, data: Partial<CreateAlbumData>): Promise<Album | null> {
  const supabase = createServerSupabaseClient()
  const { data: album, error } = await supabase
    .from("albums")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating album:", error)
    return null
  }

  return album
}

export async function deleteAlbum(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  // First delete all photos in the album
  await supabase.from("photos").delete().eq("album_id", id)

  // Then delete the album
  const { error } = await supabase.from("albums").delete().eq("id", id)

  if (error) {
    console.error("Error deleting album:", error)
    return false
  }

  return true
}

export async function deletePhoto(id: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("photos").delete().eq("id", id)

  if (error) {
    console.error("Error deleting photo:", error)
    return false
  }

  return true
}

export async function uploadPhoto(file: File, albumId: string): Promise<string> {
  const supabase = createServerSupabaseClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${albumId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage.from("photos").upload(fileName, file)

  if (error) {
    console.error("Error uploading photo:", error)
    throw new Error("Failed to upload photo")
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(fileName)

  return publicUrl
}
