import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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
  result: NewsItem[]
  message: string
  timestamp: string
}

async function getNews(): Promise<NewsItem[]> {
  const res = await fetch('/api/v1/news')
  const json = (await res.json()) as ApiResponse
  const code = json?.http?.code ?? 200

  if (json.http.code === 200) {
    return Array.isArray(json.result) ? json.result : []
  }

  if (json.http.code === 204) {
    return []
  }

  return json.result
}

// async function getNews() {
//   return [{ id: 1, slug: 'judul-1', title: 'Judul #1', date: '2025-08-18' }]
// }

export default async function BeritaPage() {
  const news = await getNews()

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Berita</h1>

      <ul className="space-y-4">
        {news.map((n) => (
          <li
            key={n.id}
            className="p-4 rounded-xl border"
          >
            <Link
              href={`/informasi/berita/${n.slug}`}
              className="text-lg font-medium hover:underline"
            >
              {n.title}
            </Link>
            <div className="text-sm opacity-70">
              {new Date(n.created_at).toLocaleDateString('id-ID')}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
