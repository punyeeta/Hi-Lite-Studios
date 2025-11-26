import StripPanel from '../components/common/StripPanel';
import Hero from '../components/common/Hero';
import AboutSection from '../components/sections/AboutSection';
import WorksSection from '../components/sections/WorksSection';
import ServicesSection from '../components/sections/ServicesSection';
import MagazineSection from '../components/sections/MagazineSection';

const Home = () => {
  return (
    <div className="min-h-screen">
      
      <section id="strip">
        <StripPanel />
      </section>

      <section id="hero">
        <Hero />
      </section>

      <section id="about-section">
        <AboutSection />
      </section>

      <section id="works-section">
        <WorksSection />
      </section>
      
      <section id="services-section">
        <ServicesSection />
      </section>

      <section id="magazine-section">
        <MagazineSection />
      </section>
    </div>
  );
};

export default Home;
