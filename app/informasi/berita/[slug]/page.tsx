export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

type NewsItem = {
  id: number
  title: string
  slug: string
  content: string
  is_published: number
  is_deleted: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  created_by: number
  updated_by: number
  deleted_by: number | null
}

type ApiResponse = {
  http: {
    code: number
    message: string
  }
  result: NewsItem
  message: string
  timestamp: string
}

async function getNewsDetail(slug: string): Promise<NewsItem> {
  const res = await fetch(`http://localhost:8080/api/v1/news/${slug}`)

  if (!res.ok) {
    throw new Error(`failed to fetch news: ${res.status}`)
  }

  const json = (await res.json()) as ApiResponse
  return json.result
}

// async function getNewsDetail(slug: string) {
//   return {
//     title: `Judul: ${slug}`,
//     date: '2025-08-18',
//     content: 'some content',
//   }
// }

export async function generateMetadata({ params }: Props) {
  const n = await getNewsDetail(params.slug)
  return { title: n.title }
}

export default async function BeritaDetailPage({ params }: Props) {
  const n = await getNewsDetail(params.slug)

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">{n.title}</h1>
      <div className="text-sm opacity-70 mb-6">
        {new Date(n.created_at).toLocaleDateString('id-ID')}
      </div>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: n.content }}
      />
    </main>
  )
}
