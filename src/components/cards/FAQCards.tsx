import { useState } from 'react'
import type { FAQItem } from '@/context/FAQContext'

type FAQCardProps = {
  item: FAQItem
  isAdmin?: boolean
  preview?: boolean // when true, show truncated answer suitable for homepage preview
  expanded?: boolean // when true, show the full answer by default (non-collapsible)
  onEdit?: (item: FAQItem) => void
  onDelete?: (id: string) => void
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

  return (
    <article
      className={`rounded-2xl bg-white shadow-[6px_10px_40px_rgba(0,0,0,0.20)] transition hover:shadow-[12px_16px_40px_rgba(0,0,0,0.16)] overflow-hidden ${className}`}
    >
      <div
        className={`w-full px-4 py-3 mt-2 text-left ${
          !isAdmin && !preview ? 'cursor-pointer hover:bg-gray-50' : ''
        } ${isAdmin ? 'cursor-default' : ''}`}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-[#333333] flex-1">
            {item.question}
          </h3>
          {!isAdmin && !preview && !onClick && (
            <div
              className={`text-2xl text-gray-400 transition shrink-0 ${
                isOpen ? 'rotate-45' : ''
              }`}
            >
              +
            </div>
          )}
        </div>
      </div>

      {/* Answer area */}
      {!isAdmin && (preview || expanded || isOpen) && (
        <div className="px-4 py-2 mb-2 bg-white">
          <p
            className={`${
              preview
                ? 'text-sm text-gray-600 leading-relaxed line-clamp-3'
                : 'text-gray-700 leading-relaxed'
            }`}
          >
            {item.answer}
          </p>
        </div>
      )}

      {isAdmin && (
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-gray-700 leading-relaxed mb-4">{item.answer}</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default FAQCard