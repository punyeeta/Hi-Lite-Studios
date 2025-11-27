import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { fetchAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/supabase/supabase_services/Content_Management/FAQs/faqs'

export type FAQItem = {
  id: string
  question: string
  answer: string
}

type FAQContextValue = {
  items: FAQItem[]
  loading: boolean
  error: string | null
  addItem: (input: Omit<FAQItem, 'id'>) => Promise<void>
  updateItem: (id: string, input: Partial<Omit<FAQItem, 'id'>>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  refreshItems: () => Promise<void>
}

const FAQContext = createContext<FAQContextValue | undefined>(undefined)

export function FAQProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshItems = async () => {
    try {
      setError(null)
      const data = await fetchAllFAQs()
      // Convert FAQ to FAQItem (exclude created_at and updated_at)
      setItems(
        data.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs')
      console.error('Error fetching FAQs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshItems()
  }, [])

  const addItem: FAQContextValue['addItem'] = async (input) => {
    try {
      setError(null)
      await createFAQ(input)
      await refreshItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add FAQ')
      console.error('Error adding FAQ:', err)
      throw err
    }
  }

  const updateItem: FAQContextValue['updateItem'] = async (id, input) => {
    try {
      setError(null)
      await updateFAQ(id, input)
      await refreshItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update FAQ')
      console.error('Error updating FAQ:', err)
      throw err
    }
  }

  const deleteItem: FAQContextValue['deleteItem'] = async (id) => {
    try {
      setError(null)
      await deleteFAQ(id)
      await refreshItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete FAQ')
      console.error('Error deleting FAQ:', err)
      throw err
    }
  }

  return (
    <FAQContext.Provider value={{ items, loading, error, addItem, updateItem, deleteItem, refreshItems }}>
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
