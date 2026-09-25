// One field spec drives server validation, Mongoose schemas and the admin forms.
// Pure module (no imports) so it is safe on the client and in the self-check script.

export type FieldType = 'text' | 'textarea' | 'slug' | 'email' | 'tel' | 'number' | 'bool' | 'date' | 'select' | 'image'
export type Field = { name: string; label: string; type: FieldType; required?: boolean; max?: number; options?: string[]; help?: string; default?: unknown }
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
    label: 'Services', model: 'Service', folder: 'products', unique: 'slug', sort: { sortOrder: 1, createdAt: 1 }, columns: ['name', 'startingPrice', 'active'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, max: 80 },
      { name: 'slug', label: 'Slug', type: 'slug', required: true, max: 80, help: 'Lowercase words separated by hyphens, e.g. bliss-bar' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, max: 800 },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'startingPrice', label: 'Starting price (optional)', type: 'text', max: 80, help: 'Leave blank if this experience has no published price.' },
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
  team: {
    label: 'Team', model: 'TeamMember', folder: 'pages', sort: { sortOrder: 1, createdAt: 1 }, columns: ['name', 'role', 'active'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, max: 100 },
      { name: 'role', label: 'Role', type: 'text', max: 100 },
      { name: 'bio', label: 'Bio', type: 'textarea', max: 2000 },
      { name: 'image', label: 'Photo', type: 'image' },
      sortOrder, active,
    ],
  },
  blogs: {
    label: 'Blogs', model: 'BlogPost', folder: 'pages', unique: 'slug', sort: { publishedAt: -1, createdAt: -1 }, columns: ['title', 'published', 'publishedAt'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, max: 150 },
      { name: 'slug', label: 'Slug', type: 'slug', required: true, max: 120 },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', max: 400 },
      { name: 'content', label: 'Content', type: 'textarea', max: 50000, help: 'Separate paragraphs with a blank line.' },
      { name: 'image', label: 'Cover image', type: 'image' },
      { name: 'published', label: 'Published', type: 'bool', default: false },
      { name: 'publishedAt', label: 'Publish date', type: 'date' },
      { name: 'author', label: 'Author', type: 'text', max: 100 },
      { name: 'seoTitle', label: 'SEO title', type: 'text', max: 70 },
      { name: 'seoDescription', label: 'SEO description', type: 'textarea', max: 170 },
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

// Admin-editable page images and pricing copy (stored as key/value Settings).
export const settingsFields: Field[] = [
  { name: 'heroImage', label: 'Home — hero image', type: 'image' },
  { name: 'heroSecondImage', label: 'Home — image under the hero (hidden until uploaded)', type: 'image' },
  { name: 'introImage', label: 'Home — introduction image', type: 'image' },
  { name: 'aboutImage', label: 'About page image', type: 'image' },
  { name: 'pricingImage', label: 'Pricing page image', type: 'image' },
  { name: 'pricingStartingPrice', label: 'Curated carts starting price', type: 'text', max: 80, help: 'Shown as "Most curated carts start at approximately …"' },
]

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
