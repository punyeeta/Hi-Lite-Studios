import { useEffect, useState, useCallback } from 'react'
// import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import MagazineCardSkeleton from '@/components/cards/MagazineCardSkeleton'
import MagazineFeatured from '@/components/sections/MagazineFeatured'
import MagazineGrid from '@/components/sections/MagazineGrid'
import MagazineSearchResults from '@/components/sections/MagazineSearchResults'
import StarBlack from '@/assets/images/StarBlack.png'
import { useMagazineStore } from '@/store/magazineStore'
// import BorderBlue from '@/assets/images/BorderBlue.png'

const Magazine = () => {
  // const navigate = useNavigate()
  
  // Zustand store
  const { items, loading, currentPage, totalPages, searchQuery, fetchItems, searchItems, setCurrentPage, setSearchQuery } = useMagazineStore()

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
    fetchItems(1)
  }, [fetchItems])

  // Remove per-article effects from main listing page

  // Cache the pinned item when items first load
  useEffect(() => {
    if (!searchQuery && items.length > 0) {
      const pinned = items.find((item: any) => item.is_pinned)
      if (pinned) {
        setPinnedItem(pinned)
      }
    }
  }, [items, searchQuery])



  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [setCurrentPage])

  // Use cached pinned item, or find from current items
  const featuredItem = pinnedItem || (items.find((item: any) => item.is_pinned) || (items.length > 0 ? items[0] : null))
  // Grid items exclude the featured item
  const gridItems = items.filter((item: any) => item.id !== featuredItem?.id)

  return (
    <div className="page-fade min-h-screen bg-white py-12 pb-50">
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
          </div>
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
      </div>
    </div>
  )
}

export default Magazine
