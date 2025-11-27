import { useNavigate } from 'react-router-dom'
import BookingForm from '@/components/booking form/booking _form'
import StarTL from '@/assets/images/StarTL.png'
import StarBR from '@/assets/images/StarBR.png'
import ServiceStar from '@/assets/images/ServiceStar.png'

const Capture = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] relative overflow-hidden">
      {/* Decorative Stars */}
      <img
        src={StarTL}
        alt="Decorative star"
        className="pointer-events-none absolute -left-80 -top-40 hidden lg:block z-0"
      />

      <img
        src={StarBR}
        alt="Decorative star"
        className="pointer-events-none absolute -right-90 -bottom-100 hidden lg:block z-0"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 z-10">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white"
          >
            ← Back to Home
          </button>
        </div>

        {/* Decorative Center Star */}
        <div className="relative w-full mb-4 mt-10">
          <img
            src={ServiceStar}
            alt="star-service"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40"
          />
        </div>

        {/* Hero Heading */}
        <div className="space-y-4 text-center lg:text-center">
          <p className="text-4xl font-medium text-[#F7A800] mb-6">
            Ready to <span className="italic font-medium text-[#FF8C00]">hi-lite</span> your moment?
          </p>
          <div className="mx-auto h-1 w-full bg-linear-to-r from-transparent via-[#FF8C00]/30 to-transparent lg:mx-0" />
        </div>

        {/* Booking Form Section */}
        <BookingForm />
      </main>
    </div>
  )
}

export default Capture
