import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Wordmark from '@/assets/images/Wordmark.png'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)

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

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goHomeAndScroll = async (sectionId: string) => {
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
  }

  return (
    <header
      id="navbar"
      className={`w-full fixed top-0 left-0 z-50 bg-white shadow-sm transition-all duration-300`}
    >
      <nav
        className={`w-full bg-white px-14 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
      </nav>
    </header>
  )
}

export default Navbar