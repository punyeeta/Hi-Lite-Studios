import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Logo from '@/assets/Logo.svg'
import Wordmark from '@/assets/images/Wordmark.png'
import HeroStar from '@/assets/images/HeroStar.png'

export default function AdminResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has a valid reset session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsValidSession(true)
      } else {
        setMessage('Invalid or expired reset link. Please request a new one.')
        setTimeout(() => navigate('/admin/forgot-password'), 3000)
      }
    }

    checkSession()
  }, [navigate])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setMessage('Error: ' + error.message)
        setLoading(false)
        return
      }

      setMessage('Password updated successfully! Redirecting...')
      setTimeout(() => {
        navigate('/admin/login')
      }, 2000)
    } catch (err) {
      setMessage('An unexpected error occurred')
      setLoading(false)
    }
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-white font-sans relative overflow-hidden flex items-center">
        <img
          src={HeroStar}
          alt="Admin Star Graphic"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[550px] opacity-80 pointer-events-none select-none"
        />

        <div className="container mx-auto px-8 py-10">
          <div className="flex flex-col lg:flex-row items-stretch gap-28">
            <div className="flex-1 flex justify-center">
              <img
                src={Logo}
                alt="Admin Dashboard Preview"
                className="w-full max-w-lg h-auto object-contain"
              />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-md">
                {message && (
                  <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-center">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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

          {/* Right: Reset Password Form */}
          <div className="flex-1 flex flex-col items-center justify-around">
            <div className="w-full max-w-md relative flex flex-col">
              <div>
                <h2 className="text-5xl font-extrabold mb-2 text-[#D42724] text-left">
                  Create New Password
                </h2>
                <p className="text-gray-600 mb-6 text-left text-lg">
                  Enter your new password below.
                </p>

                {message && (
                  <div
                    className={`mb-4 text-sm font-medium text-center px-4 py-2 rounded-lg ${
                      message.includes('successfully')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {message}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-16 rounded-3xl border border-gray-300 px-4 pr-12"
                      placeholder="New Password"
                      required
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

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-16 rounded-3xl border border-gray-300 px-4 pr-12"
                      placeholder="Confirm Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-3xl bg-[#D42724] text-white text-lg hover:bg-red-500 transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
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
