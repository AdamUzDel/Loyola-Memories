import { AlbumDetail } from "@/components/album-detail"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAlbumById, getPhotosByAlbumId } from "@/lib/database"
import { notFound } from "next/navigation"

interface AlbumPageProps {
  params: {
    id: string
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const [album, photos] = await Promise.all([getAlbumById(params.id), getPhotosByAlbumId(params.id)])

  if (!album) {
    notFound()
  }

  const albumWithPhotos = {
    ...album,
    coverImage: album.cover_image_url || (photos.length > 0 ? photos[0].url : "/placeholder.svg"),
    date: album.event_date || album.created_at,
    year: album.event_date
      ? new Date(album.event_date).getFullYear().toString()
      : new Date(album.created_at).getFullYear().toString(),
    photos: photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption || photo.alt_text || "",
      timestamp: photo.created_at,
    })),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AlbumDetail album={albumWithPhotos} />
      </main>
      <Footer />
    </div>
  )
}
