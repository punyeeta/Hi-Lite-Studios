import { useNavigate } from 'react-router-dom'
import { useFAQ } from '@/components/sections/context/FAQContext'
import FAQCard from '@/components/cards/FAQCards'
import HeaderFAQImg from '@/assets/images/HeaderFAQ.png'
import StarFAQ from '@/assets/images/StarFAQ.png'

const FAQ = () => {
  const { items } = useFAQ()
  const navigate = useNavigate()



  return (
    <div className="page-fade relative min-h-screen bg-white pt-8 pb-20 overflow-hidden">
      <img
        src={StarFAQ}
        alt="star-faq"
        className="pointer-events-none select-none absolute left-[-50px] top-0 h-screen w-auto opacity-90 z-0"
      />

      <img
        src={StarFAQ}
        alt="star-faq"
        className="pointer-events-none select-none absolute right-[-25px] bottom-[-350px] h-screen w-auto opacity-90 z-0 transform scale-x-[-1]"
      />


      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-2 relative z-10">
        {/* Header */}
        <header className="flex flex-col items-center gap-6">
          <img
            src={HeaderFAQImg}
            alt="Frequently Asked Questions"
            className="w-full max-w-3xl h-auto mx-auto"
          />
        </header>

        {/* FAQ Cards List - show full answers */}
        <div className="grid gap-10 md:grid-cols-1">
          {items.map((item) => (
            <FAQCard key={item.id} item={item} isAdmin={false} expanded={false} />
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-gray-500">No FAQs available yet.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 rounded-md bg-[#222222] px-6 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Go Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FAQ
