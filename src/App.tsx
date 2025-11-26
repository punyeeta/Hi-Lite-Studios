import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import RecentWorks from './pages/RecentWorks';
import Service from './pages/Service';
import Magazine from './pages/Magazine';
import FAQ from './pages/FAQ';
import Capture from './pages/Capture';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/works" element={<RecentWorks />} />
            <Route path="/services" element={<Service />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/capture" element={<Capture />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
