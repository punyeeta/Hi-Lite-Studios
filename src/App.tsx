import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/common/Footer';

// Public pages
import { Home } from './pages/Home'
import { RecentWorks, Magazine, MagazineArticle, FAQ, Capture, About, Appointment, WorkDetail } from './pages/FullPages'

// Admin pages
import LoginForAdmin from './Admin/AdminLogin';
import AdminForgotPassword from './Admin/AdminForgotPassword';
import AdminResetPassword from './Admin/AdminResetPassword';
import AdminMain from './Admin/AdminMain';
import BlogsStories from './Admin/Admin_components/BlogsAndStories/Magazine';
import AdminBookings from './Admin/Admin_components/BookingAppointments/AdminBookings';
import AdminContent from './Admin/Admin_components/ContentManagement/AboutUS/AboutUS';
import RequireAuth from './routes/RequireAuth';
import AdminFAQ from './Admin/Admin_components/ContentManagement/AdminFAQs/AdminFAQ';
import AddNewProject from './Admin/Admin_components/ContentManagement/WorksCollection/AddNewProject';

// Component that scrolls to top on every route change
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public layout wrapper (UserLayout)
function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="min-w-[1366px] max-w-[5120px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
      <ContactSection />
      <Footer />
    </div>
  );
}

function App() {
  // Always start at top when visiting a page, don't remember scroll position
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <Routes>

        {/* Public Pages */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<RecentWorks />} />
          <Route path="/works/:id" element={<WorkDetail />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/magazine/:id" element={<MagazineArticle />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/appointment" element={<Appointment />} />
        </Route>

        {/* Login Page */}
        <Route path="/login" element={<LoginForAdmin />} />
        
        {/* Password Recovery - Not Protected */}
        <Route path="/admin/login" element={<LoginForAdmin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        {/* Admin Routes - Protected */}
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminMain />}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="content/works/new" element={<AddNewProject />} />
            <Route path="stories" element={<BlogsStories />} />
            <Route path="faq" element={<AdminFAQ />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;