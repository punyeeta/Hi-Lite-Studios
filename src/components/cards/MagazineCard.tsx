type MagazineCardProps = {
  title: string
  image: string
  excerpt: string
  onClick?: () => void
}

const MagazineCard = ({ title, image, excerpt, onClick }: MagazineCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white text-left shadow-[0_15px_45px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
    >
      <div className="aspect-4/3 w-full overflow-hidden bg-gray-200">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-6 py-5">
        <h3 className="text-2xl font-semibold text-[#333333] line-clamp-2">{title}</h3>
        <p className="text-sm text-[#555555] line-clamp-3">{excerpt}</p>
      </div>
    </button>
  )
}

export default MagazineCard

