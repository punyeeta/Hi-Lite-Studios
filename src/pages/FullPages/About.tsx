import { useNavigate } from 'react-router-dom'
import { useEffect, useCallback, memo } from 'react'
import type { TeamMember } from '@/supabase/supabase_services/Content_Management/aboutUs'
import { useAboutStore } from '@/store/aboutStore'
import BlueBorder from '@/assets/images/BorderBlue.png'
import IndoorIcon from '@/assets/images/ServiceIndoor.png'
import OutdoorIcon from '@/assets/images/ServiceOutdoor.png'
import VideoIcon from '@/assets/images/ServiceVid.png'
import ServiceLogo from '@/assets/images/ServiceLogo.png'
import BorderStar from '@/assets/images/BorderStar.png'
import HeaderTitle from '@/assets/images/AboutUS_Title.svg'

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
  }, [fetchAboutData])

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="pt-2 pl-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-ee-2xl rounded-tl-2xl border border-[#222222] px-6 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#222222] hover:text-white"
        >
          ← Back to Home
        </button>
      </div>

      {/* About Us Header */}
      <section className="relative w-full bg-white py-0 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <img src={HeaderTitle} alt="About Us Header" className="w-full max-w-4xl mx-auto h-auto" />
        </div>
      </section>

      {/* Full Image Section */}
      <section className="relative w-full bg-white py-4 px-6 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          {loading || !aboutData?.main_image_url ? (
            <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <img
              src={aboutData.main_image_url}
              alt="About Hi-Lite Studio"
              className="w-full h-auto object-contain rounded-lg"
            />
          )}
        </div>
      </section>

      {/* Description Section */}
      <section className="w-full bg-white py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl leading-relaxed text-gray-800 text-justify">
            {aboutData?.description || 'At Hi-Lite Studio, we create photographs and videos that feel genuine, warm, and intentional. Based in Cagayan de Oro, we specialize in capturing stories—whether for families, students, or organizations—through a blend of technical precision and emotional depth. Every project is shaped by our passion for storytelling and our commitment to delivering timeless, meaningful visuals.'}
          </p>
        </div>
      </section>

      {/* Blue Border */}
      <div className="w-full">
        <img src={BlueBorder} alt="border" className="w-full object-cover" />
      </div>

      {/* Meet The Team Section */}
      <section className="relative w-full bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold text-[#291471] mb-4">
              {aboutData?.meet_team_title || 'Meet The Team'}
            </h2>
            <p className="text-lg text-gray-600">
              {aboutData?.meet_team_subtitle || 'The talented people behind Hi-Lite Studio'}
            </p>
          </div>

          {/* Team Members Grid */}
          <TeamMembersGrid loading={loading} members={teamMembers} />
        </div>
      </section>

      {/* Blue Border */}
      <div className="w-full">
        <img src={BlueBorder} alt="border" className="w-full object-cover" />
      </div>

      {/* What We Do Section */}
      <section className="relative w-full bg-white py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-bold text-[#291471] mb-4">
              {aboutData?.what_we_do_title || 'What We Do'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl text-justify">
              {aboutData?.what_we_do_description || 'Our work blends technical craftsmanship with a deep appreciation for the people and stories behind every shot.'}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative w-full bg-white py-2 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-4">
            <p className="text-lg text-gray-600">
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
