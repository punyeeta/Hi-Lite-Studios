import { createContext, useContext, useState, type ReactNode } from 'react'

export type MagazineItem = {
  id: string
  title: string
  image: string
  excerpt: string
  content: string
}

type MagazineContextValue = {
  items: MagazineItem[]
  addItem: (input: Omit<MagazineItem, 'id'>) => void
  updateItem: (id: string, input: Partial<Omit<MagazineItem, 'id'>>) => void
  deleteItem: (id: string) => void
}

const MagazineContext = createContext<MagazineContextValue | undefined>(undefined)

const initialItems: MagazineItem[] = [
  {
    id: '1',
    title: 'How a 71‑Year‑Old Changed Her Life through Photography',
    image: '/magazine/hilite-storefront.jpg',
    excerpt:
      'A grandmother discovers a second life behind the lens, turning quiet afternoons into colorful stories.',
    content:
      'When I was still in elementary, I was always borrowing my mom’s point‑and‑shoot camera. I took pictures of flowers in our garden, of our pets, of my toys, and of my family members, without knowing all about photography. Years later, that same habit inspired my lola to pick up the camera herself…',
  },
  {
    id: '2',
    title: 'Hi‑Lite Studio Official Website: Vision to Reality',
    image: '/magazine/hilite-team.jpg',
    excerpt:
      'From a small studio dream to a full digital home where stories, sessions, and snapshots live together.',
    content:
      'This website started as a scribble on a notebook during a late‑night editing session. We wanted a space that felt like our studio: warm, a little playful, and focused on the people in front of the lens. In this story we share how the layouts, colors, and words came together to represent Hi‑Lite Studio online…',
  },
]

export function MagazineProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MagazineItem[]>(initialItems)

  const addItem: MagazineContextValue['addItem'] = (input) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`
    setItems((prev) => [...prev, { id, ...input }])
  }

  const updateItem: MagazineContextValue['updateItem'] = (id, input) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)))
  }

  const deleteItem: MagazineContextValue['deleteItem'] = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <MagazineContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
      {children}
    </MagazineContext.Provider>
  )
}

export function useMagazine() {
  const ctx = useContext(MagazineContext)
  if (!ctx) {
    throw new Error('useMagazine must be used within a MagazineProvider')
  }
  return ctx
}


