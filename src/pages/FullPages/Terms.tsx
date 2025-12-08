import { memo } from 'react'
import StarService from '@/assets/images/ServiceStar.png'

const Terms = memo(() => {
  return (
    <div className="page-fade min-h-screen bg-white text-[#222]">
      <div className="relative w-full flex flex-col items-center pt-16 sm:pt-16 px-2 sm:px-0">
        <div className="relative w-full mb-8">
          <div className="h-0.5 w-full bg-yellow-500" />
          <img
            src={StarService}
            alt="star-service"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16"
          />
        </div>
      </div>
      <section className="w-full mx-auto px-8 md:px-16 lg:px-20 py-8">
        <h1 className="text-5xl md:text-4xl font-extrabold mb-4">Terms of Service</h1>
        <p className="text-base text-[#666] mb-6">Last updated: December 05, 2025</p>

        <p className="text-base mb-4">
          These Terms of Service (the “Terms”) govern your access to and use of
          <a href="https://hi-lite-studio.vercel.app/" className="underline"> https://hi-lite-studio.vercel.app/</a>
          (the “Website”) operated by Hi-Lite Studio (“we”, “us”, “our”). By accessing or using the Website,
          you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Website.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Eligibility</h2>
        <p className="text-base mb-4">You must be at least 18 years old or have parental/guardian consent to use the Website.</p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Services and Bookings</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Our Website allows you to explore services, request information, and book appointments.</li>
          <li>Bookings may be confirmed via email or phone. Specific service agreements, scope, deliverables, and fees may be set out in a separate contract or written confirmation.</li>
          <li>Rescheduling and cancellations should be requested in advance. Any fees, deposits, or cancellation charges will be disclosed before confirmation.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate information when contacting us or making bookings.</li>
          <li>Do not misuse the Website (e.g., introducing malware, scraping without permission, or attempting to circumvent security).</li>
          <li>Respect intellectual property; do not upload or share content that infringes third-party rights.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">Intellectual Property</h2>
        <p className="text-base mb-4">
          The Website, its design, text, graphics, logos, images, and other materials are owned by or licensed to Hi-Lite Studio
          and are protected under applicable laws, including the Intellectual Property Code of the Philippines (R.A. 8293).
          You may not reproduce, distribute, or create derivative works from our materials without prior written consent.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Content and Client Materials</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>We may feature our works (e.g., photography, videography) on the Website and social media, subject to your consent or contractual terms.</li>
          <li>Clients warrant they have obtained consent from subjects featured in shoots and that materials provided do not violate third-party rights.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">Data Privacy</h2>
        <p className="text-base mb-4">
          We process personal data in accordance with the Data Privacy Act of 2012 (R.A. 10173). Please review our Privacy Policy.
          By using the Website, you consent to our processing activities consistent with that Policy.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Payments and Invoices</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Where fees apply, payment terms will be communicated in advance and may be documented via invoice or contract.</li>
          <li>Deposits, if any, may be non-refundable unless otherwise stated.</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">Limitations of Liability</h2>
        <p className="text-base mb-4">
          To the extent permitted by Philippine law, Hi-Lite Studio shall not be liable for indirect, incidental, or consequential damages,
          or for losses arising from events beyond our reasonable control (e.g., force majeure events, network outages).
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Warranties</h2>
        <p className="text-base mb-4">
          The Website is provided “as is” and “as available”. We make no warranties regarding uninterrupted access or error-free operation.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Third-Party Links</h2>
        <p className="text-base mb-4">
          The Website may contain links to third-party sites. We are not responsible for their content or practices.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Termination</h2>
        <p className="text-base mb-4">
          We may suspend or terminate access to the Website if you violate these Terms or engage in unlawful conduct.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Governing Law and Dispute Resolution</h2>
        <p className="text-base mb-4">
          These Terms are governed by the laws of the Republic of the Philippines. Disputes shall be resolved through good-faith negotiations.
          If unresolved, parties may seek recourse with the appropriate courts in the Philippines.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Changes to the Terms</h2>
        <p className="text-base mb-4">
          We may update these Terms from time to time. We will post updates on this page and revise the “Last updated” date above.
          Continued use of the Website indicates acceptance of the updated Terms.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Contact Us</h2>
        <p className="mb-2">For questions about these Terms, contact us:</p>
        <ul className="list-disc pl-6">
          <li>By email: <a href="mailto:studiohilite84@gmail.com" className="underline">studiohilite84@gmail.com</a></li>
        </ul>
      </section>
      <div className="relative w-full flex flex-col items-center pt-6 sm:pt-6 pb-8 sm:pb-8 px-2 sm:px-0">
        <div className="relative w-full mb-8">
          <div className="h-0.5 w-full bg-yellow-500" />
          <img
            src={StarService}
            alt="star-service"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16"
          />
        </div>
      </div>
    </div>
  )
})

Terms.displayName = 'Terms'

export default Terms