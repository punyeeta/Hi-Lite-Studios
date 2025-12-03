import { useState, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import AdminSidebar from './Admin_components/AdminSideBar'
import HeroStar from '../assets/images/HeroStar.png'
export default function AdminMain() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
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
  }, [navigate])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <AdminSidebar onLogout={handleLogout} loggingOut={loading} />
      <main className="ml-72 p-12 overflow-y-auto min-h-screen overflow-x-hidden" style={{ contain: 'layout' }}>
        <img
          src={HeroStar}
          alt="Admin Star Graphic"
          className="absolute right-0 -top-50 -translate-y-8 w-[550px] pointer-events-none select-none -z-10"
        />
        <div className="min-h-[400px]">
          <header className="space-y-3 mb-4">
            <p className="text-3xl font-bold text-[#D42724]">Welcome, Admin.</p>
          </header>
          <div className="w-full max-w-full">
            <Outlet />
          </div>

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
