import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import MagazineCard from '@/components/cards/MagazineCard'
import MagazineCardSkeleton from '@/components/cards/MagazineCardSkeleton'
import StarBlack from '@/assets/images/StarBlack.png'
import { useMagazine } from '@/context/MagazineContext'
import { fetchBlogStoryById } from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'

const Magazine = () => {
  const { id } = useParams<{ id?: string }>()
  const { items, loading } = useMagazine()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string; image: string; excerpt: string; content: string } | null>(null)
  const [loadingArticle, setLoadingArticle] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredItem = filteredItems.length > 0 ? filteredItems[0] : null
  const gridItems = filteredItems.slice(1, 4)

  return (
    <div className="min-h-screen bg-white py-12 pb-50">
      <div className="flex w-full flex-col gap-12 px-22">
        {/* Header with Title and Divider */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="flex items-center justify-center gap-1 text-7xl md:text-7xl font-semibold text-[#333333]">
            <span>Hi‑Lite</span>
            <img
              src={StarBlack}
              alt="star-black"
              className="inline-block h-[1em] w-[1em] align-middle"
            />
            <span>Magazine</span>
          </h1>

          <p className="text-base md:text-lg text-[#444444] max-w-2xl">
            A visual diary of shoots, ideas, and the creative journeys that shape our work.
          </p>
            <div className="relative w-full flex flex-col items-center pt-8">
              {/* Top line */}
              <div className="relative w-full mb-8">
                  <div className="-mx-22 h-0.5 w-screen bg-black" />
                  <img
                  src={StarBlack}
                  alt="star-black"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16"
                  />
              </div>
            </ div>
        </div>

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
            <>
              <button
                type="button"
                onClick={() => navigate('/magazine')}
                className="self-start rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-5 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white"
              >
                ← Back to Magazine
              </button>
              <article className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <div className="aspect-16/7 w-full overflow-hidden bg-gray-200">
                  <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-4 px-8 py-8 md:px-10">
                  <h2 className="text-3xl font-semibold text-[#333333]">{selectedItem.title}</h2>
                  <p className="text-sm text-[#666666]">{selectedItem.excerpt}</p>
                  <div className="h-px w-full bg-gray-200" />
                  <p className="text-base leading-relaxed text-[#333333] whitespace-pre-line">
                    {selectedItem.content}
                  </p>
                </div>
              </article>
            </>
          )
        ) : (
          <>
            {/* Featured Story Card */}
            {featuredItem && (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="md:w-2/5 overflow-hidden rounded-2xl aspect-video">
                  <img
                    src={featuredItem.image}
                    alt={featuredItem.title}
                    className="h-full w-full object-cover rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => navigate(`/magazine/${featuredItem.id}`)}
                  />
                </div>
                <div className="md:w-3/5 flex flex-col justify-center gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#333333]">
                    {featuredItem.title}
                  </h2>
                  <p className="text-base md:text-lg text-[#666666] line-clamp-3">
                    {featuredItem.excerpt}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/magazine/${featuredItem.id}`)}
                    className="self-start px-8 py-2 bg-[#222222] text-white font-semibold rounded-ee-2xl rounded-tl-2xl hover:bg-[#444444] transition"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            )}

            {/* Search Bar and Grid Title */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 ml-4 mt-6">
              <h3 className="text-4xl font-bold text-[#333333] italic ">Latest Stories</h3>
              <div className="w-full md:w-64 relative">
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#222222] rounded-full focus:outline-none focus:ring-2 focus:ring-[#c21205] focus:ring-offset-2"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
              </div>
            </div>

            {/* Grid Section */}
            <section className="grid gap-6 md:grid-cols-3 -mt-4">

              {gridItems.length > 0 ? (
                gridItems.map((item) => (
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
                  <p className="text-lg text-[#666666]">No stories found matching your search.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default Magazine