import AboutBackground from '@/assets/images/AboutBackground.png';
import AboutHeader from '@/assets/images/AboutHeader.png';
import BlueBorder from '@/assets/images/Blue Border.png';
import LearnButton from '@/assets/images/LearnButton.png';
import Subtract from '@/assets/images/Subtract.png';

const AboutSection = () => {
  return (
    <section id="about" className="relative w-full bg-white overflow-hidden">
      {/* Top Accent Border */}
      <div className="w-screen relative flex justify-center pt-6 pb-4 z-20">
        <img
          src={BlueBorder}
          alt="Top blue border"
          className="w-full object-cover"
        />
      </div>

      {/* Background Layer */}
      <div className="relative w-full h-[400px] mx-auto">
        {/* Background image */}
        <img
          src={AboutBackground}
          alt="About page background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-1 h-full px-6 py-8">
          {/* Header */}
          <div className="flex justify-start items-start -mt-5 pl-36">
            <img
              src={AboutHeader}
              alt="About Hi-Lite Studio header"
              className="w-full max-w-xl object-contain"
            />
          </div>

          {/* Grid Content */}
          <div className="flex items-start gap-3 pl-36">
            {/* Illustration */}
            <div className="w-16 shrink-0">
              <img
                src={Subtract}
                alt="abstract subtract illustration"
                className="w-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Text Section */}
            <div className="max-w-2xl px-4 flex-1">
              <p className="text-lg leading-relaxed text-justify text-white">
                At Hi-Lite Studio, we create photographs and videos that feel genuine, warm, and intentional.
                Based in Cagayan de Oro, we specialize in capturing stories—whether for families, students,
                or organizations—through a blend of technical precision and emotional depth. Every project is
                shaped by our passion for storytelling and our commitment to delivering timeless, meaningful
                visuals.
              </p>

              <button className="relative mt-4 inline-flex w-32">
                <img
                  src={LearnButton}
                  alt="Learn more button"
                  className="w-48 h-auto object-contain drop-shadow-lg"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Border */}
      <div className="w-screen relative pt-4 pb-6 z-20">
        <img
          src={BlueBorder}
          alt="Bottom blue border"
          className="w-full object-cover"
        />
      </div>
    </section>
  );
};

export default AboutSection;