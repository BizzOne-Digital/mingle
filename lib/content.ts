// One field spec drives server validation, Mongoose schemas and the admin forms.
// Pure module (no imports) so it is safe on the client and in the self-check script.

export type FieldType = 'text' | 'textarea' | 'slug' | 'email' | 'tel' | 'number' | 'bool' | 'date' | 'select' | 'image'
export type Field = { name: string; label: string; type: FieldType; required?: boolean; max?: number; options?: string[]; help?: string; default?: unknown; group?: string }
export type Resource = { label: string; model: string; fields: Field[]; columns: string[]; sort: Record<string, 1 | -1>; folder: string; unique?: string }

export const INQUIRY_STATUSES = ['new', 'contacted', 'booked', 'completed', 'cancelled']
export const DEPOSIT_STATUSES = ['none', 'requested', 'paid']
export const EVENT_TYPES = ['Wedding or bridal event', 'Corporate or HR event', 'School event', 'Church event', 'Grand opening', 'Business special event', 'Private celebration', 'Other']
export const UPLOAD_FOLDERS = ['products', 'gallery', 'pages', 'misc']

const sortOrder: Field = { name: 'sortOrder', label: 'Sort order', type: 'number', default: 0, max: 10000 }
const active: Field = { name: 'active', label: 'Visible on website', type: 'bool', default: true }
const featured: Field = { name: 'featured', label: 'Featured', type: 'bool', default: false }

export const resources: Record<string, Resource> = {
  services: {
    label: 'Offerings', model: 'Service', folder: 'products', unique: 'slug', sort: { sortOrder: 1, createdAt: 1 }, columns: ['name', 'featured', 'active'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'slug', required: true, max: 80, help: 'Lowercase words separated by hyphens, e.g. bliss-bar' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'price', label: 'Price', type: 'text', max: 120, help: 'Shown on the offering page, e.g. "Micro lounges: $150 – $500, depending on the setup". Leave empty for "Custom quote".' },
      { name: 'photo1', label: 'Extra photo 1', type: 'image', help: 'Extra photos are shown on the offering page under the main image.' },
      { name: 'photo2', label: 'Extra photo 2', type: 'image' },
      { name: 'photo3', label: 'Extra photo 3', type: 'image' },
      { name: 'photo4', label: 'Extra photo 4', type: 'image' },
      featured, sortOrder, active,
    ],
  },
  testimonials: {
    label: 'Testimonials', model: 'Testimonial', folder: 'misc', sort: { sortOrder: 1, createdAt: -1 }, columns: ['name', 'eventType', 'active'],
    fields: [
      { name: 'name', label: 'Client name', type: 'text', required: true, max: 100 },
      { name: 'text', label: 'Testimonial', type: 'textarea', required: true, max: 1500 },
      { name: 'eventType', label: 'Event type', type: 'text', max: 100 },
      { name: 'image', label: 'Image', type: 'image' },
      featured, active, sortOrder,
    ],
  },
  faqs: {
    label: 'FAQ', model: 'Faq', folder: 'misc', sort: { sortOrder: 1, createdAt: 1 }, columns: ['question', 'active'],
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true, max: 200 },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true, max: 2000 },
      sortOrder, active,
    ],
  },
  inquiries: {
    label: 'Inquiries', model: 'Inquiry', folder: 'misc', sort: { createdAt: -1 }, columns: [],
    fields: [
      { name: 'name', label: 'Full name', type: 'text', required: true, max: 100 },
      { name: 'email', label: 'Email', type: 'email', required: true, max: 160 },
      { name: 'phone', label: 'Phone', type: 'tel', required: true, max: 30 },
      { name: 'eventType', label: 'Event type', type: 'select', required: true, options: EVENT_TYPES },
      { name: 'eventDate', label: 'Event date', type: 'date' },
      { name: 'guestCount', label: 'Approximate guest count', type: 'number', max: 100000 },
      { name: 'service', label: 'Experience', type: 'text', max: 120 },
      { name: 'budget', label: 'Budget', type: 'text', max: 60 },
      { name: 'message', label: 'Additional details', type: 'textarea', max: 3000 },
    ],
  },
}

