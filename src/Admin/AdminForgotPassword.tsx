import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Logo from '@/assets/Logo.svg'
import Wordmark from '@/assets/images/Wordmark.png'
import HeroStar from '@/assets/images/HeroStar.png'

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) {
        setMessage('Error: ' + error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setMessage('Password reset link sent! Check your email.')
      setEmail('')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/admin/login')
      }, 3000)
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

          {/* Right: Forgot Password Form */}
          <div className="flex-1 flex flex-col items-center justify-around">
            <div className="w-full max-w-md relative flex flex-col">
              <div>
                <h2 className="text-5xl font-extrabold mb-2 text-[#D42724] text-left">
                  Reset Password
                </h2>
                <p className="text-gray-600 mb-6 text-left text-lg">
                  Enter your email address and we'll send you a password reset link.
                </p>

                {message && (
                  <div
                    className={`mb-4 text-sm font-medium text-center px-4 py-2 rounded-lg ${
                      success
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {message}
                  </div>
                )}

                {!success ? (
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

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-3xl bg-[#D42724] text-white text-lg hover:bg-red-500 transition cursor-pointer disabled:opacity-60"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>

                    <Link to="/admin/login">
                      <p className="text-center text-lg text-gray-600 hover:underline cursor-pointer">
                        Back to Login
                      </p>
                    </Link>
                  </form>
                ) : (
                  <Link to="/admin/login">
                    <Button className="w-full h-14 rounded-3xl bg-[#D42724] text-white text-lg hover:bg-red-500 transition cursor-pointer">
                      Return to Login
                    </Button>
                  </Link>
                )}
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
