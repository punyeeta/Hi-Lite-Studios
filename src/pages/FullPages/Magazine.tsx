import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import MagazineCard from '@/components/cards/MagazineCard'
import MagazineCardSkeleton from '@/components/cards/MagazineCardSkeleton'
import StarBlack from '@/assets/images/StarBlack.png'
import { useMagazineStore } from '@/store/magazineStore'

const Magazine = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Zustand store
  const { items, loading, articleLoading, articleCache, fetchItems, fetchArticleById } = useMagazineStore()
  const selectedItem = id ? articleCache.get(id) || null : null

  // Fetch all items on mount
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Fetch single article when ID changes
  useEffect(() => {
    if (id) {
      fetchArticleById(id)
    }
  }, [id, fetchArticleById])

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  const featuredItem = filteredItems.length > 0 ? filteredItems[0] : null
  const gridItems = filteredItems.slice(1, 4)

  return (
    <div className="min-h-screen bg-white py-12 pb-50">
      <div className="flex w-full flex-col gap-12 px-22">
        {/* If ID is present, always show article view */}
        {id ? (
          articleLoading || !selectedItem ? (
            // Show skeleton while loading
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
              <div className="w-full flex justify-center py-8">
                <img src={selectedItem.cover_image || ''} alt={selectedItem.title} className="max-w-2xl h-auto object-contain" />
              </div>
              <div className="space-y-4 px-8 py-8 md:px-10 max-w-4xl mx-auto">
                <h2 className="text-4xl font-semibold text-[#333333]">{selectedItem.title}</h2>
                {selectedItem.excerpt && (
                  <>
                    <p className="text-base text-[#666666]">{selectedItem.excerpt}</p>
                    <div className="h-px w-full bg-gray-200" />
                  </>
                )}
              </div>
              <div 
                className="text-base leading-relaxed text-[#333333] max-w-4xl mx-auto px-8 md:px-10"
              >
                <style>{`
                    .magazine-content img {
                      max-width: 90%;
                      max-height: 500px;
                      height: auto;
                      width: auto;
                      margin: 2rem auto;
                      display: block;
                      border-radius: 0.75rem;
                      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
                    }
                    .magazine-content h1 {
                      font-size: 1.875rem;
                      font-weight: 700;
                      color: #333333;
                      margin-bottom: 1rem;
                      margin-left: 0;
                      margin-right: 0;
                      text-align: justify;
                    }
                    .magazine-content h2 {
                      font-size: 1.5rem;
                      font-weight: 700;
                      color: #333333;
                      margin-bottom: 0.75rem;
                      margin-left: 0;
                      margin-right: 0;
                      text-align: justify;
                    }
                    .magazine-content h3 {
                      font-size: 1.25rem;
                      font-weight: 700;
                      color: #333333;
                      margin-bottom: 0.5rem;
                      margin-left: 0;
                      margin-right: 0;
                      text-align: justify;
                    }
                    .magazine-content p {
                      color: #444444;
                      margin-bottom: 1rem;
                      line-height: 1.625;
                      margin-left: 0;
                      margin-right: 0;
                      text-align: justify;
                    }
                    .magazine-content strong {
                      font-weight: 600;
                      color: #222222;
                      display: inline;
                    }
                    .magazine-content em {
                      font-style: italic;
                      color: #444444;
                      display: inline;
                    }
                    .magazine-content a {
                      color: #2563eb;
                      text-decoration: underline;
                    }
                    .magazine-content a:hover {
                      color: #1d4ed8;
                    }
                    .magazine-content ul {
                      list-style-type: disc;
                      margin-left: 1.5rem;
                      margin-bottom: 1rem;
                    }
                    .magazine-content ol {
                      list-style-type: decimal;
                      margin-left: 1.5rem;
                      margin-bottom: 1rem;
                    }
                    .magazine-content li {
                      color: #444444;
                      margin-bottom: 0.5rem;
                    }
                  `}</style>
                  <div 
                    className="magazine-content"
                    dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                  />
                </div>
            </>
          )
        ) : (
          <>
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
            ) : (
              <>
                {/* Featured Story Card */}
                {featuredItem && (
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div className="md:w-2/5 overflow-hidden rounded-2xl aspect-video">
                      <img
                        src={featuredItem.cover_image || ''}
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
                        image={item.cover_image || ''}
                        excerpt={item.excerpt || ''}
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
          </>
        )}
      </div>
    </div>
  )
}

export default Magazine
