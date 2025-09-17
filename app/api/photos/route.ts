import { type NextRequest, NextResponse } from "next/server"
import { createPhoto, uploadPhoto } from "@/lib/server-database"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const albumId = formData.get("albumId") as string
    const originalFilename = formData.get("originalFilename") as string
    const caption = formData.get("caption") as string

    if (!file || !albumId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload file to storage
    const url = await uploadPhoto(file, albumId)

    // Create photo record in database
    const photoData = {
      album_id: albumId,
      filename: file.name,
      original_filename: originalFilename || file.name,
      url,
      caption: caption || undefined,
      file_size: file.size,
    }

    const photo = await createPhoto(photoData)
    return NextResponse.json(photo)
  } catch (error) {
    console.error("Error in photo upload API:", error)
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
  }
}
