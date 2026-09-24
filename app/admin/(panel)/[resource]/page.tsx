import { notFound } from 'next/navigation'
import { CrudManager } from '@/components/admin'
import { resources } from '@/lib/content'

const intro: Record<string, string> = {
  services: 'Experiences shown on the Services, Pricing and Home pages. Featured services appear on the home page.',
  testimonials: 'Only add real client testimonials. Featured ones also appear on the home page.',
  faqs: 'Questions and answers shown on the FAQ page.',
  team: 'Team members shown on the Our Team page.',
  blogs: 'Posts appear on /blogs only when "Published" is checked.',
}

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params
  if (!intro[resource]) notFound()
  return <><h1>{resources[resource].label}</h1><p className="sub">{intro[resource]}</p><CrudManager resource={resource} /></>
}
