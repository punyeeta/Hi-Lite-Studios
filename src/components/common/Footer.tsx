import FooterLogo from '../../assets/images/FooterLogo.png';

const Footer = () => {
  return (
    <footer className="relative w-full bg-linear-to-r from-[#200f59] to-[#3403d3] pt-4 pb-4 px-20 overflow-hidden">
      {/* Top Border Line */}
      <div className="border-t-2 border-white"></div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Left Column */}
        <div className="text-center md:text-left">
          <p className="text-white text-base md:text-lg font-medium italic leading-relaxed">
            Where vision and storytelling unite.
          </p>
        </div>

        {/* Center Column */}
        <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex flex-col items-center my-2">
            <a href="#navbar" className="cursor-pointer transition-transform hover:scale-105">
            <img
                src={FooterLogo}
                alt="Hi-Lite Studio Logo"
                className="w-32 object-contain"
            />
            </a>
        </div>
        </div>

        {/* Right Column */}
        <div className="text-center md:text-right">
          <p className="text-white text-base md:text-lg font-medium italic leading-relaxed">
            Your story through our lens.
          </p>
        </div>
      </div>

      {/* Bottom Border Line */}
      <div className="border-t-2 border-white pt-4"></div>

      {/* Copyright */}
      <div className="text-center">
        <p className="text-white text-xs md:text-sm">
          © 2025 All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;