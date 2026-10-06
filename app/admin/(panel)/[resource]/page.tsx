import { notFound } from 'next/navigation'
import { CrudManager } from '@/components/admin'
import { resources } from '@/lib/content'

const intro: Record<string, string> = {
  services: 'The experiences on the Offerings page, the moving strip on Home and the booking form. Featured offerings also appear on the Home page.',
  testimonials: 'Only add real client testimonials. Featured ones also appear on the home page.',
  faqs: 'Questions and answers shown on the FAQ page.',
}

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params
  if (!intro[resource]) notFound()
  return <><h1>{resources[resource].label}</h1><p className="sub">{intro[resource]}</p><CrudManager resource={resource} /></>
}
