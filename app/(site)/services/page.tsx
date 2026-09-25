import { AudienceBand, ConceptGrid, EmptyState, PageHead } from '@/components/site'
import { listPublic } from '@/lib/data'

export const metadata = {
  title: 'Services',
  description: 'Curated carts, the Bliss Bar build-your-own takeaway, Petal Passion flower bar, interactive experiences and event vignettes by The Mingle in Kansas City.',
  alternates: { canonical: '/services' },
}

export default async function Services() {
  const services = await listPublic('services')
  return (
    <>
      <PageHead label="Our services" title="Choose your experience" intro="Curated, interactive experiences designed around your event. Our menu continues to grow as new selections are added." />
      {services.length === 0 ? <EmptyState title="Our menu is being refreshed" text="New experiences are on the way. Reach out and we will walk you through what is available for your date." /> : <ConceptGrid services={services} />}
      <AudienceBand />
    </>
  )
}
