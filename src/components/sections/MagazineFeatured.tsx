import { useNavigate } from 'react-router-dom'
import { memo } from 'react'

interface MagazineFeaturedProps {
  pinnedItem: any
}

const MagazineFeatured = memo(({ pinnedItem }: MagazineFeaturedProps) => {
  const navigate = useNavigate()

  if (!pinnedItem) {
    return null
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
      <div className="md:w-2/5 overflow-hidden rounded-2xl aspect-video">
        <img
          src={pinnedItem.cover_image || ''}
          alt={pinnedItem.title}
          className="h-full w-full object-cover rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => navigate(`/magazine/${pinnedItem.id}`)}
        />
      </div>
      <div className="md:w-3/5 flex flex-col justify-center gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#333333]">
          {pinnedItem.title}
        </h2>
        <p className="text-base md:text-lg text-[#666666] line-clamp-3">
          {pinnedItem.excerpt}
        </p>
        <button
          type="button"
          onClick={() => navigate(`/magazine/${pinnedItem.id}`)}
          className="self-start px-8 py-2 bg-[#222222] text-white font-semibold rounded-ee-2xl rounded-tl-2xl hover:bg-[#444444] transition"
        >
          Read More →
        </button>
      </div>
    </div>
  )
})

MagazineFeatured.displayName = 'MagazineFeatured'

export default MagazineFeatured
