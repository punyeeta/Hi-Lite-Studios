import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import HeaderWorks from '@/assets/images/HeaderWorks.png'
import StarTopLeft from '@/assets/images/StarTL.png'
import StarBottomRight from '@/assets/images/StarBR.png'
import { useWorksStore } from '@/store/worksStore'
import StarBlack from '@/assets/images/StarBlack.png'

const RecentWorks = () => {
  const navigate = useNavigate()
  const { items: works, loading, error, hasMore, fetchItems, loadMore } = useWorksStore()
  const [yearFilter, setYearFilter] = useState<string | 'all'>('all')
  const [serviceFilters, setServiceFilters] = useState<Set<'Indoor & Studio' | 'Outdoor & Events' | 'Videography'>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showYearPicker, setShowYearPicker] = useState(false)
  const ellipsisRef = useRef<HTMLDivElement | null>(null)
  const pickerRef = useRef<HTMLDivElement | null>(null)



  useEffect(() => {
    if (works.length === 0) {
      fetchItems(12)
    }
  }, [])

  const yearRange = useMemo(() => {
    const current = new Date().getFullYear()
    const start = Math.max(2020, current - 10)
    const set = new Set<number>()
    for (let y = current; y >= start; y--) set.add(y)
    works.forEach((w) => {
      if (w.date) {
        try {
          const y = new Date(w.date).getFullYear()
          if (y >= start || y > current) set.add(y)
        } catch {}
      }
    })
    return Array.from(set).sort((a, b) => b - a).map(String)
  }, [works])

  // Full picker years: include all from 2020..current plus any future/admin years present
  const pickerYears = useMemo(() => {
    const current = new Date().getFullYear()
    const base: number[] = Array.from({ length: current - 2019 }, (_, i) => 2020 + i)
    const fromData: number[] = []
    works.forEach((w) => {
      if (w.date) {
        try {
          const y = new Date(w.date).getFullYear()
          fromData.push(y)
        } catch {}
      }
    })
    const all = new Set<number>([...base, ...fromData])
    return Array.from(all).sort((a, b) => b - a)
  }, [works])

  // Close picker on outside click
  useEffect(() => {
    if (!showYearPicker) return
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (pickerRef.current && pickerRef.current.contains(target)) return
      if (ellipsisRef.current && ellipsisRef.current.contains(target)) return
      setShowYearPicker(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showYearPicker])

  const handleLoadMore = () => {
    loadMore(8)
  }

  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      const matchYear = yearFilter === 'all' ? true : (w.date ? new Date(w.date).getFullYear().toString() === yearFilter : false)
      const matchService = serviceFilters.size === 0 ? true : serviceFilters.has((w.label_1 as any))
      const matchSearch = searchQuery
        ? (w.description?.toLowerCase().includes(searchQuery.toLowerCase()) || (w.label_1 || '').toLowerCase().includes(searchQuery.toLowerCase()))
        : true
      return matchYear && matchService && matchSearch
    })
  }, [works, yearFilter, serviceFilters, searchQuery])

  return (
    <div className="page-fade min-h-screen bg-white">
      <section id="works" className="relative w-full bg-white md:px-8 py-8 overflow-hidden min-h-screen flex flex-col">
        {/* Decorative Top Left */}
        <div className="absolute top-[-150px] left-[-275px] w-[600px] h-[600px] object-contain">
          <img
            src={StarTopLeft}
            alt="Star top left"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Decorative Bottom Right */}
        <div className="absolute bottom-[-400px] right-[-350px] object-contain">
          <img
            src={StarBottomRight}
            alt="Star bottom right"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative z-10 w-full px-4 md:px-32 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="-mb-3">
              <img
                src={HeaderWorks}
                alt="Hi-Lite Collections"
                className="w-full max-w-4xl mx-auto h-auto"
              />
            </div>
            <p className="text-xl font-light text-[#1E1E1E] text-center mt-0">
              A curated look at the people and moments we’ve captured.
            </p>
          </div>

          {/* Top line */}
          <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-6 mt-12">
            <div className="h-0.5 w-screen bg-black" />
            <img src={StarBlack} alt="star-black" className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 h-14 w-14" />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-start justify-between gap-8 md:gap-10">
            <div className="min-w-[260px] mr-auto relative">
              <span className="block mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">By Year</span>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setYearFilter('all')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm border ${yearFilter === 'all'
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`}
                    aria-selected={yearFilter === 'all'}
                  >
                    All
                  </button>
                  {yearRange.slice(0, 5).map((y) => (
                    <button
                      key={`recent-${y}`}
                      type="button"
                      onClick={() => setYearFilter(y)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm border ${yearFilter === y
                        ? 'bg-linear-to-r from-[#291471] to-[#4E26D7] text-white border-[#291471]'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`}
                      aria-selected={yearFilter === y}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                {/* Row 2: Ellipsis + next 5 years */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div ref={ellipsisRef} className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setShowYearPicker((v) => !v)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm border ${showYearPicker
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`}
                      aria-label="Open year picker"
                      title="Pick a year"
                    >
                      ....
                    </button>
                    {showYearPicker && (
                      <div
                        ref={pickerRef}
                        className="absolute left-0 top-full mt-2 z-30 
                                    rounded-xl border border-gray-300 bg-white p-2 shadow-lg w-24 min-w-24 max-w-sm max-h-56 overflow-y-auto"
                          style={{
                            scrollbarWidth: 'thin',        // Firefox
                            scrollbarColor: '#ccc transparent', // Firefox
                          }}
                        >
                          {pickerYears.map((y) => (
                            <button

                            key={`picker-${y}`}
                            type="button"
                            onClick={() => { setYearFilter(String(y)); setShowYearPicker(false) }}
                            className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition ${yearFilter === String(y)
                              ? 'bg-gray-900 text-white'
                              : 'hover:bg-gray-100 text-gray-800'}`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {yearRange.slice(5, 10).map((y) => (
                    <button
                      key={`prev-${y}`}
                      type="button"
                      onClick={() => setYearFilter(y)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm border ${yearFilter === y
                        ? 'bg-linear-to-r from-[#291471] to-[#4E26D7] text-white border-[#291471]'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}`}
                      aria-selected={yearFilter === y}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                {/* Picker now rendered relative to ellipsis button above */}
              </div>
            </div>

            {/* By Service */}
            <div className="flex-1 min-w-[260px]">
              <span className="block mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">By Service</span>
              <div className="grid grid-cols-2 gap-2 max-w-md">
                {([
                  'Indoor & Studio',
                  'Outdoor & Events',
                  'Videography',
                ] as const).map((srv) => {
                  const selected = serviceFilters.has(srv)
                  const toggle = () => {
                    const next = new Set(serviceFilters)
                    if (selected) next.delete(srv)
                    else next.add(srv)
                    setServiceFilters(next)
                  }
                  const base = srv === 'Indoor & Studio'
                    ? { on: 'bg-[#4E26D7] text-white', off: 'bg-white text-[#291471] border border-[#291471] hover:bg-[#291471] hover:text-white' }
                    : srv === 'Outdoor & Events'
                      ? { on: 'bg-[#FBC93D] text-[#291471]', off: 'bg-white text-[#DD8F09] border border-[#FFC800] hover:bg-[#FFC800] hover:text-[#291471]' }
                      : { on: 'bg-[#F2322E] text-white', off: 'bg-white text-[#D42724] border border-[#D42724] hover:bg-[#D42724] hover:text-white' }
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={toggle}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm transition ${selected ? base.on : base.off}`}
                    >
                      {srv}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setServiceFilters(new Set())}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm transition border text-[#333333]"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Search bar on right */}
            <div className="flex-1 min-w-[220px] md:max-w-xs md:ml-auto">
              <span className="block mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">Search</span>
              <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-gray-500">
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom divider line */}
          <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-10 mt-6">
            <div className="h-0.5 w-screen bg-black" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
              Error: {error}
            </div>
          )}

          {/* Loading State */}
          {loading && works.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filteredWorks.length === 0 ? null : (
            <>
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {filteredWorks.map((work) => (
                  <div 
                    key={work.id} 
                    className="flex flex-col cursor-pointer group"
                    onClick={() => navigate(`/works/${work.id}`)}
                  >
                    <div className="aspect-square w-full bg-gray-100 overflow-hidden rounded-lg">
                      <img
                        src={work.main_image_url || ''}
                        alt={work.title || work.label_1 || 'Work'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                    {/* Title - Above Label */}
                    {work.title && (
                      <p className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {work.title}
                      </p>
                    )}
                    {/* Label - Below Image */}
                    {work.label_1 && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600 group-hover:text-gray-900 transition-colors">
                        {work.label_1}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8 mb-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-8 py-2 bg-[#333333] text-white font-semibold rounded-ee-2xl rounded-tl-2xl hover:bg-[#444444] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Load More ↓'}
                  </button>
                </div>
              )}
            </>
          )}
          {/* No works for selected year message */}
          {!loading && filteredWorks.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl md:text-3xl font-semibold text-gray-800">No works found for this year.</p>
            </div>
          )}
          {/* Extra bottom spacing for page uniformity */}
          <div className="h-24" />
        </div>
      </section>
    </div>
  )
}

export default RecentWorks
