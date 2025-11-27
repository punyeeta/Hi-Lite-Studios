import { useNavigate } from 'react-router-dom'
import RecentHeader from '@/assets/images/RecentHeader.png'
import Card from '@/components/cards/RecentCards'
import StarTopLeft from '@/assets/images/StarTL.png'
import StarBottomRight from '@/assets/images/StarBR.png'

interface WorkItem {
  id: string
  image: string
  description: string
}

const RecentWorks = () => {
  const navigate = useNavigate()

  // Placeholder image data URI 
  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="16" font-family="sans-serif"%3EImage Placeholder%3C/text%3E%3C/svg%3E'
  
  // Sample data 
  const works: WorkItem[] = [
    { id: '1', image: placeholderImage, description: 'Description' },
    { id: '2', image: placeholderImage, description: 'Description' },
    { id: '3', image: placeholderImage, description: 'Description' },
    { id: '4', image: placeholderImage, description: 'Description' },
    { id: '5', image: placeholderImage, description: 'Description' },
    { id: '6', image: placeholderImage, description: 'Description' },
    { id: '7', image: placeholderImage, description: 'Description' },
    { id: '8', image: placeholderImage, description: 'Description' },
  ]

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

          {/* Image Grid - 2x4 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {works.map((work) => (
              <Card
                key={work.id}
                image={work.image}
                description={work.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default RecentWorks
