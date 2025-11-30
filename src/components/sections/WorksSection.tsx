import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RecentHeader from '@/assets/images/RecentHeader.png'
import StarTopLeft from '@/assets/images/StarTL.png'
import StarBottomRight from '@/assets/images/StarBR.png'
import { useWorksStore } from '@/store/worksStore'
import { useIntersectionObserver } from '@/utils/useIntersectionObserver'

const WorksSection = () => {
  const navigate = useNavigate()
  const { items, loading, error, fetchItems } = useWorksStore()
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    if (isVisible) {
      fetchItems(8)
    }
  }, [isVisible, fetchItems])

  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="16" font-family="sans-serif"%3EImage Placeholder%3C/text%3E%3C/svg%3E'

  // Show skeleton loaders while loading, otherwise show loaded items
  const displayWorks = items.length > 0 ? items : []
  const showSkeletons = loading && items.length === 0

  const handleViewMore = () => {
    navigate('/works')
  }

  return (
    <section ref={ref} id="works" className="relative w-full bg-white md:px-8 py-8 overflow-hidden">
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

          {/* View More Button */}
          <button
            onClick={handleViewMore}
            className="bg-linear-to-r from-[#F2322E] to-[#AA1815] hover:bg-red-700 text-white px-10 py-2 rounded-ee-2xl rounded-tl-2xl font-bold text-xl transition-colors shadow-md hover:shadow-lg"
          >
            View More
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            Error: {error}
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {showSkeletons ? (
            // Show skeleton loaders while loading
            Array.from({ length: 8 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex flex-col">
                <div className="aspect-square w-full bg-gray-200 rounded-lg animate-pulse" />
                <div className="mt-2 h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))
          ) : (
            // Show loaded works
            displayWorks.map((work) => (
              <div 
                key={work.id} 
                className="flex flex-col cursor-pointer group"
                onClick={() => navigate(`/works/${work.id}`)}
              >
                <div className="aspect-square w-full bg-gray-100 overflow-hidden rounded-lg">
                  <img
                    src={work.main_image_url || placeholderImage}
                    alt={work.label_1 || 'Work'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Label - Below Image */}
                {work.label_1 && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-600 group-hover:text-gray-900 transition-colors">
                    {work.label_1}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default WorksSection

