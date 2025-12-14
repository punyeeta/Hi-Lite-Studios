import { memo } from 'react'
import StarService from '@/assets/images/ServiceStar.png'

const Privacy = memo(() => {
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
        <h1 className="text-5xl md:text-4xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-base text-[#666] mb-6">Last updated: December 05, 2025</p>

        <p className="mb-4">
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you use our website at <a href="https://hi-lite-studio.vercel.app/" className="underline">https://hi-lite-studio.vercel.app/</a> (the “Website”).
          By using the Website, you consent to the practices described in this Policy.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Scope and Applicable Law</h2>
        <p className="mb-4">
          We process personal data in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173)
          and its Implementing Rules and Regulations, as well as applicable guidance from the National Privacy Commission of the Philippines.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Definitions</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><span className="font-semibold">Account</span>: A unique profile you may create to access parts of the Website.</li>
          <li><span className="font-semibold">Company</span>: “Hi-Lite Studio”, “we”, “us”, or “our”, referring to the operator of the Website.</li>
          <li><span className="font-semibold">Cookies</span>: Small text files stored on your device to help operate and improve the Website.</li>
          <li><span className="font-semibold">Country</span>: The Republic of the Philippines.</li>
          <li><span className="font-semibold">Device</span>: Any device that can access the Website (e.g., computer, phone, tablet).</li>
          <li><span className="font-semibold">Personal Data</span>: Information relating to an identified or identifiable individual.</li>
          <li><span className="font-semibold">Service</span>: The Website and related features.</li>
          <li><span className="font-semibold">Service Provider</span>: Third parties engaged to help deliver or analyze the Service.</li>
          <li><span className="font-semibold">Usage Data</span>: Data collected automatically (e.g., page views, device and browser information).</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">Personal Data We Collect</h2>
        <p className="mb-2">We may collect the following information:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Email address</li>
          <li>First and last name</li>
          <li>Phone number</li>
          <li>Usage Data (IP address, browser type/version, pages visited, timestamps, device identifiers)</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">Cookies and Tracking Technologies</h2>
        <p className="text-base mb-4">
          We use Cookies and similar technologies (e.g., tags, pixels, beacons) to operate, improve, and
          analyze the Website. You can configure your browser to refuse Cookies or alert you when Cookies are set.
          Some features may not function properly without Cookies.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide, operate, and maintain the Website</li>
          <li>Manage accounts and user access</li>
          <li>Perform and enforce contracts, bookings, or services you request</li>
          <li>Communicate with you about updates, features, offers, and events (subject to your preferences)</li>
          <li>Respond to inquiries and support requests</li>
          <li>Analyze usage and improve performance, security, and user experience</li>
          <li>Comply with applicable laws and protect our rights and users</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">When We Share Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>With Service Providers assisting in analytics, communications, or operations</li>
          <li>During business transfers (e.g., merger or acquisition), subject to legal safeguards</li>
          <li>With affiliates and business partners, where appropriate and subject to this Policy</li>
          <li>With other users, if you post or share information in public areas</li>
          <li>With your consent or as otherwise permitted by law</li>
        </ul>

        <h2 className="text-3xl font-bold mt-8 mb-3">Retention</h2>
        <p className="text-base mb-4">
          We retain Personal Data only as long as necessary for the purposes stated in this Policy and to comply
          with legal obligations, resolve disputes, and enforce agreements. Usage Data may be retained for shorter periods,
          unless needed to improve security or functionality.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Cross-Border Transfers</h2>
        <p className="text-base mb-4">
          Personal Data may be processed in the Philippines and other jurisdictions. We take reasonable steps to ensure that
          transfers comply with applicable data protection requirements.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Your Rights</h2>
        <p className="text-base mb-2">Subject to Philippine law, you may:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access, correct, or update your Personal Data</li>
          <li>Request deletion, object to processing, or withdraw consent (where applicable)</li>
          <li>File a complaint with the National Privacy Commission (NPC)</li>
        </ul>
        <p className="text-base mb-4">
          To exercise these rights, contact us using the details below. We may need to verify your identity before acting on requests.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Security</h2>
        <p className="text-base mb-4">
          We implement commercially reasonable safeguards to protect Personal Data. No method of transmission or storage is
          completely secure; we cannot guarantee absolute security.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Children’s Privacy</h2>
        <p className="text-base mb-4">
          The Website is not directed to children under 13, and we do not knowingly collect Personal Data from them. If you believe
          a child has provided Personal Data, please contact us so we can take appropriate action.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Third-Party Links</h2>
        <p className="text-base mb-4">
          Our Website may contain links to third-party sites. We are not responsible for their content or privacy practices.
          Please review the privacy policies of any site you visit.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Changes to This Policy</h2>
        <p className="text-base mb-4">
          We may update this Policy from time to time. We will post the updated Policy on this page and revise the “Last updated”
          date above. Continued use of the Website signifies your acceptance of any changes.
        </p>

        <h2 className="text-3xl font-bold mt-8 mb-3">Contact Us</h2>
        <p className="text-base mb-2">If you have questions or requests about this Privacy Policy, contact us:</p>
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

Privacy.displayName = 'Privacy'

export default Privacy