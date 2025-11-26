import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';

// Public pages
import Home from './pages/Home';
import RecentWorks from './pages/RecentWorks';
import Service from './pages/Service';
import Magazine from './pages/Magazine';
import FAQ from './pages/FAQ';
import Capture from './pages/Capture';
import About from './pages/About';
import Appointment from './pages/Appointment';

// Admin pages
import LoginForAdmin from './admin/AdminLogin';
import AdminMain from './admin/AdminMain';
import BlogsStories from './admin/AdminComponents/AdminBlog';
import AdminBookings from './admin/AdminComponents/AdminBookings';
import AdminContent from './admin/AdminComponents/AdminContent';
import RequireAuth from './routes/RequireAuth';

// Public layout wrapper
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<RecentWorks />} />
          <Route path="/services" element={<Service />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/appointment" element={<Appointment />} />
        </Route>

        {/* Login Page */}
        <Route path="/login" element={<LoginForAdmin />} />

        {/* Admin Routes - Protected */}
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminMain />}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="stories" element={<BlogsStories />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;