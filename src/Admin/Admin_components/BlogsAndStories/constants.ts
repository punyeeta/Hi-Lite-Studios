/**
 * BlogsAndStories Color Constants
 */
export const BLOG_COLORS = {
  PRIMARY_PURPLE: '#291471',
  DARK_PURPLE: '#1e0f55',
  PRIMARY_RED: '#F2322E',
  DARK_RED: '#AA1815',
  SECONDARY_GRAY: '#9CA3AF',
  TERTIARY_GRAY: '#6B7280',
  RED_GRADIENT: 'linear-gradient(to right, #F2322E 0%, #AA1815 100%)',
  GRAY_GRADIENT: 'linear-gradient(to right, #9CA3AF 0%, #6B7280 100%)',
  LIGHT_GRAY_GRADIENT: 'linear-gradient(to right, #f3f4f6 0%, #e5e7eb 100%)',
} as const

/**
 * BlogsAndStories Error Messages
 */
export const BLOG_ERRORS = {
  FETCH_COVER: 'Failed to upload cover image',
  FETCH_BODY_IMAGE: 'Failed to upload image for content',
  SAVE_STORY: 'Failed to save story',
  TITLE_REQUIRED: 'Title is required',
  CONTENT_REQUIRED: 'Content is required',
  DELETE_POST: 'Delete this post? This action cannot be undone.',
} as const

/**
 * BlogsAndStories Modal Labels
 */
export const BLOG_LABELS = {
  DELETE_TITLE: 'Delete post',
  DELETE_CONFIRM: 'Delete',
  DELETE_CANCEL: 'Cancel',
} as const
