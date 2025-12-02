import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X as IconX } from 'lucide-react'
import BorderBlue from '@/assets/images/BorderBlue.png'
import StarBlack from '@/assets/images/StarBlack.png'
import { useMagazineStore } from '@/store/magazineStore'
import { useMagazineEngagement } from '@/utils/useMagazineEngagement'
import { EngagementForm } from '@/components/common/EngagementForm'
import { EngagementItem } from '@/components/common/EngagementItem'

const MagazineArticle = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const { articleLoading, articleCache, fetchArticleById } = useMagazineStore()
  const selectedItem = id ? articleCache.get(id) || null : null

  const engagement = useMagazineEngagement({
    blogStoryId: id ? parseInt(id, 10) : 0,
  })

  const [isSubmittingEngagement, setIsSubmittingEngagement] = useState(false)

  useEffect(() => {
    if (id) {
      fetchArticleById(id)
      engagement.loadEngagements()
    }
  }, [id, fetchArticleById])

  if (articleLoading || !selectedItem) {
    return (
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
    )
  }

  return (
    <div className="page-fade min-h-screen bg-white py-12">
      {/* Divider line */}
      <div className="relative w-full flex flex-col items-center pt-6">
        <div className="relative w-screen left-1/2 -translate-x-1/2 mb-12">
          <div className="h-0.5 w-screen bg-black" />
          <img
            src={StarBlack}
            alt="star-black"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16"
          />
        </div>
      </div>

      {/* Close button */}
      <div className="relative px-4 md:px-8">
        <button
          type="button"
          onClick={() => navigate('/magazine')}
          aria-label="Close"
          title="Close"
          className="absolute right-4 md:right-20 top-0 w-16 h-16 text-[#222222] flex items-center justify-center hover:text-[#111111] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#222222] transition transform hover:scale-105 active:scale-95"
        >
          <IconX className="w-8 h-8" />
        </button>
      </div>

      {/* Title and date */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto w-full text-center">
        <h2 className="text-5xl md:text-6xl font-semibold text-[#333333]">
          {selectedItem.title}
        </h2>
        {selectedItem.created_at && (
          <p className="mt-2 text-base md:text-lg text-[#2f7a35] font-medium">
            <span className="text-[#0d7123] mr-2">Published:</span>
            <span className="text-[#555555] font-medium">
              {new Date(selectedItem.created_at as any).toLocaleDateString(
                'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </span>
          </p>
        )}
      </div>

      {/* Cover image */}
      <div className="w-full flex justify-center py-10 px-4 md:px-8">
        <img
          src={selectedItem.cover_image || ''}
          alt={selectedItem.title}
          className="max-w-3xl w-full h-auto object-contain rounded-xl"
        />
      </div>

      {/* Border Blue below image */}
      <div className="relative w-screen left-1/2 -translate-x-1/2">
        <img src={BorderBlue} alt="border-blue" className="w-screen h-auto" />
      </div>

      {/* Content */}
      <div
        className="text-lg md:text-xl leading-relaxed text-[#333333] w-full px-4 md:px-50 mt-8 mb-10"
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
          .prose-content h1 { font-size: 1.875rem; font-weight: 700; color: #333333; margin-bottom: 1rem; text-align: justify; }
          .prose-content h2 { font-size: 1.5rem; font-weight: 700; color: #333333; margin-bottom: 0.75rem; text-align: justify; }
          .prose-content h3 { font-size: 1.25rem; font-weight: 700; color: #333333; margin-bottom: 0.5rem; text-align: justify; }
          .prose-content p { color: #444444; margin-bottom: 1rem; line-height: 1.625; text-align: justify; }
          .prose-content strong { font-weight: 600; color: #222222; }
          .prose-content em { font-style: italic; color: #444444; }
          .prose-content a { color: #2563eb; text-decoration: underline; }
          .prose-content a:hover { color: #1d4ed8; }
          .prose-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
          .prose-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
          .prose-content li { color: #444444; margin-bottom: 0.5rem; }
        `}</style>
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: selectedItem.content }}
        />
      </div>

      {/* Feedback Section */}
      <div className="max-w-6xl mx-auto space-y-10 px-4 md:px-6">
        {/* Blue strip */}
        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <img src={BorderBlue} alt="border-blue" className="w-screen h-auto" />
        </div>

        <EngagementForm
          onSubmit={async (type, content) => {
            setIsSubmittingEngagement(true)
            try {
              await engagement.createEngagement(type, content)
            } finally {
              setIsSubmittingEngagement(false)
            }
          }}
          isLoading={isSubmittingEngagement}
        />

        {/* Divider line */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 mb-10">
            <div className="h-0.5 w-screen bg-black" />
            <img
                src={StarBlack}
                alt="star-black"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16"
            />
            </div>


        {/* Past Comments */}
        <div className="space-y-2">
          {engagement.engagements.map((item) => (
            <EngagementItem
              key={item.id}
              engagement={item}
              onDelete={(id) => engagement.deleteEngagement(id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MagazineArticle