import { type NextRequest, NextResponse } from "next/server"
import { createAlbum } from "@/lib/server-database"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const album = await createAlbum(data)
    return NextResponse.json(album)
  } catch (error) {
    console.error("Error in album creation API:", error)
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 })
  }
}
