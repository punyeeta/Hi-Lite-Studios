import { useNavigate } from 'react-router-dom'
import { useEffect, useCallback, memo } from 'react'
import type { TeamMember } from '@/supabase/supabase_services/Content_Management/aboutUs'
import { useAboutStore } from '@/store/aboutStore'
import IndoorIcon from '@/assets/images/ServiceIndoor.png'
import OutdoorIcon from '@/assets/images/ServiceOutdoor.png'
import VideoIcon from '@/assets/images/ServiceVid.png'
import ServiceLogo from '@/assets/images/ServiceLogo.png'
import BorderStar from '@/assets/images/BorderStar.png'
import HeaderTitle from '@/assets/images/AboutUS_Title.svg'
import StarService from '@/assets/images/ServiceStar.png'
import Wordmark from '@/assets/images/Wordmark.png'
import StarWhite from '@/assets/images/StarWhite.png'

interface ServiceCard {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  features: string[]
  textColor: string
}

const SERVICES: ServiceCard[] = [
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

const About = () => {
  const navigate = useNavigate()
  const { aboutData, teamMembers, loading, activeCard, fetchAboutData, setActiveCard } = useAboutStore()

  const handleOpenService = useCallback((service: ServiceCard) => setActiveCard(service), [setActiveCard])
  const handleCloseModal = useCallback(() => setActiveCard(null), [setActiveCard])

  useEffect(() => {
    fetchAboutData()
  }, [])



  return (
    <div className="page-fade min-h-screen bg-white">
      {/* About Us Header */}
      <section className="relative w-full bg-white py-4 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <img src={HeaderTitle} alt="About Us Header" className="w-full max-w-4xl mx-auto h-auto" />
        </div>
      </section>

      <div className="relative w-full flex flex-col items-center pt-6 pb-6">
        {/* Top line */}
        <div className="relative w-full mb-8">
            <div className="h-0.5 w-full bg-yellow-500" />
            <img
            src={StarService}
            alt="star-service"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16"
            />
        </div>
      </div>

      {/* Full Image Section */}
      <section className="relative w-full bg-white px-6 flex items-center justify-center">
        <div className="relative max-w-3xl w-full pb-32"> {/* add bottom padding */}
          {loading || !aboutData?.main_image_url ? (
            <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <>
              <img
                src={aboutData.main_image_url}
                alt="About Hi-Lite Studio"
                className="w-full h-auto object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 w-full h-80 bg-linear-to-t from-white via-white to-transparent pointer-events-none" />
              <img
                src={Wordmark}
                alt="Wordmark"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 h-50 w-auto"
              />
            </>
          )}
        </div>
      </section>

      {/* Description Section */}
      <section className="w-full bg-white py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xl leading-relaxed text-[#291471] text-justify">
            {aboutData?.description || 'At Hi-Lite Studio, we create photographs and videos that feel genuine, warm, and intentional. Based in Cagayan de Oro, we specialize in capturing stories—whether for families, students, or organizations—through a blend of technical precision and emotional depth. Every project is shaped by our passion for storytelling and our commitment to delivering timeless, meaningful visuals.'}
          </p>
        </div>
      </section>

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

      {/* Meet The Team Section */}
      <section className="relative w-full bg-white py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-8">
            <h2 className="text-7xl font-bold bg-linear-to-r from-[#FBC93D] to-[#FF8000] bg-clip-text text-transparent mb-2">
              {aboutData?.meet_team_title || 'Meet The Team'}
            </h2>
            <p className="text-xl font-light bg-linear-to-r from-[#FBC93D] to-[#FF8000] bg-clip-text text-transparent">
              {aboutData?.meet_team_subtitle || 'The talented people behind Hi-Lite Studio'}
            </p>
          </div>

          {/* Team Names Strip */}
            <div className="w-full mb-8">
              <div className="w-screen overflow-x-hidden relative left-1/2 -translate-x-1/2">
                <div className="flex bg-[#FBC93D] py-4 items-center justify-center">
                  {(teamMembers.length
                    ? teamMembers.map((m) => m.name)
                    : ['Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4']
                  ).map((name, idx, arr) => (
                    <div key={`${name}-${idx}`} className="flex items-center">
                      <span className="text-white text-3xl whitespace-nowrap px-8">
                        {name}
                      </span>

                      {idx < arr.length - 1 && (
                        <img
                          src={StarWhite}
                          alt="star"
                          className="w-18 h-18 mx-4"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </section>

      {/* What We Do Section */}
      <section className="relative w-full bg-white py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-2">
            <h2 className="text-7xl font-bold bg-linear-to-r from-[#291471] to-[#4E26D7] bg-clip-text text-transparent mb-6">
              {aboutData?.what_we_do_title || 'What We Do'}
            </h2>
            <p className="text-xl bg-linear-to-r from-[#291471] to-[#4E26D7] bg-clip-text text-transparent text-justify w-full">
              {aboutData?.what_we_do_description ||
                'Our work blends technical craftsmanship with a deep appreciation for the people and stories behind every shot.'}
            </p>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section className="relative w-full bg-white py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-10">
            <p className="text-xl bg-linear-to-r from-[#291471] to-[#4E26D7] bg-clip-text text-transparent max-w-3xl text-justify">
              We offer three main services:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-24 justify-center mx-auto max-w-fit">
            {SERVICES.map((service) => (
              <ServiceButton
                key={service.id}
                service={service}
                onOpen={handleOpenService}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Modal */}
      {activeCard && (
        <ServiceModal
          service={activeCard}
          onClose={handleCloseModal}
          onBooking={() => navigate('/appointment')}
        />
      )}
    </div>
  </div>
  )
} 

// Memoized sub-components to prevent unnecessary re-renders

type TeamMembersGridProps = {
  loading: boolean
  members: TeamMember[]
}

const TeamMembersGrid = memo(({ loading, members }: TeamMembersGridProps) => {
  if (loading && members.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="text-center p-6 rounded-lg bg-gray-200 border border-gray-300 animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    )
  }

  if (members.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member) => (
          <div key={member.id} className="text-center">
            <h3 className="text-2xl font-semibold text-[#291471]">
              {member.name}
            </h3>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((index) => (
        <div key={index} className="text-center p-6 rounded-lg bg-gray-50 border border-gray-200">
          <div className="w-16 h-16 bg-linear-to-br from-[#291471] to-[#4E26D7] rounded-full mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-[#291471]">
            Team Member {index}
          </h3>
          <p className="text-sm text-gray-500 mt-2">Coming soon</p>
        </div>
      ))}
    </div>
  )
})

TeamMembersGrid.displayName = 'TeamMembersGrid'

type ServiceButtonProps = {
  service: ServiceCard
  onOpen: (service: ServiceCard) => void
}

const ServiceButton = memo(({ service, onOpen }: ServiceButtonProps) => (
  <button
    key={service.id}
    type="button"
    onClick={() => onOpen(service)}
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
))

ServiceButton.displayName = 'ServiceButton'

type ServiceModalProps = {
  service: ServiceCard
  onClose: () => void
  onBooking: () => void
}

const ServiceModal = memo(({ service, onClose, onBooking }: ServiceModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className={`relative w-full max-w-2xl rounded-3xl bg-linear-to-br ${service.gradient} p-10 text-white shadow-2xl`}>
      {/* Logo top-left */}
      <img
        src={service.icon}
        alt={service.title}
        className="absolute left-6 top-6 h-12 w-12"
      />

      {/* Close button top-right */}
      <button
        type="button"
        aria-label="Close"
        className="absolute right-6 top-6 rounded-full bg-white/20 px-3 py-1 text-lg font-semibold text-white transition hover:bg-white/30"
        onClick={onClose}
      >
        ×
      </button>

      {/* Content below logo */}
      <div className="mt-16 flex flex-col gap-5">
        <h3 className="text-5xl font-semibold">{service.title}</h3>
        <p className="text-lg text-white/90">{service.description}</p>

        <div className="mt-2">
          <div className="h-0.5 w-full bg-linear-to-r from-white/80 to-white/0" />

          <div className="mt-6 grid gap-3">
            {service.features.map((feature) => (
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
            onClick={onBooking}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  </div>
))

ServiceModal.displayName = 'ServiceModal'

export default About
