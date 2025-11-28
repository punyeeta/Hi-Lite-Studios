import { supabase } from '@/supabase/client'

export interface AboutUsData {
  id: string
  created_at: string
  updated_at: string
  meet_team_title: string
  meet_team_subtitle: string
  what_we_do_title: string
  what_we_do_description: string
  main_image_url: string
  description: string
}

export interface TeamMember {
  id: string
  about_us_id: string
  display_order: number
  created_at: string
  name: string
}

export const fetchAboutUs = async (): Promise<AboutUsData | null> => {
  try {
    const { data, error } = await supabase
      .from('about_us')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching About Us data:', error)
      return null
    }

    return data as AboutUsData
  } catch (error) {
    console.error('Unexpected error fetching About Us:', error)
    return null
  }
}

export const fetchTeamMembers = async (aboutUsId?: string): Promise<TeamMember[]> => {
  try {
    let query = supabase
      .from('about_us_staff')
      .select('*')
      .order('display_order', { ascending: true })

    if (aboutUsId) {
      query = query.eq('about_us_id', aboutUsId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching team members:', error)
      return []
    }

    return data as TeamMember[]
  } catch (error) {
    console.error('Unexpected error fetching team members:', error)
    return []
  }
}