// Everything on the public pages an admin can edit (Admin → Pages), stored as key/value Settings.
// `default` is the live wording, used until an admin saves a change. Image defaults live in lib/site.ts.
const ACCENT = 'Wrap words in *asterisks* to make them pink. Use | for a line break.'
const t = (group: string, name: string, label: string, def: string, max = 200, help?: string): Field => ({ group, name, label, type: 'text', max, default: def, help })
const p = (group: string, name: string, label: string, def: string, max = 2000, help?: string): Field => ({ group, name, label, type: 'textarea', max, default: def, help })
const img = (group: string, name: string, label: string, help?: string): Field => ({ group, name, label, type: 'image', help })

export const PAGE_GROUPS = ['Home', 'About', 'Offerings', 'Fun & Games', 'Pricing', 'Gallery', 'Testimonials', 'FAQ', 'Contact', 'Booking', 'Booking banner & footer']

export const settingsFields: Field[] = [
  t('Home', 'heroLabel', 'Hero — small label', 'Curated · Interactive · Unforgettable'),
  t('Home', 'heroTitle', 'Hero — headline', 'Unique, *curated* experiences for *your event.*', 140, ACCENT),
  p('Home', 'heroText', 'Hero — text', 'Beautiful curated carts for food and games, build-your-own takeaway bags, our Bliss Bar and our Petal Passion flower bar — made to make your event extra special.', 400),
  t('Home', 'heroNote', 'Hero — bottom line', 'Weddings · Corporate events · Grand openings · Celebrations across Kansas City'),
  img('Home', 'heroImage', 'Hero image', 'Leave empty to use the bride photo.'),
  img('Home', 'heroSecondImage', 'Image under the hero', 'Hidden until an image is uploaded.'),
  t('Home', 'welcomeLabel', 'Welcome — small label', 'Welcome to The Mingle'),
  t('Home', 'welcomeTitle', 'Welcome — heading', 'Fun. Creative.|*Unforgettable.*', 140, ACCENT),
  p('Home', 'welcomeText', 'Welcome — text', 'We specialize in fun, creative, interactive and beautiful vignettes — curated carts, build-your-own takeaway bags, the Bliss Bar and Petal Passion — to make your event extra special and absolutely unforgettable.', 600),
  p('Home', 'welcomeTagline', 'Welcome — highlighted line', 'Planning a wedding, a corporate event, a school or church gathering, or a grand opening? Let us make it fun, festive and unforgettable.', 300),
  img('Home', 'introImage', 'Welcome image'),
  t('Home', 'homeFunTitle', 'Fun & Games section — heading', 'Games your guests|*gather around.*', 140, ACCENT),
  p('Home', 'homeFunText', 'Fun & Games section — text', 'Curated carts for food and games and interactive stations that get guests mingling, playing and creating together — fun by design.', 400, 'The image is set under Fun & Games.'),

  img('About', 'aboutImage', 'Banner image'),
  t('About', 'aboutTitle', 'Heading', 'Experiences your guests take part in', 140),
  p('About', 'aboutText', 'Story', 'The Mingle creates beautiful curated carts for food and games. Guests can build their own swag bag or takeaway bag at our Bliss Bar, and create their own floral moment at Petal Passion, our flower bar.\n\nWe specialize in fun, creative, interactive and beautiful vignettes — each one curated around your event, your guests and the way you want them to feel.\n\nThe goal is simple: to make your event extra special and absolutely unforgettable.', 3000, 'Separate paragraphs with a blank line.'),
  p('About', 'aboutQuote', 'Quote', 'We specialize in fun, creative, interactive and beautiful vignettes to make your event extra special and absolutely *unforgettable.*', 400, ACCENT),

  t('About', 'leslieLabel', 'Meet Leslie — small label', 'Meet Leslie', 80),
  t('About', 'leslieTitle', 'Meet Leslie — heading', 'The mind behind *The Mingle*', 140, ACCENT),
  p('About', 'leslieText', 'Meet Leslie — story', "If we haven't met before, hi there! I'm Leslie Allison — whether you remember me as Clark and Cole's mom from Blue Valley North, spotted me at Fabulous Finds & Design, or know me as your South Johnson County neighbor of 35 years.\n\nI'm also the owner of Premium Cabinet Studio, and I bring extensive experience in corporate events to everything I do. Now I'm here to collaborate with you on creating unique, memorable experiences.\n\nWith a flair for detail, a love of fun, and an eye for smart design — I can't wait to meet you and make your event unforgettable.", 3000, 'Separate paragraphs with a blank line.'),
  img('About', 'leslieImage', 'Meet Leslie — photo', 'Portrait works best. The section shows text only until a photo is uploaded.'),

  t('Offerings', 'offeringsTitle', 'Heading', 'Choose your experience', 120),
  p('Offerings', 'offeringsIntro', 'Intro', 'Curated, interactive experiences designed around your event. Our menu continues to grow as new selections are added.', 400, 'Each offering is edited under Offerings.'),

  t('Fun & Games', 'funTitle', 'Heading', 'Affordable *luxury.*', 140, ACCENT),
  p('Fun & Games', 'funIntro', 'Intro', 'Curated carts for food and games and interactive stations that get guests mingling, playing and creating together — fun by design.', 2000, 'Put each sentence on its own line. Colons, exclamation points and dashes are shown in pink automatically, and so is "Goofy Golfer".'),
  img('Fun & Games', 'interactiveImage', 'Fun & Games image', 'Used on the Fun & Games page and the Home page section. Pick a photo where nobody\'s head is cut off at the top.'),
  t('Fun & Games', 'comingTitle', 'Coming soon — heading', 'Coming *Spring 2027*', 140, ACCENT),
  t('Fun & Games', 'comingName1', 'Coming soon 1 — name', "Cinderella's Carriage", 80),
  img('Fun & Games', 'comingImage1', 'Coming soon 1 — photo'),
  t('Fun & Games', 'comingName2', 'Coming soon 2 — name', 'Foam Parties', 80),
  img('Fun & Games', 'comingImage2', 'Coming soon 2 — photo'),
  t('Fun & Games', 'comingName3', 'Coming soon 3 — name', 'Glow-in-the-Dark Golf', 80),
  img('Fun & Games', 'comingImage3', 'Coming soon 3 — photo'),

  t('Pricing', 'pricingTitle', 'Heading', 'A price plan made for your event', 140),
  p('Pricing', 'pricingIntro', 'Intro', 'Every Mingle experience is curated for your event, so every price plan is too.', 400),
  p('Pricing', 'priceList', 'Price list', 'Carts | Starting at $500+\nPetal Passion | Starting at $200+\nSleepy Tee Pees | Starting at $100\n360 Video Station | Starting at $450\nFun & Games | $25 – $650\nA Little Romance | Starting at $800\nSitting Pretty | $150 – $500', 2000, 'One price per line: Name | Price. Each line becomes a card on the Pricing page.'),
  t('Pricing', 'pricingFootnote', 'Line under the prices', 'Customized packages are welcome — price will be determined during your consult.', 200),
  img('Pricing', 'pricingImage', 'Feature image'),
  p('Pricing', 'pricingQuote', 'Feature image caption', 'Every detail is curated around your guests, your vision and your budget.', 300),

  t('Gallery', 'galleryTitle', 'Heading', 'Endless *possibilities!*', 120, 'Also used for the gallery section on Home. Photos are managed under Gallery.'),
  p('Gallery', 'galleryIntro', 'Intro', 'A look at The Mingle experiences in action.', 300),

  t('Testimonials', 'testimonialsTitle', 'Heading', 'Kind words', 120),
  p('Testimonials', 'testimonialsIntro', 'Intro', 'What our clients say about celebrating with The Mingle.', 300),

  t('FAQ', 'faqTitle', 'Heading', 'Good to know', 120),
  p('FAQ', 'faqIntro', 'Intro', 'Everything you need to know before you book.', 300, 'Questions and answers are edited under FAQ.'),

  t('Contact', 'contactTitle', 'Heading', "Let's make it *happen.*", 140, ACCENT),
  p('Contact', 'contactIntro', 'Intro', 'Ready to book or just want to chat? Reach out — we would love to hear from you.', 300),

  t('Booking', 'bookingTitle', 'Heading', 'Your event, *your way.*', 140, ACCENT),
  p('Booking', 'bookingIntro', 'Intro', 'Share a little about what you are planning and we will take it from here.', 300),

  t('Booking banner & footer', 'ctaTitle', 'Closing banner — heading (every page)', "Let's plan your day.. *your way!*", 140, ACCENT),
  p('Booking banner & footer', 'ctaText', 'Closing banner — text', 'Tell us about your event and we will shape an experience around your guests, your vision and your budget.', 400),
  p('Booking banner & footer', 'footerText', 'Footer — brand statement', 'Unique, curated experiences for your event — curated carts, the Bliss Bar, Petal Passion and interactive vignettes that make every celebration unforgettable.', 400),

  // Page header photos (shown beside the page title).
  img('Offerings', 'offeringsHeadImage', 'Header image', 'Shown beside the page title. Leave empty to use the built-in photo.'),
  img('Pricing', 'pricingHeadImage', 'Header image', 'Shown beside the page title. Leave empty to use the built-in photo.'),
  img('Gallery', 'galleryHeadImage', 'Header image', 'Shown beside the page title. Leave empty to use the built-in photo.'),
  img('Testimonials', 'testimonialsHeadImage', 'Header image', 'Shown beside the page title. Leave empty to use the built-in photo.'),
  img('FAQ', 'faqHeadImage', 'Header image', 'Shown beside the page title. Leave empty to use the built-in photo.'),
  img('Contact', 'contactHeadImage', 'Header image', 'Shown beside the page title. Leave empty to use the built-in photo.'),
  img('Booking', 'bookingHeadImage', 'Header image', 'Shown beside the page title. Leave empty to use the built-in photo.'),

  // Built-in (live-site) gallery photos hidden from /gallery — managed in Admin → Gallery (no group: never shown in a form).
  { name: 'galleryHidden', label: 'Hidden gallery photos', type: 'textarea', max: 5000 },
]

