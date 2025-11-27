import { NavLink } from 'react-router-dom'
import { memo } from 'react'
import AdminStar from '../../assets/images/AdminStar.png'
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
      className="w-72 border-r border-[#b4b4b4] fixed left-0 top-0 h-screen z-40"
      style={{
        backgroundImage: `url(${AdminStar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: 'translateZ(0)',
        willChange: 'auto',
      }}
    >
      {/* Content layer */}
      <div className="p-6 flex flex-col gap-4 h-full overflow-y-auto" style={{ contain: 'layout' }}>
        <div>
          <img
            src={wordmark}
            alt="Hi-Lite Studio"
            className="w-50 h-auto mx-auto"
          />
          <p className="text-s font-semibold tracking-wide text-[#291471] mt-16">
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
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out',
                      isActive
                        ? 'text-gray-900 font-bold border-l-4 border-indigo-600 bg-gray-200'
                        : 'text-gray-700 hover:text-black hover:bg-gray-100',
                    ].join(' ')
                  }
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
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
          className="group flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-semibold text-red-500 transition-all duration-200 ease-in-out hover:bg-red-100 hover:text-red-600 hover:shadow-md active:scale-95                     disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img
            src={logoutIcon}
            alt=""
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12"
          />
          {loggingOut ? 'Logging out...' : 'Log Out'}
        </button>

      </div>
    </aside>
  )
}

export default memo(AdminSidebar)
