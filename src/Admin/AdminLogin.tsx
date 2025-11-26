import type { FormEvent } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function LoginForAdmin() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: Location } | undefined)?.from?.pathname || '/admin/bookings'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      const formElement = e.currentTarget
      const form = new FormData(formElement)
      const email = String(form.get('email') || '')
      const password = String(form.get('password') || '')

      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setMessage('Login failed: ' + error.message)
        return
      }

      navigate(from, { replace: true })
    } catch (err) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 border p-4 rounded-lg"
      >
        <h1 className="text-lg font-semibold text-center">Admin Login</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded text-sm disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {message && (
          <p className="text-sm text-red-600 text-center">{message}</p>
        )}

        
      </form>
    </main>
  )
}
