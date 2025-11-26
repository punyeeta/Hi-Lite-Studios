import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import RecentWorks from './pages/RecentWorks';
import Service from './pages/Service';
import Magazine from './pages/Magazine';
import FAQ from './pages/FAQ';
import Capture from './pages/Capture';
import About from './pages/About'; // you referenced <About /> in your routes
import LoginForAdmin from './Admin/Admin_Login';
import AdminMain from './Admin/Admin_Main';
import BookingsAppointments from './components/Admin/Booiking_appointments';
import ContentManagement from './components/Admin/Content_Management';
import BlogsStories from './components/Admin/Blog_stories';
import RequireAuth from './routes/RequireAuth';

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

        {/* Public pages wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<RecentWorks />} />
          <Route path="/services" element={<Service />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/capture" element={<Capture />} />
        </Route>

        {/* Login page */}
        <Route path="/login" element={<LoginForAdmin />} />

        {/* Protected Admin Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminMain />}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<BookingsAppointments />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="stories" element={<BlogsStories />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
