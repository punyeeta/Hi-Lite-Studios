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

  const goHomeAndScroll = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollToSection(sectionId), 50)
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
            <button onClick={() => goHomeAndScroll('works')} className="font-medium text-[#212121] hover:text-blue-800">
              Works
            </button>
            <button onClick={() => goHomeAndScroll('services')} className="font-medium text-[#212121] hover:text-blue-800">
              Services
            </button>
            <button onClick={() => goHomeAndScroll('magazine')} className="font-medium text-[#212121] hover:text-blue-800">
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
            <button onClick={() => goHomeAndScroll('about')} className="font-medium text-[#212121] hover:text-blue-800">
              About Us
            </button>
            <button onClick={() => goHomeAndScroll('faq-section')} className="font-medium text-[#212121] hover:text-blue-800">
              FAQs
            </button>
            <button onClick={() => navigate('/appointment')} className="font-medium text-[#212121] hover:text-red-700">
              Capture with Us
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar