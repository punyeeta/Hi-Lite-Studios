import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
import MagazineCard from '@/components/cards/MagazineCard'
import MagazineCardSkeleton from '@/components/cards/MagazineCardSkeleton'
import { useMagazineStore } from '@/store/magazineStore'

const MagazineSearchResults = memo(() => {
  const navigate = useNavigate()
  const { items, searchQuery, loading } = useMagazineStore()

  if (!searchQuery) {
    return null
  }

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {loading ? (
        // Show skeletons only for search results grid
        Array.from({ length: 6 }).map((_, index) => (
          <MagazineCardSkeleton key={`skeleton-${index}`} />
        ))
      ) : items.length > 0 ? (
        items.map((item) => (
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
          <p className="text-lg text-[#666666]">No stories found matching your search.</p>
        </div>
      )}
    </section>
  )
})

MagazineSearchResults.displayName = 'MagazineSearchResults'

export default MagazineSearchResults
