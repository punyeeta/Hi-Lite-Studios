import StaffList from './StaffList'

type MeetTeamValues = {
  title: string
  subtitle: string
}

type MeetTeamFormProps = {
  values: MeetTeamValues
  newStaffName: string
  submitting: boolean
  addingStaff: boolean
  staff: Parameters<typeof StaffList>[0]['staff']
  onChange: (changes: Partial<MeetTeamValues>) => void
  onSubmit: () => void
  onAddStaff: () => void
  onNewStaffNameChange: (value: string) => void
  onDeleteStaff: (id: string) => void
  editing: boolean
  onEditToggle: () => void
  onCancel: () => void
}

export default function MeetTeamForm({
  values,
  newStaffName,
  submitting,
  addingStaff,
  staff,
  onChange,
  onSubmit,
  onAddStaff,
  onNewStaffNameChange,
  onDeleteStaff,
  editing,
  onEditToggle,
  onCancel,
}: MeetTeamFormProps) {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="rounded px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: '#1E40AF' }}
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onEditToggle}
              className="rounded px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
              style={{ backgroundColor: '#1E40AF' }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">TITLE</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={values.title}
            onChange={(e) => onChange({ title: e.target.value })}
            disabled={!editing || submitting}
            placeholder="Title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">SUBTITLE</label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={values.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            disabled={!editing || submitting}
            placeholder="Subtitle"
          />
        </div>

        {/* Add Staff Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Add Staff Member</label>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              className="rounded border border-gray-300 px-2 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={newStaffName}
              onChange={(e) => onNewStaffNameChange(e.target.value)}
              placeholder="Insert Name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddStaff()
                }
              }}
              disabled={!editing || addingStaff}
            />
            <button
              type="button"
              onClick={onAddStaff}
              disabled={!editing || addingStaff || !newStaffName.trim()}
              className="rounded px-3 py-1 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: '#1E40AF' }}
            >
              {addingStaff ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Staff Members</label>
          {staff.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {staff.map((member) => (
                <div key={member.id} className="space-y-2">
                  <input
                    type="text"
                    value={member.name}
                    disabled
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDeleteStaff(member.id)}
                      className="rounded px-2 py-0.5 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{
                        background: 'linear-gradient(to right, #F2322E 0%, #AA1815 100%)',
                      }}
                      disabled={!editing}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No staff members added yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

