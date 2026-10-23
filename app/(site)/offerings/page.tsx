import { Accent, BookCta, ConceptGrid, EmptyState, PageHead } from '@/components/site'
import { getSettings, listPublic } from '@/lib/data'

export const metadata = {
  title: 'Offerings',
  description: 'Curated carts, the Bliss Bar build-your-own takeaway, Petal Passion flower bar, interactive experiences and event vignettes by The Mingle in Kansas City.',
  alternates: { canonical: '/offerings' },
}

export default async function Offerings() {
  const [services, settings] = await Promise.all([listPublic('services'), getSettings()])
  return (
    <>
      <PageHead image={settings.offeringsHeadImage} label="Our offerings" title={<Accent text={settings.offeringsTitle} />} intro={settings.offeringsIntro} cta />
      {services.length === 0 ? <EmptyState title="Our menu is being refreshed" text="New experiences are on the way. Reach out and we will walk you through what is available for your date." /> : <ConceptGrid services={services} short />}
      <BookCta />
    </>
  )
}
