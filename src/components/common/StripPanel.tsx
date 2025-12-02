import { useEffect, useRef } from 'react'
import BorderStar from '@/assets/images/BorderStar.png';

export default function InfiniteStrip() {
  const items = ["Capture", "Photography", "Stories", "Trusted", "Moments"];

  const createItem = (item: string, index: number) => (
    <div key={`item-${index}`} className="flex items-center shrink-0">
      <span className="text-white text-sm font-medium whitespace-nowrap px-6">{item}</span>
      <img src={BorderStar} alt="star" className="w-4 h-4 shrink-0 ml-2" />
    </div>
  );

  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const seqRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    const seq = seqRef.current
    if (!container || !track || !seq) return

    let x = 0
    let rafId: number
    const speed = 0.8 // pixels per frame

    const seqWidth = () => seq.getBoundingClientRect().width
    const containerWidth = () => container.getBoundingClientRect().width

    const third = seq.cloneNode(true) as HTMLDivElement
    third.setAttribute('aria-hidden', 'true')
    track.appendChild(third)

    const step = () => {
      x -= speed
      const width = seqWidth()
      if (x <= -width) {
        x += width
      }
      track.style.transform = `translateX(${x}px)`
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div ref={containerRef} className="w-screen overflow-hidden bg-linear-to-r from-blue-950 to-indigo-700 py-2">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {/* First sequence (measure width) */}
        <div ref={seqRef} className="flex">
          {items.map((item, idx) => createItem(item, idx))}
        </div>
        {/* Second sequence to fill the wrap immediately */}
        <div aria-hidden="true" className="flex">
          {items.map((item, idx) => createItem(item, idx))}
        </div>
        {/* Third sequence to guarantee right-edge continuity */}
        <div aria-hidden="true" className="flex">
          {items.map((item, idx) => createItem(item, idx))}
        </div>
      </div>
    </div>
  )
}