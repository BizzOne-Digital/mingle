import { BuiltInGallery, MediaLibrary } from '@/components/admin'

export default function GalleryAdmin() {
  return (
    <>
      <h1>Gallery</h1>
      <p className="sub">Everything shown on the public Gallery page. Your uploads appear first.</p>
      <h2 style={{ fontSize: 20, margin: '0 0 12px' }}>Your uploads</h2>
      <MediaLibrary folder="gallery" />
      <h2 style={{ fontSize: 20, margin: '36px 0 6px' }}>Photos from the original website</h2>
      <p className="sub">These ship with the website. Remove any you don&apos;t want on the Gallery page — you can restore them later.</p>
      <BuiltInGallery />
    </>
  )
}
