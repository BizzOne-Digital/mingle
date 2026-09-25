export const site = {
  name: 'The Mingle',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://the-mingle.com').replace(/\/$/, ''),
  phone: '+1 913-706-2347',
  phoneHref: 'tel:+19137062347',
  whatsappHref: 'https://wa.me/19137062347',
  email: 'info@themingle.com',
  emailHref: 'mailto:info@themingle.com',
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

// Temporary imagery carried over from the current build. Replace any of it from Admin → Pages / Services.
export const defaultImages: Record<string, string> = {
  heroImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2200&q=85',
  introImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85',
  aboutImage: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85',
  pricingImage: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=85',
  pricingStartingPrice: '$800 plus supplies',
}

export const defaultServices = [
  { name: 'Curated Carts', slug: 'curated-carts', image: defaultImages.pricingImage, startingPrice: 'Most start at approximately $800 plus supplies', featured: true, sortOrder: 1, active: true,
    description: 'Beautifully styled carts built around food and games — curated for your event, your guests and your vision.' },
  { name: 'Bliss Bar', slug: 'bliss-bar', image: defaultImages.introImage, startingPrice: '', featured: true, sortOrder: 2, active: true,
    description: 'A build-your-own takeaway experience where guests curate their own swag bag to carry the celebration home.' },
  { name: 'Petal Passion', slug: 'petal-passion', image: defaultImages.aboutImage, startingPrice: '', featured: true, sortOrder: 3, active: true,
    description: 'Our flower bar. Guests create their own floral moment, arranged with intention and made to be remembered.' },
  { name: 'Interactive Experiences', slug: 'interactive-experiences', image: defaultImages.heroImage, startingPrice: '', featured: false, sortOrder: 4, active: true,
    description: 'Interactive stations that get guests mingling, playing and creating together — fun by design.' },
  { name: 'Event Vignettes', slug: 'event-vignettes', image: defaultImages.introImage, startingPrice: '', featured: false, sortOrder: 5, active: true,
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
