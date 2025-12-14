export interface BookingsHeaderAction {
  label: string
  onClick: () => Promise<void> | void
  color: string
}

export interface BookingsHeaderProps {
  selectedCount: number
  loading?: boolean
  actions: BookingsHeaderAction[]
}

export default function BookingsHeader({
  selectedCount,
  loading = false,
  actions,
}: BookingsHeaderProps) {
  const isDisabled = !selectedCount || loading

  if (actions.length === 0) return null

  return (
    <div className="flex gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          type="button"
          onClick={action.onClick}
          disabled={isDisabled}
          className="rounded-md px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: isDisabled ? '#cccccc' : action.color }}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
