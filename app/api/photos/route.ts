import { type NextRequest, NextResponse } from "next/server"
import { createPhoto } from "@/lib/server-database"

export async function POST(request: NextRequest) {
  try {
    const photoData = await request.json()

    if (!photoData.album_id || !photoData.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create photo record in database
    const photo = await createPhoto(photoData)
    return NextResponse.json(photo)
  } catch (error) {
    console.error("Error in photo upload API:", error)
    return NextResponse.json({ error: "Failed to save photo data" }, { status: 500 })
  }
}
