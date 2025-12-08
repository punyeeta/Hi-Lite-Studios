import { useState } from 'react'
import StarRed from '@/assets/images/StarRed.png'
import type { FAQItem } from '@/components/sections/context/FAQContext'

type FAQCardProps = {
  item: FAQItem
  isAdmin?: boolean
  preview?: boolean // when true, show truncated answer suitable for homepage preview
  expanded?: boolean // when true, show the full answer by default (non-collapsible)
  onEdit?: (item: FAQItem) => void
  onDelete?: (id: string) => void
  onMoveUp?: (id: string) => void
  onMoveDown?: (id: string) => void
  onToggleFeatured?: (id: string) => void
  featured?: boolean
  onClick?: (item: FAQItem) => void // NEW: trigger modal or custom action
  className?: string
}

const FAQCard = ({
  item,
  isAdmin = false,
  preview = false,
  expanded = false,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleFeatured,
  featured = false,
  onClick,
  className = '',
}: FAQCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick(item) // let parent handle (modal)
    } else if (!isAdmin && !preview) {
      setIsOpen((s) => !s) // fallback: toggle inline expand
    }
  }

  const showToggle = !isAdmin && !preview && !onClick
  const isExpanded = expanded || isOpen

  return (
    <article
      onClick={onClick ? () => onClick(item) : undefined}
      className={`rounded-2xl bg-[#FEF9F8] shadow-[6px_10px_40px_rgba(0,0,0,0.12)] transition hover:shadow-[12px_16px_40px_rgba(0,0,0,0.16)] overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="w-full px-4 py-2 md:px-6 md:py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {showToggle && (
              <button
                type="button"
                onClick={handleClick}
                aria-label={isExpanded ? 'Collapse answer' : 'Expand answer'}
                className="rounded-full p-1.5 transition transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-[#D42724]">
                    <path fill="currentColor" d="M7.41 14.59 12 10l4.59 4.59L18 13.17l-6-6-6 6z" />
                  </svg>
                ) : (
                  <img src={StarRed} alt="expand" className="h-6 w-6" />
                )}
              </button>
            )}
            <h3 className="text-2xl sm:text-base md:text-lg lg:text-2xl font-bold text-[#1E1E1E]">
              {item.question}
            </h3>
          </div>
        </div>
      </div>

      {/* Answer area */}
      {!isAdmin && (preview || expanded || isOpen) && (
        <div className="px-4 py-2 md:px-6 md:py-3 bg-[FEF9F8]">
          <p
            className={`${
              preview
                ? 'text-xs sm:text-sm md:text-base lg:text-lg text-[#5C5C5C] leading-relaxed line-clamp-3'
                : 'text-sm sm:text-base md:text-lg text-[#5C5C5C] leading-relaxed'
            }`}
          >
            {item.answer}
          </p>
        </div>
      )}

      {isAdmin && (
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-gray-700 leading-relaxed mb-4">{item.answer}</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => onMoveUp?.(item.id)}
                className="rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 transition-all duration-150 hover:shadow-sm hover:scale-105 active:scale-95"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMoveDown?.(item.id)}
                className="rounded-lg px-3 py-1 text-sm font-semibold text-gray-700 transition-all duration-150 hover:shadow-sm hover:scale-105 active:scale-95"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onToggleFeatured?.(item.id)}
                className={`rounded-lg px-3 py-1 text-sm font-semibold transition-all duration-150 hover:scale-110 active:scale-95 ${
                  featured ? 'text-yellow-400' : 'text-gray-400'
                }`}
                title="Show on landing"
              >
                {featured ? '★' : '☆'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onEdit?.(item)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-150 hover:shadow-sm hover:scale-105 active:scale-95"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(item.id)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:shadow-lg hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(to right, #F2322E 0%, #AA1815 100%)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default FAQCard