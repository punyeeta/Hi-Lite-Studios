import { useNavigate } from 'react-router-dom';
import StarWhite from '../../assets/images/StarWhite.png';

const CaptureSection = () => {
  const navigate = useNavigate();

  const handleCaptureClick = () => {
    navigate('/appointment');
  };

  return (
    <section
      id="capture"
      className="relative w-full bg-linear-to-r from-[#200f59] to-[#3403d3] pt-8 pb-2 overflow-hidden"
    >
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-18">
        {/* Left Column */}
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <img
              src={StarWhite}
              alt="Star accent"
              className="w-12 h-12 md:w-20 md:h-20 object-contain"
            />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-tight">
            Ready to <span className="italic">hi-lite</span> your moment?
          </h2>
        </div>

        {/* Right Column */}
        <div className="flex justify-center md:justify-end">
          <button
            onClick={handleCaptureClick}
            className="px-6 py-2 bg-white text-[#3403d3] font-semibold rounded-ee-2xl rounded-tl-2xl text-lg transition duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(52,3,211,0.35)]"
          >
            Capture With Us
            <span className="text-xl"> →</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CaptureSection;