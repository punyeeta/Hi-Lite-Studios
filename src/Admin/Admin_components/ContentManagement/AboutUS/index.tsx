import { useEffect, useReducer } from 'react'
import MainDetailsForm from './components/MainDetailsForm'
import MeetTeamForm from './components/MeetTeamForm'
import WhatWeDoForm from './components/WhatWeDoForm'
import {
  addStaff,
  deleteStaff,
  fetchAboutUs,
  fetchStaff,
  updateAboutUs,
  uploadAboutUsImage,
  type AboutUs as AboutUsType,
  type AboutUsStaff,
} from '@/supabase/supabase_services/Content_Management/AboutUs_Servicce/AboutUs'
import {
  COLORS,
  ABOUT_US_ERRORS,
  FORM_SECTIONS,
  SAVING_STATES,
  EMPTY_FORMS,
} from '../constants'

type MainFormState = {
  main_image_url: string
  description: string
}

type MeetTeamFormState = {
  title: string
  subtitle: string
}

type WhatWeDoFormState = {
  title: string
  description: string
}

interface State {
  aboutUs: AboutUsType | null
  staff: AboutUsStaff[]
  mainForm: MainFormState
  meetTeamForm: MeetTeamFormState
  whatWeDoForm: WhatWeDoFormState
  editing: { main: boolean; meetTeam: boolean; whatWeDo: boolean }
  newStaffName: string
  loading: boolean
  error: string | null
  saving: { main: boolean; team: boolean; what: boolean; uploading: boolean; addingStaff: boolean }
}

