export interface BookingsHeaderProps {
  selectedCount: number
  loading?: boolean
  onApproveSelected: () => Promise<void> | void
  onDeclineSelected: () => Promise<void> | void
}

export default function BookingsHeader({
  selectedCount,
  loading = false,
  onApproveSelected,
  onDeclineSelected,
}: BookingsHeaderProps) {
  const isDisabled = !selectedCount || loading

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onApproveSelected}
        disabled={isDisabled}
        className="rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: isDisabled ? '#cccccc' : '#FFC800' }}
      >
        Approve Selected
      </button>
      <button
        type="button"
        onClick={onDeclineSelected}
        disabled={isDisabled}
        className="rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: isDisabled ? '#cccccc' : '#EE0202' }}
      >
        Decline Selected
      </button>
    </div>
  )
}
