/**
 * Custom hook for managing form state
 * Reduces boilerplate and provides consistent form handling
 */

import { useState, useCallback, type ChangeEvent } from 'react'

interface UseFormStateOptions<T> {
  initialState: T
  onValidationError?: (error: string) => void
}

interface UseFormStateReturn<T> {
  form: T
  setForm: (form: T) => void
  handleChange: (field: keyof T) => (value: any) => void
  handleInputChange: (
    field: keyof T,
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  resetForm: (newState?: T) => void
  updateField: (field: keyof T, value: any) => void
}

export function useFormState<T extends Record<string, any>>(
  options: UseFormStateOptions<T>,
): UseFormStateReturn<T> {
  const { initialState } = options
  const [form, setForm] = useState<T>(initialState)

  const resetForm = useCallback(
    (newState?: T) => {
      setForm(newState || initialState)
    },
    [initialState],
  )

  const updateField = useCallback((field: keyof T, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      updateField(field, value)
    },
    [updateField],
  )

  const handleInputChange = useCallback(
    (field: keyof T) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.value

      updateField(field, value)
    },
    [updateField],
  )

  return {
    form,
    setForm,
    handleChange,
    handleInputChange,
    resetForm,
    updateField,
  }
}
