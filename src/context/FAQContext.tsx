import { createContext, useContext, useState, type ReactNode } from 'react'

export type FAQItem = {
  id: string
  question: string
  answer: string
}

type FAQContextValue = {
  items: FAQItem[]
  addItem: (input: Omit<FAQItem, 'id'>) => void
  updateItem: (id: string, input: Partial<Omit<FAQItem, 'id'>>) => void
  deleteItem: (id: string) => void
}

const FAQContext = createContext<FAQContextValue | undefined>(undefined)

const initialItems: FAQItem[] = [
  {
    id: '1',
    question: 'What is Hi‑Lite Studio?',
    answer:
      'Hi‑Lite Studio is a professional photography and videography studio based in Cagayan de Oro. We specialize in capturing meaningful moments for families, students, organizations, and individuals through a blend of technical precision and emotional storytelling.',
  },
  {
    id: '2',
    question: 'What services do you offer?',
    answer:
      'We offer three main services: Indoor & Studio Photography (portraits, family photos, academic portraits), Outdoor & Event Photography (school events, institutional events, birthday celebrations), and Videography (event highlight videos and full coverage).',
  },
  {
    id: '3',
    question: 'How do I book a session?',
    answer:
      'You can book a session through our website by visiting the "Capture with Us" page and filling out the booking form. You\'ll select your preferred service type, desired date, and provide any special requests. Our team will then contact you to confirm and finalize the details.',
  },
  {
    id: '4',
    question: 'What is your turnaround time for edited photos?',
    answer:
      'Our standard turnaround time for edited photos is 2-3 weeks after the session, depending on the package and complexity. Rush options may be available upon request for an additional fee.',
  },
  {
    id: '5',
    question: 'Do you offer packages or discounts for bulk orders?',
    answer:
      'Yes, we offer various packages tailored to different needs and budgets. We also provide discounts for organizational bulk bookings and repeat clients. Please contact us directly for a customized quote.',
  },
  {
    id: '6',
    question: 'Can I use the photos commercially?',
    answer:
      'Most of our packages include personal use rights for the delivered photos. Commercial usage rights require a separate agreement and additional licensing fees. Please discuss your intended use when booking to ensure proper licensing.',
  },
]

export function FAQProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FAQItem[]>(initialItems)

  const addItem: FAQContextValue['addItem'] = (input) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`
    setItems((prev) => [...prev, { id, ...input }])
  }

  const updateItem: FAQContextValue['updateItem'] = (id, input) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)))
  }

  const deleteItem: FAQContextValue['deleteItem'] = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <FAQContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </FAQContext.Provider>
  )
}

export function useFAQ() {
  const ctx = useContext(FAQContext)
  if (!ctx) {
    throw new Error('useFAQ must be used within a FAQProvider')
  }
  return ctx
}
