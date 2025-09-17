import { createClient } from "./supabase"

export interface Album {
  id: string
  title: string
  description?: string
  cover_image_url?: string
  category: string
  event_date?: string
  location?: string
  photographer?: string
  photo_count: number
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  album_id: string
  filename: string
  original_filename: string
  url: string
  thumbnail_url?: string
  alt_text?: string
  caption?: string
  file_size?: number
  width?: number
  height?: number
  upload_date: string
  created_at: string
}

export interface CreateAlbumData {
  title: string
  description?: string
  cover_image_url?: string
  category: string
  event_date?: string
  location?: string
  photographer?: string
}

export interface CreatePhotoData {
  album_id: string
  filename: string
  original_filename: string
  url: string
  thumbnail_url?: string
  alt_text?: string
  caption?: string
  file_size?: number
  width?: number
  height?: number
}

export async function getAlbums(filters?: {
  category?: string
  year?: number
  month?: number
  search?: string
}): Promise<Album[]> {
  const supabase = createClient()
  let query = supabase.from("albums").select("*").order("created_at", { ascending: false })

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category)
  }

  if (filters?.year) {
    const startDate = `${filters.year}-01-01`
    const endDate = `${filters.year}-12-31`
    query = query.gte("event_date", startDate).lte("event_date", endDate)
  }

  if (filters?.month && filters?.year) {
    const startDate = `${filters.year}-${filters.month.toString().padStart(2, "0")}-01`
    const endDate = `${filters.year}-${filters.month.toString().padStart(2, "0")}-31`
    query = query.gte("event_date", startDate).lte("event_date", endDate)
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching albums:", error)
    return []
  }

  return data || []
}

export async function getAlbumById(id: string): Promise<Album | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("albums").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching album:", error)
    return null
  }

  return data
}

export async function getPhotosByAlbumId(albumId: string): Promise<Photo[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("album_id", albumId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching photos:", error)
    return []
  }

  return data || []
}

export async function getAlbumStats() {
  const supabase = createClient()

  const [albumsResult, photosResult] = await Promise.all([
    supabase.from("albums").select("id, photo_count"),
    supabase.from("photos").select("file_size"),
  ])

  const totalAlbums = albumsResult.data?.length || 0
  const totalPhotos = albumsResult.data?.reduce((sum, album) => sum + (album.photo_count || 0), 0) || 0
  const totalBytes = photosResult.data?.reduce((sum, photo) => sum + (photo.file_size || 0), 0) || 0
  const totalStorage = `${(totalBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`

  // Get recent uploads (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentPhotos } = await supabase
    .from("photos")
    .select("id")
    .gte("created_at", sevenDaysAgo.toISOString())

  return {
    totalAlbums,
    totalPhotos,
    totalStorage,
    recentUploads: recentPhotos?.length || 0,
  }
}

export async function uploadPhoto(file: File, albumId: string): Promise<string> {
  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${albumId}/${Date.now()}.${fileExt}`

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage.from("photos").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading photo:", error)
    throw new Error(`Error uploading photo: ${error.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(fileName)

  return publicUrl
}
