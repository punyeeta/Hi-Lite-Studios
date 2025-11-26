import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import AdminSidebar from './Admin_components/AdminSideBar'

export default function AdminMain() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleLogout() {
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setMessage(error.message)
        return
      }
      navigate('/login')
    } catch {
      setMessage('Unable to log out right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar onLogout={handleLogout} loggingOut={loading} />
      <main className="flex-1 p-10">
        <div className="min-h-[400px]">
          <Outlet />
          {message && (
            <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
