import { type NextRequest, NextResponse } from "next/server"
import { updateAlbum, deleteAlbum } from "@/lib/server-database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const updatedAlbum = await updateAlbum(params.id, data)

    if (!updatedAlbum) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    return NextResponse.json(updatedAlbum)
  } catch (error) {
    console.error("Error updating album:", error)
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await deleteAlbum(params.id)

    if (!success) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting album:", error)
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 })
  }
}
