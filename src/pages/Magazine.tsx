import { useNavigate, useParams } from 'react-router-dom'
import MagazineCard from '@/components/cards/MagazineCard'
import { useMagazine } from '@/context/MagazineContext'

const Magazine = () => {
  const { id } = useParams<{ id?: string }>()
  const { items } = useMagazine()
  const navigate = useNavigate()

  const selected = id ? items.find((item) => item.id === id) : null

  return (
    <div className="min-h-screen bg-[#e5e5e5] py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-extrabold text-[#222222]">
              Hi‑Lite: <span className="font-extrabold">Magazine</span>
            </h1>
            <p className="mt-2 text-sm text-[#555555]">
              A space for stories, snapshots, and the art behind every frame.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="self-start rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-5 py-2 text-sm font-semibold text-[#222222] transition hover:bg-[#222222] hover:text-white"
          >
            Back to Home
          </button>
        </header>

        {selected ? (
          <article className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="aspect-16/7 w-full overflow-hidden bg-gray-200">
              <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 px-8 py-8 md:px-10">
              <h2 className="text-3xl font-semibold text-[#222222]">{selected.title}</h2>
              <p className="text-sm text-[#666666]">{selected.excerpt}</p>
              <div className="h-px w-full bg-gray-200" />
              <p className="text-base leading-relaxed text-[#333333] whitespace-pre-line">
                {selected.content}
              </p>
            </div>
          </article>
        ) : (
          <section className="grid gap-6 md:grid-cols-3">
            {items.map((item) => (
              <MagazineCard
                key={item.id}
                title={item.title}
                image={item.image}
                excerpt={item.excerpt}
                onClick={() => navigate(`/magazine/${item.id}`)}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

export default Magazine




