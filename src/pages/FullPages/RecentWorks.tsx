import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import RecentHeader from '@/assets/images/RecentHeader.png'
import StarTopLeft from '@/assets/images/StarTL.png'
import StarBottomRight from '@/assets/images/StarBR.png'
import { useWorksStore } from '@/store/worksStore'

const RecentWorks = () => {
  const navigate = useNavigate()
  const { items: works, loading, error, fetchItems } = useWorksStore()

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="pt-6 pl-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white"
        >
          ← Back to Home
        </button>
      </div>

      <section id="works" className="relative w-full bg-white md:px-8 py-8 overflow-hidden">
        {/* Decorative Top Left */}
        <div className="absolute top-[-150px] left-[-275px] w-[600px] h-[600px] object-contain">
          <img
            src={StarTopLeft}
            alt="Star top left"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Decorative Bottom Right */}
        <div className="absolute bottom-[-300px] right-[-275px] w-[600px] h-[600px] object-contain">
          <img
            src={StarBottomRight}
            alt="Star bottom right"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="mb-2">
              <img
                src={RecentHeader}
                alt="Recent Works"
                className="h-auto w-auto max-w-md mx-auto"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
              Error: {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : works.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No works found yet.</p>
            </div>
          ) : (
            /* Image Grid - 2x4 */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {works.map((work) => (
                <div 
                  key={work.id} 
                  className="flex flex-col cursor-pointer group"
                  onClick={() => navigate(`/works/${work.id}`)}
                >
                  <div className="aspect-square w-full bg-gray-100 overflow-hidden rounded-lg">
                    <img
                      src={work.main_image_url || ''}
                      alt={work.label_1 || 'Work'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  {/* Label - Below Image */}
                  {work.label_1 && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-600 group-hover:text-gray-900 transition-colors">
                      {work.label_1}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default RecentWorks
