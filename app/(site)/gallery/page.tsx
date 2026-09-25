import Image from 'next/image'
import { EmptyState, PageHead } from '@/components/site'
import { listGallery } from '@/lib/data'

export const metadata = {
  title: 'Gallery',
  description: 'Photos of curated event experiences by The Mingle.',
  alternates: { canonical: '/gallery' },
}

// Images come from Admin → Gallery (MongoDB uploads). Nothing is shown until the client adds real photography.
export default async function Gallery() {
  const images = await listGallery()
  return (
    <>
      <PageHead label="Gallery" title="Moments we have styled" intro="A look at The Mingle experiences in action." />
      {images.length === 0 ? <EmptyState title="Photos are on the way" text="Our gallery of real events is coming soon. See our latest work on Instagram in the meantime." /> : (
        <div className="gallery-grid">
          {images.map((img, i) => <figure key={img.url}><Image src={img.url} alt={`The Mingle event photo ${i + 1}`} fill sizes="(max-width: 700px) 100vw, 360px" /></figure>)}
        </div>
      )}
    </>
  )
}
