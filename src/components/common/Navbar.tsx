import { useLocation, useNavigate } from 'react-router-dom'
import Wordmark from '@/assets/images/Wordmark.png'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

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
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <nav className="w-full bg-white px-14 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* LEFT LINKS */}
          <div className="flex items-center gap-14">
            <button
              onClick={() => goHomeAndScroll('works')}
              className="relative text-[#212121] hover:text-blue-800 transition-colors font-medium before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-0 before:bg-blue-800 before:transition-all before:duration-300 hover:before:w-full"
            >
              Works
            </button>

            <button
              onClick={() => goHomeAndScroll('services')}
              className="relative text-[#212121] hover:text-blue-800 transition-colors font-medium before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-0 before:bg-blue-800 before:transition-all before:duration-300 hover:before:w-full"
            >
              Services
            </button>

            <button
              onClick={() => goHomeAndScroll('magazine')}
              className="relative text-[#212121] hover:text-blue-800 transition-colors font-medium before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-0 before:bg-blue-800 before:transition-all before:duration-300 hover:before:w-full"
            >
              Magazine
            </button>
          </div>

          {/* CENTER LOGO */}
          <div className="flex-1 flex justify-center items-center">
            <button
              onClick={() => goHomeAndScroll('hero')}
              className="flex flex-col items-center"
            >
              <img src={Wordmark} alt="HI-LITE STUDIO" className="h-16 w-auto" />
            </button>
          </div>

          {/* RIGHT LINKS */}
          <div className="flex items-center gap-14">
            <button
              onClick={() => goHomeAndScroll('about')}
              className="relative text-[#212121] hover:text-blue-800 transition-colors font-medium before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-0 before:bg-blue-800 before:transition-all before:duration-300 hover:before:w-full"
            >
              About Us
            </button>

            <button
              onClick={() => goHomeAndScroll('faq')}
              className="relative text-[#212121] hover:text-blue-800 transition-colors font-medium before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-0 before:bg-blue-800 before:transition-all before:duration-300 hover:before:w-full"
            >
              FAQs
            </button>

            <button
              onClick={() => navigate('/appointment')}
              className="relative text-[#212121] hover:text-red-700 transition-colors font-medium before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-0.5 before:w-0 before:bg-red-700 before:transition-all before:duration-300 hover:before:w-full"
            >
              Capture with Us
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar