import { CtaBand, EmptyState, Img, PageHero } from '@/components/site'
import { listPublic } from '@/lib/data'
import { defaultImages } from '@/lib/site'

export const metadata = {
  title: 'Our Team',
  description: 'Meet the people behind The Mingle and our curated event experiences.',
  alternates: { canonical: '/team' },
}

export default async function Team() {
  const team = await listPublic('team')
  return (
    <>
      <PageHero eyebrow="Our team" title={<>The people behind <em>the mingle.</em></>} intro="A flair for detail, a love of fun and an eye for beautiful design." />
      <section className="section-pad" style={{ paddingTop: 0 }}>
        {team.length === 0 ? <EmptyState title="Meet the team soon" text="Our team page is being prepared. We would love to meet you in the meantime." /> : (
          <div className="team-grid">
            {team.map((m) => (
              <article className="reveal" key={m._id}>
                <div className="image-frame"><Img src={m.image} fallback={defaultImages.aboutImage} alt={m.name} sizes="(max-width: 600px) 100vw, 33vw" /></div>
                <h2 style={{ fontSize: 28, margin: '0 0 6px' }}>{m.name}</h2>
                {m.role && <p className="role">{m.role}</p>}
                {m.bio && <p>{m.bio}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  )
}
