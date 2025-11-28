import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AboutUsData, TeamMember } from '@/supabase/supabase_services/Content_Management/aboutUs'
import { fetchAboutUs, fetchTeamMembers } from '@/supabase/supabase_services/Content_Management/aboutUs'

interface ServiceCard {
  id: string
  title: string
  description: string
  icon: string
  gradient: string
  features: string[]
  textColor: string
}

interface AboutState {
  // Data
  aboutData: AboutUsData | null
  teamMembers: TeamMember[]
  
  // UI State
  loading: boolean
  error: string | null
  activeCard: ServiceCard | null

  // Actions
  fetchAboutData: () => Promise<void>
  setActiveCard: (card: ServiceCard | null) => void
  clearError: () => void
}

export const useAboutStore = create<AboutState>()(
  devtools(
    (set) => ({
      // Initial state
      aboutData: null,
      teamMembers: [],
      loading: true,
      error: null,
      activeCard: null,

      // Fetch about data and team members
      fetchAboutData: async () => {
        set({ loading: true, error: null })
        try {
          const aboutData = await fetchAboutUs()
          
          if (aboutData?.id) {
            const teamMembers = await fetchTeamMembers(aboutData.id)
            set({ aboutData, teamMembers, loading: false })
          } else {
            set({ aboutData, teamMembers: [], loading: false })
          }
        } catch (err: any) {
          set({
            error: err.message ?? 'Failed to load about data',
            loading: false,
          })
        }
      },

      // Set active service card
      setActiveCard: (card: ServiceCard | null) => {
        set({ activeCard: card })
      },

      // Clear errors
      clearError: () => {
        set({ error: null })
      },
    }),
    { name: 'AboutStore' }
  )
)
