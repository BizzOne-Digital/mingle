import { ChevronDown } from 'lucide-react'
import { Accent, BookCta, EmptyState, PageHead } from '@/components/site'
import { getSettings, listPublic } from '@/lib/data'

export const metadata = {
  title: 'FAQ',
  description: 'Answers about The Mingle — events we serve, customization, pricing, booking and deposits.',
  alternates: { canonical: '/faq' },
}

export default async function Faq() {
  const [faqs, settings] = await Promise.all([listPublic('faqs'), getSettings()])
  const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }
  return (
    <>
      <PageHead label="FAQ" title={<Accent text={settings.faqTitle} />} intro={settings.faqIntro} />
      {faqs.length === 0 ? <EmptyState title="Questions? We have answers" text="Reach out and we will walk you through options, availability and next steps." /> : (
        <div className="faq-list">{faqs.map((f) => <details key={f._id ?? f.question}><summary>{f.question}<ChevronDown aria-hidden="true" /></summary><p>{f.answer}</p></details>)}</div>
      )}
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />}
      <BookCta />
    </>
  )
}
