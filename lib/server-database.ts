import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CreateAlbumData, CreatePhotoData, Album, Photo } from "./database"

function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
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
