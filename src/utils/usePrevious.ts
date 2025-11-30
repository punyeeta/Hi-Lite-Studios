import { useEffect, useRef } from 'react'

/**
 * Hook to track previous value
 * Useful for detecting when a dependency has actually changed
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
