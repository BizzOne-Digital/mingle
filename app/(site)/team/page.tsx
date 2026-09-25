import { AudienceBand, EmptyState, Img, PageHead } from '@/components/site'
import { listPublic } from '@/lib/data'
import { defaultImages } from '@/lib/site'

export const metadata = {
  title: 'Our Team',
  description: 'Meet the people behind The Mingle and our curated event experiences.',
  alternates: { canonical: '/team' },
}

// Same bordered card grid as the live concepts page.
export default async function Team() {
  const team = await listPublic('team')
  return (
    <>
      <PageHead label="Our team" title="The people behind The Mingle" intro="A flair for detail, a love of fun and an eye for beautiful design." />
      {team.length === 0 ? <EmptyState title="Meet the team soon" text="Our team page is being prepared. We would love to meet you in the meantime." /> : (
        <div className="concepts-grid">
          {team.map((m) => (
            <article className="concept-card" key={m._id}>
              <div className="card-img"><Img src={m.image} fallback={defaultImages.aboutImage} alt={m.name} sizes="(max-width: 640px) 100vw, 360px" /></div>
              <div className="card-body">
                {m.role && <p className="card-num">{m.role.toUpperCase()}</p>}
                <h2 className="card-name">{m.name}</h2>
                {m.bio && <p className="card-desc">{m.bio}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
      <AudienceBand />
    </>
  )
}