type Action =
  | { type: 'SET_ABOUT_US'; payload: AboutUsType }
  | { type: 'SET_STAFF'; payload: AboutUsStaff[] }
  | { type: 'ADD_STAFF'; payload: AboutUsStaff }
  | { type: 'DELETE_STAFF'; payload: string }
  | { type: 'SET_MAIN_FORM'; payload: Partial<MainFormState> }
  | { type: 'SET_MEET_TEAM_FORM'; payload: Partial<MeetTeamFormState> }
  | { type: 'SET_WHAT_WE_DO_FORM'; payload: Partial<WhatWeDoFormState> }
  | { type: 'SET_EDITING'; payload: { section: 'main' | 'meetTeam' | 'whatWeDo'; value: boolean } }
  | { type: 'SET_NEW_STAFF_NAME'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SAVING'; payload: { section: 'main' | 'team' | 'what' | 'uploading' | 'addingStaff'; value: boolean } }
  | { type: 'RESET_MAIN_FORM'; payload: AboutUsType }
  | { type: 'RESET_MEET_TEAM_FORM'; payload: AboutUsType }
  | { type: 'RESET_WHAT_WE_DO_FORM'; payload: AboutUsType }

const initialState: State = {
  aboutUs: null,
  staff: [],
  mainForm: EMPTY_FORMS.MAIN,
  meetTeamForm: EMPTY_FORMS.MEET_TEAM,
  whatWeDoForm: EMPTY_FORMS.WHAT_WE_DO,
  editing: { main: false, meetTeam: false, whatWeDo: false },
  newStaffName: '',
  loading: true,
  error: null,
  saving: { main: false, team: false, what: false, uploading: false, addingStaff: false },
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_ABOUT_US':
      return { ...state, aboutUs: action.payload }
    case 'SET_STAFF':
      return { ...state, staff: action.payload }
    case 'ADD_STAFF':
      return { ...state, staff: [...state.staff, action.payload] }
    case 'DELETE_STAFF':
      return { ...state, staff: state.staff.filter((s) => s.id !== action.payload) }
    case 'SET_MAIN_FORM':
      return { ...state, mainForm: { ...state.mainForm, ...action.payload } }
    case 'SET_MEET_TEAM_FORM':
      return { ...state, meetTeamForm: { ...state.meetTeamForm, ...action.payload } }
    case 'SET_WHAT_WE_DO_FORM':
      return { ...state, whatWeDoForm: { ...state.whatWeDoForm, ...action.payload } }
    case 'SET_EDITING':
      return {
        ...state,
        editing: { ...state.editing, [action.payload.section]: action.payload.value },
      }
    case 'SET_NEW_STAFF_NAME':
      return { ...state, newStaffName: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_SAVING':
      return {
        ...state,
        saving: { ...state.saving, [action.payload.section]: action.payload.value },
      }
    case 'RESET_MAIN_FORM':
      return {
        ...state,
        mainForm: {
          main_image_url: action.payload.main_image_url || '',
          description: action.payload.description || '',
        },
      }
    case 'RESET_MEET_TEAM_FORM':
      return {
        ...state,
        meetTeamForm: {
          title: action.payload.meet_team_title || '',
          subtitle: action.payload.meet_team_subtitle || '',
        },
      }
    case 'RESET_WHAT_WE_DO_FORM':
      return {
        ...state,
        whatWeDoForm: {
          title: action.payload.what_we_do_title || '',
          description: action.payload.what_we_do_description || '',
        },
      }
    default:
      return state
  }
}

const LoadingState = () => (
  <div className="space-y-4">
    <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
    <div className="h-96 w-full rounded-2xl bg-gray-100 animate-pulse" />
  </div>
)

export default function AboutUsTab() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    void loadData()
  }, [])

  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const [aboutData, staffData] = await Promise.all([fetchAboutUs(), fetchStaff()])
      dispatch({ type: 'SET_ABOUT_US', payload: aboutData })
      dispatch({ type: 'SET_STAFF', payload: staffData })
      dispatch({
        type: 'SET_MAIN_FORM',
        payload: {
          main_image_url: aboutData.main_image_url || '',
          description: aboutData.description || '',
        },
      })
      dispatch({
        type: 'SET_MEET_TEAM_FORM',
        payload: {
          title: aboutData.meet_team_title || '',
          subtitle: aboutData.meet_team_subtitle || '',
        },
      })
      dispatch({
        type: 'SET_WHAT_WE_DO_FORM',
        payload: {
          title: aboutData.what_we_do_title || '',
          description: aboutData.what_we_do_description || '',
        },
      })
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : ABOUT_US_ERRORS.LOAD_DATA,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  /**
   * Generic form submit handler to eliminate redundancy
   * Handles all form section submissions with the same logic
   */
  const handleFormSubmit = async (
    section: 'main' | 'meetTeam' | 'whatWeDo',
    updateData: Partial<AboutUsType>,
    errorMessage: string,
  ) => {
    const savingSection = section === 'main' ? 'main' : section === 'meetTeam' ? 'team' : 'what'
    dispatch({ type: 'SET_SAVING', payload: { section: savingSection as any, value: true } })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const updated = await updateAboutUs(updateData)
      dispatch({ type: 'SET_ABOUT_US', payload: updated })
      dispatch({ type: 'SET_EDITING', payload: { section, value: false } })
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : errorMessage,
      })
    } finally {
      dispatch({ type: 'SET_SAVING', payload: { section: savingSection as any, value: false } })
    }
  }

  const handleMainSubmit = async () => {
    await handleFormSubmit(
      'main',
      {
        main_image_url: state.mainForm.main_image_url || null,
        description: state.mainForm.description || null,
      },
      ABOUT_US_ERRORS.SAVE_MAIN,
    )
  }

  const handleMeetTeamSubmit = async () => {
    await handleFormSubmit(
      'meetTeam',
      {
        meet_team_title: state.meetTeamForm.title || null,
        meet_team_subtitle: state.meetTeamForm.subtitle || null,
      },
      ABOUT_US_ERRORS.SAVE_TEAM,
    )
  }

  const handleWhatWeDoSubmit = async () => {
    await handleFormSubmit(
      'whatWeDo',
      {
        what_we_do_title: state.whatWeDoForm.title || null,
        what_we_do_description: state.whatWeDoForm.description || null,
      },
      ABOUT_US_ERRORS.SAVE_WHAT_WE_DO,
    )
  }

  const handleImageUpload = async (file: File) => {
    dispatch({ type: 'SET_SAVING', payload: { section: 'uploading', value: true } })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const { publicUrl } = await uploadAboutUsImage(file)
      dispatch({ type: 'SET_MAIN_FORM', payload: { main_image_url: publicUrl } })
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : ABOUT_US_ERRORS.UPLOAD_IMAGE,
      })
    } finally {
      dispatch({ type: 'SET_SAVING', payload: { section: 'uploading', value: false } })
    }
  }

  const handleAddStaff = async () => {
    if (!state.newStaffName.trim()) return
    dispatch({ type: 'SET_SAVING', payload: { section: 'addingStaff', value: true } })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const created = await addStaff({ name: state.newStaffName.trim() })
      dispatch({ type: 'ADD_STAFF', payload: created })
      dispatch({ type: 'SET_NEW_STAFF_NAME', payload: '' })
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : ABOUT_US_ERRORS.ADD_STAFF,
      })
    } finally {
      dispatch({ type: 'SET_SAVING', payload: { section: 'addingStaff', value: false } })
    }
  }

  const handleDeleteStaff = async (id: string) => {
    try {
      await deleteStaff(id)
      dispatch({ type: 'DELETE_STAFF', payload: id })
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : ABOUT_US_ERRORS.DELETE_STAFF,
      })
    }
  }

  /**
   * Generic form reset handler to eliminate redundancy
   * Resets any form section back to original values
   */
  const handleFormReset = (section: 'main' | 'meetTeam' | 'whatWeDo') => {
    if (!state.aboutUs) return
    switch (section) {
      case 'main':
        dispatch({ type: 'RESET_MAIN_FORM', payload: state.aboutUs })
        break
      case 'meetTeam':
        dispatch({ type: 'RESET_MEET_TEAM_FORM', payload: state.aboutUs })
        break
      case 'whatWeDo':
        dispatch({ type: 'RESET_WHAT_WE_DO_FORM', payload: state.aboutUs })
        break
    }
  }

  const handleEditToggle = (section: 'main' | 'meetTeam' | 'whatWeDo') => {
    dispatch({ type: 'SET_EDITING', payload: { section, value: true } })
  }

  const handleEditCancel = (section: 'main' | 'meetTeam' | 'whatWeDo') => {
    handleFormReset(section)
    dispatch({ type: 'SET_EDITING', payload: { section, value: false } })
  }

  if (state.loading) {
    return <LoadingState />
  }

  return (
    <section className="space-y-10">
      {state.error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Error:</p>
          <p>{state.error}</p>
        </div>
      )}

      <MainDetailsForm
        values={state.mainForm}
        onChange={(changes) => dispatch({ type: 'SET_MAIN_FORM', payload: changes })}
        onSubmit={handleMainSubmit}
        onImageUpload={handleImageUpload}
        submitting={state.saving.main}
        uploadingImage={state.saving.uploading}
        editing={state.editing.main}
        onEditToggle={() => handleEditToggle('main')}
        onCancel={() => handleEditCancel('main')}
      />

      <hr className="border-gray-200" />

      <MeetTeamForm
        values={state.meetTeamForm}
        newStaffName={state.newStaffName}
        submitting={state.saving.team}
        addingStaff={state.saving.addingStaff}
        staff={state.staff}
        onChange={(changes) => dispatch({ type: 'SET_MEET_TEAM_FORM', payload: changes })}
        onSubmit={handleMeetTeamSubmit}
        onAddStaff={handleAddStaff}
        onNewStaffNameChange={(name) => dispatch({ type: 'SET_NEW_STAFF_NAME', payload: name })}
        onDeleteStaff={handleDeleteStaff}
        editing={state.editing.meetTeam}
        onEditToggle={() => handleEditToggle('meetTeam')}
        onCancel={() => handleEditCancel('meetTeam')}
      />

      <hr className="border-gray-200" />

      <WhatWeDoForm
        values={state.whatWeDoForm}
        submitting={state.saving.what}
        onChange={(changes) => dispatch({ type: 'SET_WHAT_WE_DO_FORM', payload: changes })}
        onSubmit={handleWhatWeDoSubmit}
        editing={state.editing.whatWeDo}
        onEditToggle={() => handleEditToggle('whatWeDo')}
        onCancel={() => handleEditCancel('whatWeDo')}
      />
    </section>
  )
}

