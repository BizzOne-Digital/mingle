import { BookCta, PageHead } from '@/components/site'
import { site } from '@/lib/site'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How The Mingle handles the information you share through this website.',
  alternates: { canonical: '/privacy' },
}

// Describes only what this website actually does. Review with the client / legal counsel before launch.
export default function Privacy() {
  return (
    <>
      <PageHead label="Legal" title="Privacy Policy" intro="Last updated October 2026." />
      <article className="legal">
        <h2>Information you share with us</h2>
        <p>When you send an inquiry through our booking or contact form, we collect the details you provide: your name, email address, phone number, event type, event date, approximate guest count, the experience you are interested in, your budget and any message you include.</p>
        <h2>How we use it</h2>
        <p>We use this information only to respond to your inquiry, prepare a custom proposal and plan your event with you. We do not sell your information.</p>
        <h2>Payments</h2>
        <p>Deposits are paid through a secure link provided by Stripe. Card details are entered on Stripe&apos;s checkout page and are not stored by The Mingle.</p>
        <h2>Analytics and cookies</h2>
        <p>We use privacy-friendly analytics to understand overall visits to the website. We do not use advertising cookies.</p>
        <h2>Your choices</h2>
        <p>To ask about, update or remove the information you have shared with us, contact us at <a href={site.emailHref}>{site.email}</a> or call <a href={site.phoneHref}>{site.phone}</a>.</p>
      </article>
      <BookCta />
    </>
  )
}
