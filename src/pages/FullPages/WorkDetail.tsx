import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useWorksStore } from '@/store/worksStore'
import StarBlack from '@/assets/images/StarBlack.png'
import StarTopLeft from '@/assets/images/StarTL.png'
import StarBottomRight from '@/assets/images/StarBR.png'

const WorkDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [expandedDescription, setExpandedDescription] = useState(false)
  const { workCache, workLoading: loading, fetchWorkById } = useWorksStore()
  const work = id ? workCache.get(id) : null
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set())
  const [imagesPreloading, setImagesPreloading] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate('/works')
      return
    }
    fetchWorkById(id)
  }, [id, navigate, fetchWorkById])

  // Preload all images when work data is available
  useEffect(() => {
    if (!work) return

    const imageUrls: string[] = []
    
    // Add main image
    if (work.main_image_url) {
      imageUrls.push(work.main_image_url)
    }
    
    // Add all gallery images
    if (work.media && work.media.length > 0) {
      work.media.forEach((media) => {
        if (media.image_url) {
          imageUrls.push(media.image_url)
        }
      })
    }

    if (imageUrls.length === 0) return

    setImagesPreloading(true)
    setImagesLoaded(new Set())

    // Preload all images
    const loadPromises = imageUrls.map((url) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = () => reject(url)
        img.src = url
      })
    })

    Promise.allSettled(loadPromises).then((results) => {
      const loaded = new Set<string>()
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loaded.add(imageUrls[index])
        }
      })
      setImagesLoaded(loaded)
      setImagesPreloading(false)
    })
  }, [work])



  const MAX_DESCRIPTION_LENGTH = 150
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '')
  const plainDescription = work?.description ? stripHtml(work.description) : ''
  const shouldTruncate = plainDescription.length > MAX_DESCRIPTION_LENGTH
  const truncatedDescription = shouldTruncate
    ? plainDescription.substring(0, MAX_DESCRIPTION_LENGTH).trim() + '...'
    : plainDescription

  const gradientClassesFor = (srv?: string | null) => {
    switch (srv) {
      case 'Indoor & Studio':
        return 'bg-gradient-to-r from-[#4E26D7] to-[#291471] text-white'
      case 'Outdoor & Events':
        return 'bg-gradient-to-r from-[#FBC93D] to-[#FFC800] text-[#291471]'
      case 'Videography':
        return 'bg-gradient-to-r from-[#F2322E] to-[#AA1815] text-white'
      default:
        return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="page-fade min-h-screen bg-white pt-6 px-6">
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
      <div className="page-fade min-h-screen bg-white pt-6 px-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Work not found
        </div>
      </div>
    )
  }

  if (!work) return null

  return (
    <div className="page-fade min-h-screen bg-white">
              {/* Decorative Top Left */}
        <div className="absolute top-[-150px] left-[-275px] w-[600px] h-[600px] object-contain">
          <img
            src={StarTopLeft}
            alt="Star top left"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Decorative Bottom Right */}
        <div className="absolute bottom-[-500px] right-[-275px] object-contain">
          <img
            src={StarBottomRight}
            alt="Star bottom right"
            className="w-full h-full object-contain"
          />
        </div>

      {/* Back Button */}
      <div className="pt-6 px-6 relative z-10">
        <button
          type="button"
          onClick={() => navigate('/works')}
          className="rounded-ee-2xl rounded-tl-2xl border border-[#291471] px-6 py-2 text-sm font-semibold text-[#291471] transition hover:bg-[#291471] hover:text-white mb-8"
        >
          ← Back to Collections
        </button>
      </div>

      {/* Top two-column section */}
      <section className="px-8 md:px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Cover image */}
          <div className="w-full relative">
            {work.main_image_url && (!imagesLoaded.has(work.main_image_url) && imagesPreloading) && (
              <div className="absolute inset-0 bg-gray-200 rounded-xl animate-pulse z-0" />
            )}
            {work.main_image_url && (
              <img
                src={work.main_image_url}
                alt={work.label_1 || 'Work'}
                className={`w-full h-auto object-cover rounded-xl transition-opacity duration-300 relative z-10 ${
                  imagesLoaded.has(work.main_image_url) || !imagesPreloading ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => {
                  if (work.main_image_url) {
                    setImagesLoaded((prev) => new Set(prev).add(work.main_image_url!))
                  }
                }}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {work.title && (
              <h1 className="text-5xl font-bold text-[#333333]">{work.title}</h1>
            )}
            
            {work.label_1 && (
              <span
                className={`inline-flex w-fit items-center rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm ${gradientClassesFor(work.label_1)}`}
              >
                {work.label_1}
              </span>
            )}

            {work.label_2 && (
              <span
                className={`inline-flex w-fit items-center rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm ${gradientClassesFor(work.label_2)}`}
              >
                {work.label_2}
              </span>
            )}

            {work.date && (
              <p className="text-base text-[#666666]">
                {new Date(work.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}

            {work.description && (
              <div className="relative z-10 text-base leading-relaxed text-[#333333]">
                <style>{`
                  .work-description {
                    color: #444444;
                    line-height: 1.625;
                    text-align: justify;
                  }
                `}</style>
                {!expandedDescription ? (
                  <div className="work-description whitespace-pre-wrap">{truncatedDescription}</div>
                ) : (
                  <div
                    className="work-description"
                    dangerouslySetInnerHTML={{ __html: work.description || '' }}
                  />
                )}
                {shouldTruncate && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="px-6 py-2 text-base font-bold text-[#c21205] hover:text-[#a01604] transition rounded-md cursor-pointer"
                      aria-expanded={expandedDescription}
                    >
                      {expandedDescription ? 'See Less' : 'See More'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider  */}
          <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-12 mt-12">
            <div className="h-0.5 w-screen bg-black" />
            <img src={StarBlack} alt="star-black" className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 h-14 w-14" />
          </div>
      </section>

        <div className="w-full text-center mb-8">
          <h2 className="text-5xl font-bold italic text-[#D42724]">Hi-Lite Gallery</h2>
        </div>

      {/* Gallery Section */}
      {work.media && work.media.length > 0 && (
        <section className="px-4 sm:px-6 md:px-8 max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
            {work.media.map((media) => {
              const isLoaded = imagesLoaded.has(media.image_url) || !imagesPreloading
              return (
                <div key={media.id} className="flex flex-col cursor-pointer group">
                  <div className="aspect-square w-full bg-gray-100 overflow-hidden rounded-lg relative">
                    {!isLoaded && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}
                    <img
                      src={media.image_url}
                      alt="Gallery"
                      className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => {
                        setImagesLoaded((prev) => new Set(prev).add(media.image_url))
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export default WorkDetail
