export const site = {
  name: 'The Mingle',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://the-mingle.com').replace(/\/$/, ''),
  phone: '+1 913-706-2347',
  phoneHref: 'tel:+19137062347',
  whatsappHref: 'https://wa.me/19137062347',
  email: 'Allisonnow30@gmail.com',
  emailHref: 'mailto:allisonnow30@gmail.com',
  instagram: '@TheMingleKC',
  instagramHref: 'https://www.instagram.com/TheMingleKC/',
  logo: 'https://res.cloudinary.com/difmil8wj/image/upload/v1790180172/bizzone-logos/anxudv8ewuudya8gv3d4.jpg',
  headline: 'Unique, curated experiences for your event',
}

export const nav: [string, string][] = [
  ['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/pricing', 'Pricing'], ['/gallery', 'Gallery'], ['/testimonials', 'Testimonials'],
  ['/faq', 'FAQ'], ['/team', 'Our Team'], ['/blogs', 'Blogs'], ['/contact', 'Contact'],
]

export const audiences = [
  'Brides', 'Women planning celebrations', 'Event planners', 'Wedding planners', 'Corporate event planners', 'HR professionals',
  'Schools', 'Churches', 'Local businesses', 'Grand openings', 'Special events',
]

export const offerings = [
  'Curated carts', 'Food experiences', 'Games', 'Build-your-own takeaway bags', 'Bliss Bar', 'Petal Passion flower bar',
  'Interactive experiences', 'Creative experiences', 'Beautiful event vignettes',
]

// The client's own photos from the live the-mingle.com (public/images/live). Replace any of them from Admin → Pages / Services.
const live = (file: string) => `/images/live/${file}`
export const defaultImages: Record<string, string> = {
  heroImage: live('the-mingle-events.jpg'),
  introImage: live('the-mingle.jpg'),
  aboutImage: live('the-mingle-events.jpg'),
  pricingImage: live('the-mingle-bike.jpg'),
  pricingStartingPrice: '$800 plus supplies',
}

// Shown on /gallery until real photos are uploaded to Admin → Gallery.
export const defaultGallery = [
  'pop-pop-fizz.jpg', 'bliss-bar.jpg', '19th-hole.jpg', 'celebrations.jpg', 'boot-scoot.jpg', 'a-little-romance.png', 'bark-bar.jpg',
  'bark-bar-cart-with-dogs.jpg', 'bark-bar-bone-sign-side-view.jpg', 'bark-bar-treats-display.jpg', 'bark-bar-birthday-party.jpg',
  'celebrations-kids-birthday-party.jpg', 'celebrations-party-scene.jpg', 'romance-candlelit-proposal.jpg',
].map((f) => ({ url: live(f), filename: f }))

export const defaultServices = [
  { name: 'Curated Carts', slug: 'curated-carts', image: live('pop-pop-fizz.jpg'), startingPrice: 'Most start at approximately $800 plus supplies', featured: true, sortOrder: 1, active: true,
    description: 'Beautifully styled carts built around food and games — curated for your event, your guests and your vision.' },
  { name: 'Bliss Bar', slug: 'bliss-bar', image: live('bliss-bar.jpg'), startingPrice: '', featured: true, sortOrder: 2, active: true,
    description: 'A build-your-own takeaway experience where guests curate their own swag bag to carry the celebration home.' },
  { name: 'Petal Passion', slug: 'petal-passion', image: live('a-little-romance.png'), startingPrice: '', featured: true, sortOrder: 3, active: true,
    description: 'Our flower bar. Guests create their own floral moment, arranged with intention and made to be remembered.' },
  { name: 'Interactive Experiences', slug: 'interactive-experiences', image: live('19th-hole.jpg'), startingPrice: '', featured: false, sortOrder: 4, active: true,
    description: 'Interactive stations that get guests mingling, playing and creating together — fun by design.' },
  { name: 'Event Vignettes', slug: 'event-vignettes', image: live('celebrations.jpg'), startingPrice: '', featured: false, sortOrder: 5, active: true,
    description: 'Beautiful, creative and interactive setups styled to make your event extra special and unforgettable.' },
]

// Only answers supported by client-provided information. Everything else is added from Admin → FAQ.
export const defaultFaqs = [
  { question: 'What kinds of events do you serve?', sortOrder: 1, active: true,
    answer: 'Weddings and bridal celebrations, corporate and HR events, schools, churches, grand openings and special events for local businesses in the Kansas City area.' },
  { question: 'Can an experience be customized?', sortOrder: 2, active: true,
    answer: 'Yes. Every Mingle experience is curated around your event, your guests and your vision.' },
  { question: 'How does pricing work?', sortOrder: 3, active: true,
    answer: 'Most curated carts start at approximately $800 plus supplies. We will customize a price plan around your budget, and your final quote is confirmed in a custom proposal.' },
  { question: 'How do I book?', sortOrder: 4, active: true,
    answer: 'Send an inquiry through our booking page, or call, text or WhatsApp us at 913-706-2347. We will follow up to talk through your vision.' },
  { question: 'How do I pay a deposit?', sortOrder: 5, active: true,
    answer: 'Once your experience is confirmed, we will send you a secure link to pay your deposit online.' },
]

export const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '')
