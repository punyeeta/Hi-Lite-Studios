import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import MagazineCard from '@/components/cards/MagazineCard'
import MagazineCardSkeleton from '@/components/cards/MagazineCardSkeleton'
import MagazineFeatured from '@/components/sections/MagazineFeatured'
import MagazineGrid from '@/components/sections/MagazineGrid'
import MagazineSearchResults from '@/components/sections/MagazineSearchResults'
import { EngagementForm } from '@/components/common/EngagementForm'
import { EngagementItem } from '@/components/common/EngagementItem'
import StarBlack from '@/assets/images/StarBlack.png'
import { useMagazineStore } from '@/store/magazineStore'
import { useMagazineEngagement } from '@/utils/useMagazineEngagement'
import BorderBlue from '@/assets/images/BorderBlue.png'

const Magazine = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  
  // Zustand store
  const { items, loading, articleLoading, articleCache, currentPage, totalPages, searchQuery, fetchItems, searchItems, setCurrentPage, setSearchQuery, fetchArticleById } = useMagazineStore()
  const selectedItem = id ? articleCache.get(id) || null : null

  // Magazine engagement (reactions and comments)
  const engagement = useMagazineEngagement({
    blogStoryId: id ? parseInt(id, 10) : 0,
  })

  const [isSubmittingEngagement, setIsSubmittingEngagement] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [pinnedItem, setPinnedItem] = useState<any>(null)

  // Search only on Enter or button click
  const handleSearchSubmit = useCallback(async () => {
    if (inputValue.trim()) {
      setSearchQuery(inputValue)
      await searchItems(inputValue, 1)
    } else {
      setSearchQuery('')
      await fetchItems(1)
    }
  }, [inputValue, searchItems, fetchItems, setSearchQuery])

  // Handle typing - just update input, no search
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }, [handleSearchSubmit])



  // Fetch all items on mount
  useEffect(() => {
    if (!id) {
      fetchItems(1)
    }
  }, [id, fetchItems])

  // Fetch single article when ID changes
  useEffect(() => {
    if (id) {
      fetchArticleById(id)
    }
  }, [id, fetchArticleById])

  // Load reactions and comments when article is selected
  useEffect(() => {
    if (id) {
      engagement.loadEngagements()
    }
  }, [id])

  // Cache the pinned item when items first load
  useEffect(() => {
    if (!searchQuery && items.length > 0) {
      const pinned = items.find((item: any) => item.is_pinned)
      if (pinned) {
        setPinnedItem(pinned)
      }
    }
  }, [items, searchQuery])



  const handleEngagementSubmit = async (reactionType: any, content: string) => {
    setIsSubmittingEngagement(true)
    try {
      await engagement.createEngagement(reactionType, content)
    } finally {
      setIsSubmittingEngagement(false)
    }
  }

  const handleDeleteEngagement = async (engagementId: number) => {
    if (confirm('Are you sure you want to delete this?')) {
      await engagement.deleteEngagement(engagementId)
    }
  }

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [setCurrentPage])

  // Use cached pinned item, or find from current items
  const featuredItem = pinnedItem || (items.find((item: any) => item.is_pinned) || (items.length > 0 ? items[0] : null))
  // Grid items exclude the featured item
  const gridItems = items.filter((item: any) => item.id !== featuredItem?.id).slice(0, 3)

  return (
    <div className="page-fade min-h-screen bg-white py-12 pb-50">
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
              {/* Top spacing and X close button on right */}
              <div className="relative px-10 md:px-16">
                <button
                  type="button"
                  onClick={() => navigate('/magazine')}
                  aria-label="Close"
                  className="absolute right-0 top-0 rounded-full border border-[#222222] w-9 h-9 text-[#222222] flex items-center justify-center hover:bg-[#222222] hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Title and published date above the cover image */}
              <div className="px-10 md:px-16 max-w-5xl mx-auto w-full">
                <h2 className="text-4xl font-semibold text-[#333333]">{selectedItem.title}</h2>
                {selectedItem.created_at && (
                  <p className="mt-1 text-sm text-[#666666]">
                    {new Date(selectedItem.created_at as any).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Cover image section */}
              <div className="w-full flex justify-center py-8 px-10 md:px-16">
                <img src={selectedItem.cover_image || ''} alt={selectedItem.title} className="max-w-3xl w-full h-auto object-contain rounded-xl" />
              </div>
              {/* Border Blue below image */}
              <div className="flex justify-center px-10 md:px-16">
                <img src={BorderBlue} alt="border-blue" className="w-full max-w-4xl h-auto" />
              </div>

              {/* Story/description content */}
              <div 
                className="text-base leading-relaxed text-[#333333] max-w-4xl mx-auto px-10 md:px-16"
                style={{
                  '--tw-prose-body': '#333333',
                } as React.CSSProperties}
              >
                <style>{`
                  .prose-content img {
                    max-width: 90%;
                    max-height: 500px;
                    height: auto;
                    width: auto;
                    margin: 2rem auto;
                    display: block;
                    border-radius: 0.75rem;
                    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
                  }
                  .prose-content h1 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: #333333;
                    margin-bottom: 1rem;
                    text-align: justify;
                  }
                  .prose-content h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #333333;
                    margin-bottom: 0.75rem;
                    text-align: justify;
                  }
                  .prose-content h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #333333;
                    margin-bottom: 0.5rem;
                    text-align: justify;
                  }
                  .prose-content p {
                    color: #444444;
                    margin-bottom: 1rem;
                    line-height: 1.625;
                    text-align: justify;
                  }
                  .prose-content strong {
                    font-weight: 600;
                    color: #222222;
                  }
                  .prose-content em {
                    font-style: italic;
                    color: #444444;
                  }
                  .prose-content a {
                    color: #2563eb;
                    text-decoration: underline;
                  }
                  .prose-content a:hover {
                    color: #1d4ed8;
                  }
                  .prose-content ul {
                    list-style-type: disc;
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                  }
                  .prose-content ol {
                    list-style-type: decimal;
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                  }
                  .prose-content li {
                    color: #444444;
                    margin-bottom: 0.5rem;
                  }
                `}</style>
                <div 
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                />
              </div>

              {/* Divider line with centered star after story */}
              <div className="relative w-full left-1/2 right-1/2 -translate-x-1/2 my-10 px-10 md:px-16">
                <div className="h-px w-full bg-black" />
                <img src={StarBlack} alt="star-black" className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 h-10 w-10" />
              </div>

              {/* Feedback Section */}
              <div className="max-w-4xl mx-auto space-y-8 px-10 md:px-16">
                <EngagementForm
                  onSubmit={handleEngagementSubmit}
                  isLoading={isSubmittingEngagement}
                />

                {/* Divider before past comments */}
                <div className="relative w-full left-1/2 right-1/2 -translate-x-1/2">
                  <div className="h-px w-full bg-black" />
                  <img src={StarBlack} alt="star-black" className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 h-10 w-10" />
                </div>

                {/* Past Comments Section */}
                <div className="space-y-4">
                  {engagement.loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-12 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : engagement.engagements.length > 0 ? (
                    <>
                      <p className="text-sm font-semibold text-gray-700">
                        {engagement.engagements.length} {engagement.engagements.length === 1 ? 'Feedback' : 'Feedback'}
                      </p>
                      <div className="space-y-2">
                        {engagement.engagements.map((item) => (
                          <EngagementItem
                            key={item.id}
                            engagement={item}
                            onDelete={handleDeleteEngagement}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-center py-12 text-gray-500">
                      No feedback yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>
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

            {loading && !pinnedItem ? (
              // Show skeleton loaders only during initial load (when no pinned item yet)
              <section className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <MagazineCardSkeleton key={`skeleton-${index}`} />
                ))}
              </section>
            ) : (
              <>
                {/* Featured Story Card - Isolated Component */}
                <MagazineFeatured pinnedItem={featuredItem} />

                {/* Search Bar and Grid Title */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 ml-4 mt-6">
                  <h3 className="text-4xl font-bold text-[#333333] italic ">Latest Stories</h3>
                  <div className="w-full md:w-64 relative">
                    <input
                      type="text"
                      placeholder="Search stories..."
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full px-4 py-2 border-2 border-[#222222] rounded-full focus:outline-none focus:ring-2 focus:ring-[#c21205] focus:ring-offset-2"
                    />
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#333333] transition"
                    >
                      <Search className="w-5 h-5 text-[#666666]" />
                    </button>
                  </div>
                </div>

                {/* Grid Section */}
                {searchQuery ? (
                  // Show search results in isolated component
                  <MagazineSearchResults />
                ) : (
                  // Show regular grid in isolated component
                  <MagazineGrid gridItems={gridItems} />
                )}

                {/* Pagination */}
                {!searchQuery && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-[#222222] rounded hover:bg-[#222222] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-2 rounded ${currentPage === i + 1 ? 'bg-[#222222] text-white' : 'border border-[#222222] hover:bg-gray-100'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-[#222222] rounded hover:bg-[#222222] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Magazine
