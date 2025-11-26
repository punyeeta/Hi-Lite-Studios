import Intersect from '@/assets/images/Intersect.png'

const Appointment = () => {
  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16">
        {/* decorative burst */}
        <img
          src={Intersect}
          alt="Decorative star"
          className="pointer-events-none absolute -left-24 top-10 hidden h-72 w-72 opacity-70 lg:block"
        />

        {/* hero heading */}
        <div className="space-y-4 text-center lg:text-left">
          <p className="text-4xl font-light text-[#F7A800]">
            Ready to <span className="italic font-semibold text-[#FF8C00]">hi-lite</span> your moment?
          </p>
          <div className="mx-auto h-0.5 w-full bg-linear-to-r from-transparent via-[#1f1f1f]/30 to-transparent lg:mx-0" />
        </div>

        {/* form section */}
        <section className="grid gap-12 lg:grid-cols-[1.2fr,0.8fr]">
          {/* form */}
          <form className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="First Name*" placeholder="Jane" />
              <InputField label="Last Name*" placeholder="Doe" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="Email*" placeholder="you@email.com" type="email" />
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wide text-[#6b6b6b]">
                  Type of Inquiry*
                </label>
                <select className="w-full rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#8757ff] focus:outline-none focus:ring-2 focus:ring-[#d9c5ff]">
                  <option>Indoor & Studio Sessions</option>
                  <option>Outdoor & Event Coverage</option>
                  <option>Videography</option>
                  <option>General Inquiry</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wide text-[#6b6b6b]">
                  Description*
                </label>
                <textarea
                  rows={7}
                  className="w-full rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#8757ff] focus:outline-none focus:ring-2 focus:ring-[#d9c5ff]"
                  placeholder="Tell us about your project, schedule, or any special details."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium uppercase tracking-wide text-[#6b6b6b]">
                  Date*
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#8757ff] focus:outline-none focus:ring-2 focus:ring-[#d9c5ff]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#1f1f1f] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#3a3a3a]"
            >
              Submit
            </button>
          </form>

          {/* right column placeholder (optional) */}
          <div className="hidden lg:block">
            {/* You can add a decorative image, contact info, or branding here */}
          </div>
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
  <div className="space-y-2">
    <label className="text-sm font-medium uppercase tracking-wide text-[#6b6b6b]">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#d7d7d7] px-4 py-3 text-sm text-[#2f2f2f] focus:border-[#8757ff] focus:outline-none focus:ring-2 focus:ring-[#d9c5ff]"
    />
  </div>
)

export default Appointment