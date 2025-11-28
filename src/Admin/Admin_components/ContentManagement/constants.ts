/**
 * ContentManagement Color Constants
 */
export const COLORS = {
  PRIMARY_BLUE: '#1E40AF',
  PRIMARY_RED: '#D42724',
  PRIMARY_PURPLE: '#291471',
  SECONDARY_GRAY: '#9CA3AF',
  TERTIARY_GRAY: '#6B7280',
  RED_GRADIENT: 'linear-gradient(to right, #F2322E 0%, #AA1815 100%)',
  GRAY_GRADIENT: 'linear-gradient(to right, #9CA3AF 0%, #6B7280 100%)',
} as const

/**
 * AboutUS Error Messages
 */
export const ABOUT_US_ERRORS = {
  SAVE_MAIN: 'Failed to save main section.',
  SAVE_TEAM: 'Failed to save meet the team section.',
  SAVE_WHAT_WE_DO: 'Failed to save what we do section.',
  UPLOAD_IMAGE: 'Failed to upload image.',
  ADD_STAFF: 'Failed to add staff.',
  DELETE_STAFF: 'Failed to delete staff.',
  LOAD_DATA: 'Failed to load About Us data.',
} as const

/**
 * Form Section Types
 */
export const FORM_SECTIONS = {
  MAIN: 'main',
  MEET_TEAM: 'meetTeam',
  WHAT_WE_DO: 'whatWeDo',
} as const

/**
 * Saving States
 */
export const SAVING_STATES = {
  MAIN: 'main',
  TEAM: 'team',
  WHAT: 'what',
  UPLOADING: 'uploading',
  ADDING_STAFF: 'addingStaff',
} as const

/**
 * Empty Form Values
 */
export const EMPTY_FORMS = {
  MAIN: { main_image_url: '', description: '' },
  MEET_TEAM: { title: '', subtitle: '' },
  WHAT_WE_DO: { title: '', description: '' },
} as const
