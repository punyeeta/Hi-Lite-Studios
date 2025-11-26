import { useNavigate } from 'react-router-dom'
import { useMagazine } from '@/context/MagazineContext'
import MagazineCard from '@/components/cards/MagazineCard'

const MagazineSection = () => {
  const { items } = useMagazine()
  const navigate = useNavigate()

  const previews = items.slice(0, 3)

  return (
    <section id="magazine" className="relative bg-white md:px-8 py-12 overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-7xl font-extrabold tracking-tight text-[#333333]">
              Hi‑Lite: <span className="font-extrabold">Magazine</span>
            </h2>
            <p className="mt-2 text-lg italic text-[#333333]">
              A space for stories, snapshots, and the art behind every frame.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/magazine')}
            className="mt-5 mb-6 rounded-ee-2xl rounded-tl-2xl bg-[#333333] px-16 py-3 text-xl font-semibold text-white shadow-md transition hover:bg-[#444444]"
          >
            Read More
            <span className="text-2xl ml-4">→</span>
          </button>
        </header>

        <div className="grid gap-10 md:grid-cols-3">
          {previews.map((item) => (
            <MagazineCard
              key={item.id}
              title={item.title}
              image={item.image}
              excerpt={item.excerpt}
              onClick={() => navigate(`/magazine/${item.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MagazineSection

