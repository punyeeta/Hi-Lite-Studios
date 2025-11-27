import { NavLink } from 'react-router-dom'
import { memo } from 'react'
import sidebarBackground from '../../assets/images/sidebar_background.png'
import wordmark from '../../assets/images/Wordmark.png'
import bookingIcon from '../../assets/images/Bookingappointmentbutton.png'
import contentIcon from '../../assets/images/contentManagementbutton.png'
import blogIcon from '../../assets/images/blogstoriesbutton.png'
import logoutIcon from '../../assets/images/logoutbutton.png'

type AdminSidebarProps = {
  onLogout?: () => void
  loggingOut?: boolean
}

const navItems = [
  { label: 'Booking Appointments', path: '/admin/bookings', icon: bookingIcon },
  { label: 'Content Management', path: '/admin/content', icon: contentIcon },
  { label: 'Blogs and Stories', path: '/admin/stories', icon: blogIcon },
]

function AdminSidebar({
  onLogout,
  loggingOut,
}: AdminSidebarProps) {
  return (
    <aside 
      className="w-72 border-r border-black fixed left-0 top-0 h-screen z-40"
      style={{
        backgroundImage: `url(${sidebarBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: 'translateZ(0)',
        willChange: 'auto',
      }}
    >
      {/* Content layer */}
      <div className="p-6 flex flex-col gap-8 h-full overflow-y-auto" style={{ contain: 'layout' }}>
        <div>
          <img
            src={wordmark}
            alt="Hi-Lite Studio"
            className="w-full h-auto"
          />
          <p className="text-xs uppercase tracking-wide text-gray-400 mt-10 ">
            ADMIN MENU
          </p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors border border-transparent',
                      isActive
                        ? 'text-gray-900'
                        : 'text-gray-700 hover:border-black hover:bg-gray-50',
                    ].join(' ')
                  }
                  style={({ isActive }) =>
                    isActive ? { backgroundColor: '#E2E2E2' } : {}
                  }
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="w-5 h-5"
                  />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-black hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img
            src={logoutIcon}
            alt=""
            className="w-5 h-5"
          />
          {loggingOut ? 'Logging out...' : 'Log Out'}
        </button>
      </div>
    </aside>
  )
}

export default memo(AdminSidebar)
