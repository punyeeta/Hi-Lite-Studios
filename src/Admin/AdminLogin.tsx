import type { FormEvent } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Logo from '@/assets/Logo.svg'
import Wordmark from '@/assets/images/Wordmark.png'
import HeroStar from '@/assets/images/HeroStar.png'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')  
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: Location } | undefined)?.from?.pathname || '/admin/bookings'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setMessage('Login failed: ' + error.message)
        setLoading(false)
        return
      }

      navigate(from, { replace: true })
    } catch (err) {
      setMessage('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans relative overflow-hidden flex items-center">
      <img
        src={HeroStar}
        alt="Admin Star Graphic"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] opacity-80 pointer-events-none select-none"
      />

      <div className="container mx-auto px-8 py-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-28">
          {/* Left: Dashboard Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={Logo}
              alt="Admin Dashboard Preview"
              className="w-full max-w-lg h-auto object-contain"
            />
          </div>

          {/* Right: Login Form */}
          <div className="flex-1 flex flex-col items-center justify-around">
            <div className="w-full max-w-md relative flex flex-col">
              <div>
                <h2 className="text-5xl font-extrabold mb-2 text-[#D42724] text-left">
                  Hello Admin!
                </h2>
                <p className="text-gray-600 mb-6 text-left text-lg">Welcome back.</p>

                {message && (
                  <div className="mb-4 text-red-600 text-sm font-medium text-center">
                    {message}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 rounded-3xl border border-gray-300 px-4"
                    placeholder="Email"
                    required
                    autoComplete="email"
                  />

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-16 rounded-3xl border border-gray-300 px-4 pr-12"
                      placeholder="Password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-3xl bg-[#D42724] text-white text-lg hover:bg-red-500 transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </Button>

                  <Link to="/admin/forgot-password">
                    <p className="text-center text-lg text-gray-600 hover:underline cursor-pointer">
                      Forgot Password?
                    </p>
                  </Link>
                </form>
              </div>
            </div>
            <div>
              <img
                src={Wordmark}
                alt="Hi-Lite Studios"
                className="h-16 mb-[-18px]" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}