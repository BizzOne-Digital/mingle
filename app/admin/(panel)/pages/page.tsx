import { PagesEditor } from '@/components/admin'

export default function PagesAdmin() {
  return (
    <>
      <h1>Pages &amp; text</h1>
      <p className="sub">Headings, paragraphs and images for every page of the website. Each section saves on its own and goes live straight away.</p>
      <PagesEditor />
    </>
  )
}
