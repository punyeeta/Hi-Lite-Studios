import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabase/client'

/**
 * Checks for an authenticated Supabase session before rendering children.
 * Redirects unauthenticated users to /login and remembers the original path.
 */
export default function RequireAuth() {
  const location = useLocation()
  const [session, setSession] = useState<Session | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      setChecked(true)
    }

    loadSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      setChecked(true)
    })

    return () => {
      mounted = false
      subscription?.subscription.unsubscribe()
    }
  }, [])

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Checking access…
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}


