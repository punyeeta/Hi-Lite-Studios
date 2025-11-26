import { useNavigate } from 'react-router-dom'
import { useFAQ } from '@/context/FAQContext'
import FAQCard from '@/components/cards/FAQCards'

const FAQ = () => {
  const { items } = useFAQ()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-6xl font-extrabold text-[#222222]">
              Frequently Asked <span className="font-extrabold">Questions</span>
            </h1>
            <p className="mt-2 text-sm text-[#555555]">
              A comprehensive guide to our services, booking process, and more.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="self-start rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#222222] transition hover:bg-[#222222] hover:text-white"
          >
            Back to Home
          </button>
        </header>

        {/* FAQ Cards List - show full answers */}
        <div className="grid gap-8 md:grid-cols-1">
          {items.map((item) => (
            <FAQCard key={item.id} item={item} isAdmin={false} expanded={true} />
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



