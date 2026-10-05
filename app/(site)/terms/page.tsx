import Link from 'next/link'
import { BookCta, PageHead } from '@/components/site'
import { site } from '@/lib/site'

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms for using The Mingle website and requesting an event booking.',
  alternates: { canonical: '/terms' },
}

// Restates how booking already works on this site; event-specific terms come in each client's proposal.
// Review with the client / legal counsel before launch.
export default function Terms() {
  return (
    <>
      <PageHead label="Legal" title="Terms & Conditions" intro="Last updated October 2026." />
      <article className="legal">
        <h2>Inquiries and bookings</h2>
        <p>Sending an inquiry through this website is a request, not a confirmed booking. Your booking is confirmed once we have agreed the details of your event with you.</p>
        <h2>Pricing</h2>
        <p>Prices shown on this website, such as curated cart starting prices, are starting points and not final quotes. Your final quote is confirmed in a custom proposal. See our <Link href="/pricing">pricing</Link> page.</p>
        <h2>Deposits</h2>
        <p>Once your experience is confirmed, we will send you a secure link to pay your deposit online. The terms that apply to your event are set out in your proposal.</p>
        <h2>Website content</h2>
        <p>The photographs, text and branding on this website belong to The Mingle and may not be reused without permission.</p>
        <h2>Questions</h2>
        <p>Contact us at <a href={site.emailHref}>{site.email}</a> or call <a href={site.phoneHref}>{site.phone}</a>.</p>
      </article>
      <BookCta />
    </>
  )
}
