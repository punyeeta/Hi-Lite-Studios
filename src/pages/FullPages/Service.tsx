import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IndoorIcon from '@/assets/images/ServiceIndoor.png'
import OutdoorIcon from '@/assets/images/ServiceOutdoor.png'
import VideoIcon from '@/assets/images/ServiceVid.png'
import ServiceLogo from '@/assets/images/ServiceLogo.png'
import BorderStar from '@/assets/images/BorderStar.png'
import StarService from '@/assets/images/ServiceStar.png'

type ServiceCard = {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  features: string[]
  textColor: string
}

const marqueeItems = ['Capture', 'Photography', 'Stories', 'Trusted', 'Moments']

const services: ServiceCard[] = [
  {
    id: 'indoor',
    title: 'Indoor & Studio Photography',
    description:
      'Professional portraits, family photos, and academic photography in a controlled studio environment.',
    icon: IndoorIcon,
    gradient: 'from-[#4E26D7] to-[#291471]',
    textColor: 'text-[#291471]',
    features: [
      'Individual Portraits',
      'Family/Group Portraits',
      'Graduation Academic Portraits',
      'Fashion/Editorial Shoots',
    ],
  },
  {
    id: 'outdoor',
    title: 'Outdoor & Event Photography',
    description:
      'Coverage of school activities, institutional events, and milestone celebrations with a natural and candid touch.',
    icon: OutdoorIcon,
    gradient: 'from-[#FBC93D] to-[#FF8000]',
    textColor: 'text-[#FF8000]',
    features: [
      'School Event Coverage',
      'Institutional/Corp. Events',
      'Birthday/Milestone Celeb.',
      'Outdoor Portrait Sessions',
      'Organizational Shoots',
      'Engagement/Pre-Event Shoots',
    ],
  },
  {
    id: 'video',
    title: 'Videography',
    description:
      'High-quality event videography for schools, organizations, and personal events to complement our photography services.',
    icon: VideoIcon,
    gradient: 'from-[#F2322E] to-[#AA1815]',
    textColor: 'text-[#AA1815]',
    features: [
      'Event Highlight Videos',
      'Full Event Coverage',
      'Video Documentation for School Events',
    ],
  },
]

const Service = () => {
  const [activeCard, setActiveCard] = useState<ServiceCard | null>(null)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="pt-6 pl-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white"
        >
          ← Back to Home
        </button>
      </div>

      <section id="services" className="relative w-full py-4">
        {/* top marquee */}
        <Strip direction="top" />

        <div className="relative w-full flex flex-col items-center pt-10 pb-16">
          {/* Top line */}
          <div className="relative w-full mb-8">
            <div className="h-0.5 w-full bg-yellow-500" />
            <img
              src={StarService}
              alt="star-service"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16"
            />
          </div>

          {/* Header text */}
          <div className="text-center">
            <p className="text-6xl font-black bg-linear-to-r from-[#FBC93D] to-[#FDA922] bg-clip-text text-transparent">
              <span className="inline-block mr-2">What can we do</span>
              <span className="italic font-black bg-linear-to-r from-[#FDA922] to-[#FF8C00] bg-clip-text text-transparent">for you</span>
              <span className="italic font-black text-[#FF8000]">?</span>
            </p>
          </div>

          <div className="relative w-full mt-6">
            <div className="h-0.5 w-full bg-yellow-500" />
            <p className="inline-block bg-white px-8 py-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-light text-[#FF8C00] whitespace-nowrap">
              Hover on any of our services and see which suits your needs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-20 justify-items-center mx-auto max-w-fit">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveCard(service)}
              className={`group relative rounded-xl border border-white/60 bg-linear-to-br ${service.gradient} shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:scale-[1.02] w-70 h-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70`}
            >
              <div className="absolute inset-3 rounded-xl border border-white-60" />
              <img src={BorderStar} alt="" className="absolute left-6 top-6 h-6 w-6" />
              <img
                src={ServiceLogo}
                alt="Service logo"
                className="absolute right-6 top-6 h-6 w-6"
              />
              <div className="relative mt-2 flex flex-col items-center gap-4 overflow-hidden">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="h-22 w-22 transform transition duration-300 group-hover:-translate-y-8 group-hover:scale-75 group-hover:opacity-0"
                />
                <h3 className="text-2xl font-semibold text-white transition duration-300 group-hover:-translate-y-6 group-hover:opacity-0">
                  {service.title}
                </h3>
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center opacity-0 translate-y-4 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-lg font-semibold text-white leading-relaxed">
                  {service.description}
                </p>
              </div>

              <img src={BorderStar} alt="" className="absolute right-6 bottom-6 h-6 w-6" />
              <img src={ServiceLogo} alt="Service logo" className="absolute left-6 bottom-6 h-6 w-6" />
            </button>
          ))}
        </div>

        {/* bottom marquee */}
        <Strip direction="bottom" />

        {/* modal */}
        {activeCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
              className={`relative w-full max-w-2xl rounded-3xl bg-linear-to-br ${activeCard.gradient} p-10 text-white shadow-2xl`}
            >
              {/* Logo top-left */}
              <img
                src={activeCard.icon}
                alt={activeCard.title}
                className="absolute left-6 top-6 h-12 w-12"
              />

              {/* Close button top-right */}
              <button
                type="button"
                aria-label="Close"
                className="absolute right-6 top-6 rounded-full bg-white/20 px-3 py-1 text-lg font-semibold text-white transition hover:bg-white/30"
                onClick={() => setActiveCard(null)}
              >
                ×
              </button>

              {/* Content below logo */}
              <div className="mt-16 flex flex-col gap-5">
                <h3 className="text-5xl font-semibold">{activeCard.title}</h3>
                <p className="text-lg text-white/90">{activeCard.description}</p>

                <div className="mt-2">
                  <div className="h-0.5 w-full bg-linear-to-r from-white/80 to-white/0" />

                  <div className="mt-6 grid gap-3">
                    {activeCard.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-base">
                        <img src={BorderStar} alt="" className="h-3.5 w-3.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-0.5 w-full bg-linear-to-r from-white/80 to-white/0" />

                <div className="mt-3 flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="rounded-ee-2xl rounded-tl-2xl border border-white px-6 py-3 font-semibold transition hover:bg-white/10"
                    onClick={() => navigate('/appointment')}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

const Strip = ({ direction }: { direction: 'top' | 'bottom' }) => {
  const repeatedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems]
  return (
    <div className={`w-full bg-[#F9C74F] py-3 ${direction === 'top' ? '' : 'mt-12'}`}>
      <div className="flex whitespace-nowrap">
        {repeatedItems.map((item, idx) => (
          <div key={`${direction}-${idx}`} className="flex items-center shrink-0 px-5">
            <span className="text-md font-light text-white tracking-[0.35em]">
              {item}
            </span>
            <img src={BorderStar} alt="" className="h-6 w-6 shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Service
