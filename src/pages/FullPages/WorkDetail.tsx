import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useWorksStore } from '@/store/worksStore'

const WorkDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [expandedDescription, setExpandedDescription] = useState(false)
  const { workCache, workLoading: loading, fetchWorkById } = useWorksStore()
  const work = id ? workCache.get(id) : null

  useEffect(() => {
    if (!id) {
      navigate('/works')
      return
    }
    fetchWorkById(id)
  }, [id, navigate, fetchWorkById])

  const MAX_DESCRIPTION_LENGTH = 150
  const shouldTruncate = work?.description && work.description.length > MAX_DESCRIPTION_LENGTH
  const displayDescription = !expandedDescription && shouldTruncate && work?.description
    ? work.description.substring(0, MAX_DESCRIPTION_LENGTH).trim() + '...' 
    : work?.description

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-6 px-6">
        <button
          type="button"
          onClick={() => navigate('/works')}
          className="rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white mb-8"
        >
          ← Back to Works
        </button>
        <div className="space-y-8">
          {/* Image skeleton */}
          <div className="w-full flex justify-center py-8">
            <div className="w-96 h-72 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          {/* Title skeleton */}
          <div className="max-w-4xl mx-auto px-8">
            <div className="h-10 w-2/3 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-6" />
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && !work) {
    return (
      <div className="min-h-screen bg-white pt-6 px-6">
        <button
          type="button"
          onClick={() => navigate('/works')}
          className="rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white mb-8"
        >
          ← Back to Works
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Work not found
        </div>
      </div>
    )
  }

  if (!work) return null

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="pt-6 px-6">
        <button
          type="button"
          onClick={() => navigate('/works')}
          className="rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white"
        >
          ← Back to Works
        </button>
      </div>

      <div className="w-full flex justify-center py-8">
        <img src={work.main_image_url || ''} alt={work.label_1 || 'Work'} className="max-w-2xl h-auto object-contain" />
      </div>

      <div className="space-y-4 px-8 py-8 md:px-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-[#333333]">{work.label_1 || 'Work'}</h2>
        
        {/* Date */}
        {work.date && (
          <p className="text-base text-[#666666]">
            {new Date(work.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}

        {/* Secondary Label */}
        {work.label_2 && (
          <p className="text-base text-[#666666] font-semibold">
            {work.label_2}
          </p>
        )}

        <div className="h-px w-full bg-gray-200" />
      </div>

      {/* Description Section with Magazine-style alignment */}
      {work.description && (
        <div className="text-base leading-relaxed text-[#333333] max-w-4xl mx-auto px-8 md:px-10">
          <style>{`
            .work-description {
              color: #444444;
              line-height: 1.625;
              text-align: justify;
            }
          `}</style>
          <div className="work-description">
            {displayDescription}
          </div>
          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setExpandedDescription(!expandedDescription)}
              className="mt-3 px-4 py-1 text-sm font-semibold text-[#c21205] hover:text-[#a01604] transition"
            >
              {expandedDescription ? 'See Less' : 'See More'}
            </button>
          )}
        </div>
      )}

      {/* Gallery Section */}
      {work.media && work.media.length > 0 && (
        <div className="mt-12 space-y-6 px-8 md:px-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#333333]">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {work.media.map((media) => (
              <div key={media.id} className="overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={media.image_url}
                  alt="Gallery"
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkDetail
