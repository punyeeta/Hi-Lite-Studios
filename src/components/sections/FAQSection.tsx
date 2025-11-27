import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFAQ } from '@/context/FAQContext'
import type { FAQItem } from '@/context/FAQContext'
import FAQCard from '@/components/cards/FAQCards'
import StarTL from '@/assets/images/StarTL.png'
import BorderYellow from '@/assets/images/BorderYellow.png'

const FAQSection = () => {
  const { items } = useFAQ()
  const navigate = useNavigate()
  const previews = items.slice(0, 6)

  // Modal state: either FAQItem or null
  const [openItem, setOpenItem] = useState<FAQItem | null>(null)

  return (
    <section id="faq-section" className="relative w-full bg-white pt-8 pb-0 overflow-hidden">
      {/* Left Mirrored Graphic */}
      <div className="absolute left-[-200px] top-1/2 -translate-y-1/2 w-130 opacity-80 pointer-events-none z-0">
        <img
          src={StarTL}
          alt="Decorative graphic"
          className="w-full h-full object-contain scale-x-[-1]"
        />
      </div>

      {/* Right Mirrored Graphic */}
      <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-130 opacity-80 pointer-events-none z-0">
        <img
          src={StarTL}
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
        <div className="cursor-pointer grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {previews.map((item) => (
            <FAQCard
              key={item.id}
              item={item}
              isAdmin={false}
              preview={true}
              onClick={() => setOpenItem(item)} // open modal
            />
          ))}
        </div>

        {/* Centered View More button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/faq')}
            className="inline-flex items-center gap-3 -mt-6 mb-4 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-10 py-3 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl cursor-pointer"
          >
            View More FAQs
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>

      <div className="w-screen relative pt-4 z-20 left-1/2 -translate-x-1/2">
        <img
          src={BorderYellow}
          alt="Bottom yellow border"
          className="w-full object-cover"
        />
      </div>

      {/* Modal */}
      {openItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpenItem(null)} // close on backdrop click
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              onClick={() => setOpenItem(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">{openItem.question}</h3>
            <p className="text-gray-700">{openItem.answer}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default FAQSection