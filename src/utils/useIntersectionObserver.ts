import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * Hook to detect when an element enters the viewport
 * Useful for lazy loading sections
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        if (options.triggerOnce !== false) {
          observer.unobserve(entry.target)
        }
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref, isVisible }
}
