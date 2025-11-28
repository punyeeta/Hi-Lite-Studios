import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { createBooking } from '@/supabase/supabase_services/admin_boooking/bookings'
import { validateEmail } from '@/utils/formValidation'

const INQUIRY_TYPES = [
  { value: 'indoor_studio_photography', label: 'Indoor & Studio Photography' },
  { value: 'outdoor_event_photography', label: 'Outdoor Event Photography' },
  { value: 'videography', label: 'Videography' },
]

const BookingForm = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [inquiryType, setInquiryType] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get today's date at midnight for comparison
  const getTodayAtMidnight = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!firstName || !lastName || !email || !inquiryType || !date) {
      setError('Please complete all required fields.')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Validate date is not in the past
    const selectedDateAtMidnight = new Date(date)
    selectedDateAtMidnight.setHours(0, 0, 0, 0)
    if (selectedDateAtMidnight < getTodayAtMidnight()) {
      setError('Please select a future date for your booking.')
      return
    }

    const eventDate = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
          date.getDate(),
        ).padStart(2, '0')}`
      : ''

    try {
      setSubmitting(true)
      await createBooking({
        client_first_name: firstName,
        client_last_name: lastName,
        email,
        type: inquiryType,
        event_date: eventDate,
        notes: description || null,
      })

      setMessage('Your booking request has been submitted!')
      setFirstName('')
      setLastName('')
      setEmail('')
      setInquiryType('')
      setDescription('')
      setDate(new Date())
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong while submitting.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
      {/* name fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="First Name*"
          placeholder="Rhenel"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <InputField
          label="Last Name*"
          placeholder="Sajol"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* email + inquiry type */}
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Email*"
          placeholder="you@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium uppercase tracking-wide text-[#2b2b2b]">
            Type of Inquiry*
          </label>
          <div className="relative">
            <select
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#291471] focus:outline-none focus:ring-2 focus:ring-[#4f80eb]"
            >
              <option value="" disabled hidden>
                Select inquiry type
              </option>
              {INQUIRY_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b6b6b]">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* description + calendar */}
      <div className="flex gap-4 items-stretch">
        {/* Textarea column */}
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium uppercase tracking-wide text-[#2b2b2b]">
            Description*
          </label>
          <textarea
            className="w-full flex-1 rounded-lg border border-[#d7d7d7] px-4 py-3 text-md text-[#2f2f2f] 
                       focus:border-[#291471] focus:outline-none focus:ring-2 focus:ring-[#4f80eb]"
            placeholder="Tell us about your project, schedule, or any special details."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Calendar column */}
        <div className="w-80 flex flex-col">
          <label className="text-sm font-medium uppercase tracking-wide text-[#2b2b2b]">
            Preferred Date*
          </label>
          <div className="flex-1 rounded-2xl border border-[#dcdcdc] p-2 flex justify-center">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate}
              disabled={(date) => {
                // Disable all dates before today
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const checkDate = new Date(date)
                checkDate.setHours(0, 0, 0, 0)
                return checkDate < today
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Only future dates are available</p>
        </div>
      </div>

      {/* submit + feedback */}
      <div className="space-y-3">
        <button
          type="submit"
          disabled={submitting}
          className="w-50 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#fd8989] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        {message && (
          <p className="text-sm text-green-600">
            {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}

const InputField = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="space-y-3">
    <label className="text-sm font-medium uppercase tracking-wide text-[#2b2b2b]">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#291471] focus:outline-none focus:ring-2 focus:ring-[#4f80eb]"
    />
  </div>
)

export default BookingForm

