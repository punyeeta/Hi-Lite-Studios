import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import IntersectTL from '@/assets/images/IntersectTL.png'
import IntersectBR from '@/assets/images/IntersectBR.png';
import StarService from '@/assets/images/StarService.png'

const Appointment = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <div className="min-h-screen bg-white text-[#1f1f1f] relative overflow-hidden">
            <img
            src={IntersectTL}
            alt="Decorative star"
            className="pointer-events-none absolute -left-80 -top-40 hidden lg:block z-0"
            />

            <img
            src={IntersectBR}
            alt="Decorative star"
            className="pointer-events-none absolute -right-90 -bottom-100 hidden lg:block z-0"
            />
            
        <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 z-10">
            <div className="relative w-full mb-4 mt-10">
                <img
                src={StarService}
                alt="star-service"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40"
                />
            </div>

            {/* hero heading */}
            <div className="space-y-4 text-center lg:text-center">
            <p className="text-4xl font-medium text-[#F7A800] mb-6">
                Ready to <span className="italic font-medium text-[#FF8C00]">hi-lite</span> your moment?
            </p>
            <div className="mx-auto h-1 w-full bg-linear-to-r from-transparent via-[#FF8C00]/30 to-transparent lg:mx-0" />
            </div>

        {/* form section */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            {/* name fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="First Name*" placeholder="Rhenel" />
              <InputField label="Last Name*" placeholder="Sajol" />
            </div>

            {/* email + inquiry type */}
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="Email*" placeholder="you@email.com" type="email" />
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wide text-[#2b2b2b]">
                  Type of Inquiry*
                </label>
                <div className="relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#291471] focus:outline-none focus:ring-2 focus:ring-[#4f80eb]"
                  >
                    <option value="" disabled hidden>
                      Select inquiry type
                    </option>
                    <option>Indoor & Studio Sessions</option>
                    <option>Outdoor & Event Coverage</option>
                    <option>Videography</option>
                    <option>General Inquiry</option>
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
                />
              </div>

              {/* Calendar column */}
              <div className="w-80 flex flex-col">
                <label className="text-sm font-medium uppercase tracking-wide text-[#2b2b2b]">
                  Preferred Date*
                </label>
                <div className="flex-1 rounded-2xl border border-[#dcdcdc] p-2 flex justify-center">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>
              </div>
            </div>

            {/* submit button */}
            <button
              type="submit"
              className="w-50 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#fd8989]"
            >
              Submit
            </button>
        </section>
      </main>
    </div>
  )
}

const InputField = ({
  label,
  placeholder,
  type = 'text',
}: {
  label: string
  placeholder?: string
  type?: string
}) => (
  <div className="space-y-3">
    <label className="text-sm font-medium uppercase tracking-wide text-[#2b2b2b]">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#291471] focus:outline-none focus:ring-2 focus:ring-[#4f80eb]"
    />
  </div>
)

export default Appointment