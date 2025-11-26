import { useNavigate } from 'react-router-dom'
import { useFAQ } from '@/context/FAQContext'
import FAQCard from '@/components/cards/FAQCards'
import IntersectTL from '@/assets/images/IntersectTL.png'
import YellowBorder from '@/assets/images/Yellow Border.png'

const FAQSection = () => {
  const { items } = useFAQ()
  const navigate = useNavigate()
  const previews = items.slice(0, 6)

  return (
    <section id="faq-section" className="relative w-full bg-white py-10 overflow-hidden">
      {/* Left Mirrored Graphic */}
      <div className="absolute left-[-200px] top-1/2 -translate-y-1/2 w-130 opacity-80 pointer-events-none z-0">
        <img
          src={IntersectTL}
          alt="Decorative graphic"
          className="w-full h-full object-contain scale-x-[-1]"
        />
      </div>

      {/* Right Mirrored Graphic */}
      <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-130 opacity-80 pointer-events-none z-0">
        <img
          src={IntersectTL}
          alt="Decorative graphic"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-12">
        {/* Header */}
        <header className="flex flex-col gap-4 items-start">
          <h2 className="text-7xl leading-none font-extrabold bg-linear-to-r from-[#F2322E] to-[#AA1815] bg-clip-text text-transparent text-center">
            Frequently Asked Questions
          </h2>
        </header>

        {/* FAQ Cards Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {previews.map((item) => (
            <FAQCard key={item.id} item={item} isAdmin={false} preview={true} />
          ))}
        </div>

        {/* Centered View More button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/faq')}
            className="inline-flex items-center gap-3 -mt-6 mb-4 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-10 py-3 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl"
          >
            View More FAQs
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>

       <div className="w-screen relative pt-4 pb-4 z-20 left-1/2 -translate-x-1/2">
        <img
          src={YellowBorder}
          alt="Bottom blue border"
          className="w-full object-cover"
        />
      </div>
    </section>
  )
}

export default FAQSection
