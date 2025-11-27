import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ContactSection from './components/sections/ContactSection';
import Footer from './components/common/Footer';

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
import LoginForAdmin from './Admin/AdminLogin';
import AdminMain from './Admin/AdminMain';
import BlogsStories from './Admin/Admin_components/BlogsAndStories/Magazine';
import AdminBookings from './Admin/Admin_components/BookingAppointments/AdminBookings';
import AdminContent from './Admin/Admin_components/ContentManagement/AboutUS';
import RequireAuth from './routes/RequireAuth';
import AdminFAQ from './Admin/Admin_components/ContentManagement/AdminFAQ';
import AddNewProject from './Admin/Admin_components/ContentManagement/AddNewProject';

// Public layout wrapper (UserLayout)
function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ContactSection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route element={<UserLayout />}>
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