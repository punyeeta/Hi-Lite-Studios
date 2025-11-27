import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MagazineCard from '@/components/cards/MagazineCard'
import MagazineCardSkeleton from '@/components/cards/MagazineCardSkeleton'
import { useMagazine } from '@/context/MagazineContext'
import { fetchBlogStoryById } from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'

const Magazine = () => {
  const { id } = useParams<{ id?: string }>()
  const { items, loading } = useMagazine()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string; image: string; excerpt: string; content: string } | null>(null)
  const [loadingArticle, setLoadingArticle] = useState(false)

  // Fetch full article content when viewing a single article
  useEffect(() => {
    if (id && !loading) {
      const item = items.find((item) => item.id === id)
      if (item) {
        // If content is empty (from lightweight query), fetch full content
        if (!item.content) {
          setLoadingArticle(true)
          fetchBlogStoryById(parseInt(id, 10))
            .then((story) => {
              setSelectedItem({
                id: story.id.toString(),
                title: story.title,
                image: story.cover_image || '',
                excerpt: story.excerpt || '',
                content: story.content,
              })
            })
            .catch((err) => {
              console.error('Error loading article:', err)
            })
            .finally(() => {
              setLoadingArticle(false)
            })
        } else {
          // Content already available
          setSelectedItem(item)
        }
      } else {
        setSelectedItem(null)
      }
    } else if (!id) {
      setSelectedItem(null)
    }
  }, [id, items, loading])

  return (
    <div className="min-h-screen bg-[#e5e5e5] py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-extrabold text-[#222222]">
              Hi‑Lite: <span className="font-extrabold">Magazine</span>
            </h1>
            <p className="mt-2 text-sm text-[#555555]">
              A space for stories, snapshots, and the art behind every frame.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="self-start rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-5 py-2 text-sm font-semibold text-[#222222] transition hover:bg-[#222222] hover:text-white"
          >
            Back to Home
          </button>
        </header>

        {loading ? (
          // Show skeleton loaders while loading
          <section className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <MagazineCardSkeleton key={`skeleton-${index}`} />
            ))}
          </section>
        ) : selectedItem ? (
          loadingArticle ? (
            // Show skeleton for article while loading full content
            <article className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] animate-pulse">
              <div className="aspect-16/7 w-full bg-gray-300" />
              <div className="space-y-4 px-8 py-8 md:px-10">
                <div className="h-8 w-3/4 bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-px w-full bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-4/6 bg-gray-200 rounded" />
                </div>
              </div>
            </article>
          ) : (
            <article className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="aspect-16/7 w-full overflow-hidden bg-gray-200">
                <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-4 px-8 py-8 md:px-10">
                <h2 className="text-3xl font-semibold text-[#222222]">{selectedItem.title}</h2>
                <p className="text-sm text-[#666666]">{selectedItem.excerpt}</p>
                <div className="h-px w-full bg-gray-200" />
                <p className="text-base leading-relaxed text-[#333333] whitespace-pre-line">
                  {selectedItem.content}
                </p>
              </div>
            </article>
          )
        ) : (
          <section className="grid gap-6 md:grid-cols-3">
            {items.length > 0 ? (
              items.map((item) => (
                <MagazineCard
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  excerpt={item.excerpt}
                  onClick={() => navigate(`/magazine/${item.id}`)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-lg text-[#666666]">No magazine articles found.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default Magazine




