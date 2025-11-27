import { useState } from 'react'
import WorksCollection from '../WorksCollection/WorksCollection'
import AdminFAQ from '../AdminFAQs/AdminFAQ'
import AboutUsTab from './index'

type Tab = 'works' | 'about' | 'faq'

const TABS: { id: Tab; label: string }[] = [
  { id: 'works', label: 'Works Collection' },
  { id: 'about', label: 'About Us' },
  { id: 'faq', label: 'FAQs' },
]

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<Tab>('works')

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-md font-medium text-[#D42724]">Welcome, Admin.</p>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Content Management
        </h1>
      </header>

      {/* Tab Navigation */}
      <div className="inline-flex rounded-full bg-[gray-100] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-md transition ${
              activeTab === tab.id
                ? 'bg-[#E2E2E2] text-[#291471] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'works' && <WorksCollection />}
        {activeTab === 'about' && <AboutUsTab />}
        {activeTab === 'faq' && <AdminFAQ />}
      </div>
    </section>
  )
}
