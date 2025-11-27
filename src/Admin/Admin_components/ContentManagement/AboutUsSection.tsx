import { useState, useEffect, type ChangeEvent } from 'react'
import {
  fetchAboutUs,
  updateAboutUs,
  fetchStaff,
  addStaff,
  deleteStaff,
  uploadAboutUsImage,
  type AboutUs as AboutUsType,
  type AboutUsStaff,
} from '@/supabase/supabase_services/Content_Management/AboutUs_Servicce/AboutUs'

export default function AboutUsSection() {
  const [aboutUs, setAboutUs] = useState<AboutUsType | null>(null)
  const [staff, setStaff] = useState<AboutUsStaff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newStaffName, setNewStaffName] = useState('')
  const [addingStaff, setAddingStaff] = useState(false)

  // Form states for different sections
  const [mainSection, setMainSection] = useState({
    main_image_url: '',
    description: '',
    editing: false,
  })

  const [meetTeamSection, setMeetTeamSection] = useState({
    title: '',
    subtitle: '',
    editing: false,
  })

  const [whatWeDoSection, setWhatWeDoSection] = useState({
    title: '',
    description: '',
    editing: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [aboutUsData, staffData] = await Promise.all([
        fetchAboutUs(),
        fetchStaff(),
      ])
      setAboutUs(aboutUsData)
      setStaff(staffData)

      // Initialize form states
      setMainSection({
        main_image_url: aboutUsData.main_image_url || '',
        description: aboutUsData.description || '',
        editing: false,
      })
      setMeetTeamSection({
        title: aboutUsData.meet_team_title || 'Meet The Team',
        subtitle: aboutUsData.meet_team_subtitle || '',
        editing: false,
      })
      setWhatWeDoSection({
        title: aboutUsData.what_we_do_title || 'What We Do',
        description: aboutUsData.what_we_do_description || '',
        editing: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load about us data')
    } finally {
      setLoading(false)
    }
  }

  const handleMainImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)
    try {
      const { publicUrl } = await uploadAboutUsImage(file)
      setMainSection((prev) => ({ ...prev, main_image_url: publicUrl }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSaveMainSection = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const updated = await updateAboutUs({
        main_image_url: mainSection.main_image_url || null,
        description: mainSection.description || null,
      })
      // Update local state instead of reloading
      setAboutUs(updated)
      setMainSection((prev) => ({ ...prev, editing: false }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save main section')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveMeetTeam = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const updated = await updateAboutUs({
        meet_team_title: meetTeamSection.title || null,
        meet_team_subtitle: meetTeamSection.subtitle || null,
      })
      // Update local state instead of reloading
      setAboutUs(updated)
      setMeetTeamSection((prev) => ({ ...prev, editing: false }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meet team section')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveWhatWeDo = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const updated = await updateAboutUs({
        what_we_do_title: whatWeDoSection.title || null,
        what_we_do_description: whatWeDoSection.description || null,
      })
      // Update local state instead of reloading
      setAboutUs(updated)
      setWhatWeDoSection((prev) => ({ ...prev, editing: false }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save what we do section')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddStaff = async () => {
    if (!newStaffName.trim()) return

    setAddingStaff(true)
    setError(null)
    try {
      const newStaff = await addStaff({ name: newStaffName.trim() })
      setNewStaffName('')
      // Add to local state instead of reloading everything
      setStaff((prev) => [...prev, newStaff])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add staff')
    } finally {
      setAddingStaff(false)
    }
  }

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return

    try {
      await deleteStaff(id)
      // Remove from local state instead of reloading everything
      setStaff((prev) => prev.filter((member) => member.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete staff')
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>
  }

  return (
    <section className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Main Image & Description Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Main Content</h2>
          <div className="flex gap-2">
            {mainSection.editing ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveMainSection}
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMainSection({
                      main_image_url: aboutUs?.main_image_url || '',
                      description: aboutUs?.description || '',
                      editing: false,
                    })
                  }}
                  disabled={submitting}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMainSection((prev) => ({ ...prev, editing: true }))}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
          {/* Image Section */}
          <div className="space-y-4">
            {mainSection.editing ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">Main Image</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={mainSection.main_image_url}
                    onChange={(e) =>
                      setMainSection((prev) => ({ ...prev, main_image_url: e.target.value }))
                    }
                    placeholder="Image URL or upload file..."
                    disabled={submitting}
                  />
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      disabled={uploadingImage || submitting}
                    />
                  </label>
                </div>
              </div>
            ) : null}
            {mainSection.main_image_url && (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={mainSection.main_image_url}
                  alt="About Us"
                  className="h-64 w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-800">DESCRIPTION</label>
              {mainSection.editing ? (
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  rows={8}
                  value={mainSection.description}
                  onChange={(e) =>
                    setMainSection((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Enter description..."
                  disabled={submitting}
                />
              ) : (
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  {mainSection.description || 'No description yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meet The Team Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Meet The Team</h2>
          <div className="flex gap-2">
            {meetTeamSection.editing ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveMeetTeam}
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMeetTeamSection({
                      title: aboutUs?.meet_team_title || 'Meet The Team',
                      subtitle: aboutUs?.meet_team_subtitle || '',
                      editing: false,
                    })
                  }}
                  disabled={submitting}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMeetTeamSection((prev) => ({ ...prev, editing: true }))}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">TITLE</label>
            {meetTeamSection.editing ? (
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={meetTeamSection.title}
                onChange={(e) =>
                  setMeetTeamSection((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={submitting}
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{meetTeamSection.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">SUBTITLE</label>
            {meetTeamSection.editing ? (
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={meetTeamSection.subtitle}
                onChange={(e) =>
                  setMeetTeamSection((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                disabled={submitting}
              />
            ) : (
              <p className="text-sm text-gray-700">{meetTeamSection.subtitle || 'No subtitle yet.'}</p>
            )}
          </div>

          {/* Staff Management */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Staff Members</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Insert Name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddStaff()
                    }
                  }}
                  disabled={addingStaff}
                />
                <button
                  type="button"
                  onClick={handleAddStaff}
                  disabled={addingStaff || !newStaffName.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingStaff ? 'Adding...' : 'Add Staff'}
                </button>
              </div>
            </div>

            {staff.length === 0 ? (
              <p className="text-sm text-gray-500">No staff members yet. Add one to get started!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <span className="text-sm font-medium text-gray-900">{member.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteStaff(member.id)}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">What We Do</h2>
          <div className="flex gap-2">
            {whatWeDoSection.editing ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveWhatWeDo}
                  disabled={submitting}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWhatWeDoSection({
                      title: aboutUs?.what_we_do_title || 'What We Do',
                      description: aboutUs?.what_we_do_description || '',
                      editing: false,
                    })
                  }}
                  disabled={submitting}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setWhatWeDoSection((prev) => ({ ...prev, editing: true }))}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">TITLE</label>
            {whatWeDoSection.editing ? (
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={whatWeDoSection.title}
                onChange={(e) =>
                  setWhatWeDoSection((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={submitting}
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{whatWeDoSection.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">DESCRIPTION</label>
            {whatWeDoSection.editing ? (
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                rows={6}
                value={whatWeDoSection.description}
                onChange={(e) =>
                  setWhatWeDoSection((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter description..."
                disabled={submitting}
              />
            ) : (
              <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                {whatWeDoSection.description || 'No description yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

