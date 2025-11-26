import { NavLink } from 'react-router-dom'

type AdminSidebarProps = {
  onLogout?: () => void
  loggingOut?: boolean
}

const navItems = [
  { label: 'Booking Appointments', path: '/admin/bookings' },
  { label: 'Content Management', path: '/admin/content' },
  { label: 'Blogs and Stories', path: '/admin/stories' },
  { label: 'FAQ', path: '/admin/faq' },
]

export default function AdminSidebar({
  onLogout,
  loggingOut,
}: AdminSidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-black p-6 flex flex-col gap-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Hi-Lite Studio
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Admin Menu</h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  [
                    'block rounded-md px-3 py-2 text-sm font-medium transition-colors border border-transparent',
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:border-black hover:bg-gray-50',
                  ].join(' ')
                }
              >
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
        className="w-full rounded-md border border-black px-3 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </aside>
  )
}