export const settingsDefaults = Object.fromEntries(settingsFields.filter((f) => f.default !== undefined).map((f) => [f.name, String(f.default)]))

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TEL = /^[+\d\s().-]{7,30}$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// Uploaded images, the bundled live-site photos, legacy /uploads paths, or the Cloudinary host in next.config.
const IMAGE = /^(\/api\/uploads\/|\/images\/live\/|\/uploads\/|https:\/\/res\.cloudinary\.com\/)/

export function clean(fields: Field[], input: unknown, partial = false): { data?: Record<string, unknown>; error?: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Invalid request body.' }
  const body = input as Record<string, unknown>
  const data: Record<string, unknown> = {}
  for (const f of fields) {
    const v = body[f.name]
    if (v === undefined && partial) continue
    if (v === undefined || v === null || v === '') {
      if (f.required) return { error: `${f.label} is required.` }
      data[f.name] = f.type === 'bool' ? Boolean(f.default) : f.type === 'number' || f.type === 'date' ? null : ''
      continue
    }
    if (f.type === 'bool') {
      if (typeof v !== 'boolean') return { error: `${f.label} must be true or false.` }
      data[f.name] = v
    } else if (f.type === 'number') {
      const n = Number(v)
      if (!Number.isFinite(n) || n < 0 || n > (f.max ?? 1e9)) return { error: `${f.label} must be a valid number.` }
      data[f.name] = n
    } else if (f.type === 'date') {
      const d = new Date(String(v))
      if (typeof v !== 'string' || Number.isNaN(d.getTime())) return { error: `${f.label} must be a valid date.` }
      data[f.name] = d
    } else {
      if (typeof v !== 'string') return { error: `${f.label} must be text.` }
      const s = v.trim()
      if (!s && f.required) return { error: `${f.label} is required.` }
      if (s.length > (f.max ?? (f.type === 'textarea' ? 5000 : 300))) return { error: `${f.label} is too long.` }
      if (s && f.type === 'email' && !EMAIL.test(s)) return { error: 'Please enter a valid email address.' }
      if (s && f.type === 'tel' && !TEL.test(s)) return { error: 'Please enter a valid phone number.' }
      if (s && f.type === 'slug' && !SLUG.test(s)) return { error: `${f.label} may only contain lowercase letters, numbers and hyphens.` }
      if (s && f.type === 'select' && !f.options?.includes(s)) return { error: `Please choose a valid ${f.label.toLowerCase()}.` }
      if (s && f.type === 'image' && !IMAGE.test(s)) return { error: `${f.label} must be an uploaded image.` }
      data[f.name] = s
    }
  }
  return { data }
}

export const imageFields = (fields: Field[]) => fields.filter((f) => f.type === 'image').map((f) => f.name)
