import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
import MagazineCard from '@/components/cards/MagazineCard'

interface MagazineGridProps {
  gridItems: any[]
}

const MagazineGrid = memo(({ gridItems }: MagazineGridProps) => {
  const navigate = useNavigate()

  return (
    <section className="grid gap-6 md:grid-cols-3 -mt-4">
      {gridItems.length > 0 ? (
        gridItems.map((item) => (
          <MagazineCard
            key={item.id}
            title={item.title}
            image={item.cover_image || ''}
            excerpt={item.excerpt || ''}
            onClick={() => navigate(`/magazine/${item.id}`)}
          />
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <p className="text-lg text-[#666666]">No stories found.</p>
        </div>
      )}
    </section>
  )
})

MagazineGrid.displayName = 'MagazineGrid'

export default MagazineGrid
