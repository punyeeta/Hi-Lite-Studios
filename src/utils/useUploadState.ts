/**
 * Custom hook for managing upload state
 * Handles loading, errors, and file management for uploads
 */

import { useState, useCallback } from 'react'

interface UseUploadStateReturn {
  uploading: boolean
  error: string | null
  setUploading: (uploading: boolean) => void
  setError: (error: string | null) => void
  startUpload: () => void
  endUpload: (success: boolean, errorMessage?: string) => void
  clearError: () => void
}

export function useUploadState(): UseUploadStateReturn {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startUpload = useCallback(() => {
    setUploading(true)
    setError(null)
  }, [])

  const endUpload = useCallback((success: boolean, errorMessage?: string) => {
    setUploading(false)
    if (!success && errorMessage) {
      setError(errorMessage)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploading,
    error,
    setUploading,
    setError,
    startUpload,
    endUpload,
    clearError,
  }
}
