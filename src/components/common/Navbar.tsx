import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import Wordmark from '@/assets/images/Wordmark.png'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const goHomeAndScroll = useCallback(async (sectionId: string) => {
    setMobileMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation to complete before scrolling
      await new Promise((resolve) => {
        const checkAndScroll = () => {
          const section = document.getElementById(sectionId)
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
            resolve(true)
          } else {
            // Retry after a short delay
            setTimeout(checkAndScroll, 50)
          }
        }
        // Start checking after a brief delay to allow DOM to update
        setTimeout(checkAndScroll, 100)
      })
    } else {
      scrollToSection(sectionId)
    }
  }, [location.pathname, navigate, scrollToSection])

  return (
    <header
      id="navbar"
      className={`w-full fixed top-0 left-0 z-50 bg-white shadow-sm transition-all duration-300`}
    >
      <nav
        className={`w-full bg-white px-4 sm:px-8 lg:px-14 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        {/* DESKTOP VIEW */}
        <div className="hidden lg:flex max-w-6xl mx-auto items-center justify-between">
          {/* LEFT LINKS */}
          <div className="flex items-center gap-14">
            <button onClick={() => goHomeAndScroll('works')} className="relative font-medium text-[#212121] hover:text-blue-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-800 after:transition-all">
              Works
            </button>
            <button onClick={() => goHomeAndScroll('services')} className="relative font-medium text-[#212121] hover:text-blue-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-800 after:transition-all">
              Services
            </button>
            <button onClick={() => goHomeAndScroll('magazine')} className="relative font-medium text-[#212121] hover:text-blue-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-800 after:transition-all">
              Magazine
            </button>
          </div>

          {/* CENTER LOGO */}
          <div className="flex-1 flex justify-center items-center">
            <button onClick={() => goHomeAndScroll('hero')} className="flex flex-col items-center">
              <img
                src={Wordmark}
                alt="HI-LITE STUDIO"
                className={`transition-all duration-300 ${scrolled ? 'h-12' : 'h-16'} w-auto`}
              />
            </button>
          </div>

          {/* RIGHT LINKS */}
          <div className="flex items-center gap-14">
            <button onClick={() => goHomeAndScroll('about')} className="relative font-medium text-[#212121] hover:text-blue-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-800 after:transition-all">
              About Us
            </button>
            <button onClick={() => goHomeAndScroll('faq-section')} className="relative font-medium text-[#212121] hover:text-blue-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-800 after:transition-all">
              FAQs
            </button>
            <button onClick={() => navigate('/appointment')} className="relative font-medium text-[#212121] hover:text-red-700 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-red-700 after:transition-all">
              Capture with Us
            </button>
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            {/* HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex flex-col gap-1.5"
              aria-label="Toggle menu"
            >
              <div className={`w-6 h-0.5 bg-[#212121] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-[#212121] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-[#212121] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>

            {/* CENTER LOGO */}
            <button onClick={() => { goHomeAndScroll('hero'); setMobileMenuOpen(false); }} className="flex flex-col items-center flex-1">
              <img
                src={Wordmark}
                alt="HI-LITE STUDIO"
                className={`transition-all duration-300 ${scrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-16'} w-auto`}
              />
            </button>

            {/* Spacer */}
            <div className="w-6"></div>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 top-16 sm:top-20 lg:hidden bg-white z-40 overflow-y-auto">
              <div className="flex flex-col gap-1 p-4">
                <button 
                  onClick={() => goHomeAndScroll('works')}
                  className="w-full text-left px-4 py-3 rounded hover:bg-gray-100 text-[#212121] font-medium transition text-lg"
                >
                  Works
                </button>
                <button 
                  onClick={() => goHomeAndScroll('services')}
                  className="w-full text-left px-4 py-3 rounded hover:bg-gray-100 text-[#212121] font-medium transition text-lg"
                >
                  Services
                </button>
                <button 
                  onClick={() => goHomeAndScroll('magazine')}
                  className="w-full text-left px-4 py-3 rounded hover:bg-gray-100 text-[#212121] font-medium transition text-lg"
                >
                  Magazine
                </button>
                <button 
                  onClick={() => goHomeAndScroll('about')}
                  className="w-full text-left px-4 py-3 rounded hover:bg-gray-100 text-[#212121] font-medium transition text-lg"
                >
                  About Us
                </button>
                <button 
                  onClick={() => goHomeAndScroll('faq-section')}
                  className="w-full text-left px-4 py-3 rounded hover:bg-gray-100 text-[#212121] font-medium transition text-lg"
                >
                  FAQs
                </button>
                <button 
                  onClick={() => { navigate('/appointment'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded hover:bg-red-50 text-red-700 font-medium transition text-lg"
                >
                  Capture with Us
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar