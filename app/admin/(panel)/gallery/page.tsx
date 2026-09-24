import { MediaLibrary } from '@/components/admin'

export default function GalleryAdmin() {
  return <><h1>Gallery</h1><p className="sub">Event photography stored in the gallery folder.</p><MediaLibrary folder="gallery" /></>
}
