import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFAQ } from '@/components/sections/context/FAQContext'
import type { FAQItem } from '@/components/sections/context/FAQContext'
import FAQCard from '@/components/cards/FAQCards'
import StarTL from '@/assets/images/StarTL.png'
import BorderYellow from '@/assets/images/BorderYellow.png'

const FAQSection = () => {
  const { items } = useFAQ()
  const navigate = useNavigate()
  const previews = items.slice(0, 6)

  // Modal state: either FAQItem or null
  const [openItem, setOpenItem] = useState<FAQItem | null>(null)

  useEffect(() => {
    if (openItem) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      // Prevent wheel/touch scroll on the background
      const preventScroll = (e: Event) => {
        e.preventDefault()
      }
      window.addEventListener('wheel', preventScroll, { passive: false })
      window.addEventListener('touchmove', preventScroll, { passive: false })
      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('wheel', preventScroll as EventListener)
        window.removeEventListener('touchmove', preventScroll as EventListener)
      }
    }
  }, [openItem])

  return (
    <section id="faq-section" className="relative w-full bg-white pt-10 overflow-hidden">
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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-8 md:px-12">
        {/* Header */}
        <header className="flex flex-col gap-4 items-start">
          <h2 className="text-7xl leading-none font-extrabold bg-linear-to-r from-[#F2322E] to-[#AA1815] bg-clip-text text-transparent text-center">
            Frequently Asked Questions
          </h2>
        </header>

        {/* FAQ Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {previews.map((item) => (
            <FAQCard
              key={item.id}
              item={item}
              isAdmin={false}
              preview={true}
              onClick={() => setOpenItem(item)}
            />
          ))}
        </div>

        {/* Centered View More button */}
        <div className="mt-4 md:mt-6 mb-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/faq')}
            className="inline-flex items-center gap-3 mb-2 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-10 py-3 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setOpenItem(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenItem(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">{openItem.question}</h3>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-base leading-relaxed text-gray-700">{openItem.answer}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default FAQSection