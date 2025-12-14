import { useNavigate } from 'react-router-dom';
import StarYellow from '@/assets/images/StarYellow.png';

const HeroMobile = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-white overflow-hidden h-auto md:h-[75vh] flex flex-col">
      {/* Star Yellow Background */}
      <div className="absolute top-0 -left-20 md:-left-70 w-[400px] md:w-[800px] h-[500px] md:h-[550px] opacity-70 pointer-events-none">
        <img
          src={StarYellow}
          alt="Abstract geometric graphic"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative mx-auto flex w-full flex-1 flex-col px-4 md:px-4 py-3 md:py-3">
        <div className="relative z-10 flex flex-col justify-start">
          <p className="mb-1 text-2xl sm:text-xl font-semibold text-black">Welcome,</p>
          <h1 className="text-5xl sm:text-5xl font-black bg-linear-to-r from-[#291471] to-[#4E26D7] bg-clip-text text-transparent leading-none">
            <span className="block">This is Hi-</span>
            <span className="block">Lite Studio.</span>
          </h1>
          <p className="mt-3 text-md sm:text-base text-black font-medium">
            where vision and storytelling unite.
          </p>
        </div>

        {/* Button Cluster  */}
        <div className="relative z-0 mt-6 sm:mt-8 h-[210px] sm:h-60 md:h-[260px]">
          {/* Center CTA */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => navigate('/appointment')}
              className="cursor-pointer rounded-md bg-linear-to-r from-[#F2322E] to-[#AA1815] px-6 sm:px-8 md:px-9 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg font-semibold italic text-white shadow-lg transition hover:shadow-[0_0_25px_rgba(242,50,46,0.7)] hover:scale-[1.02] whitespace-nowrap"
              aria-label="Book Appointment"
            >
              <span className="relative z-10">Book Appointment</span>
            </button>
          </div>

          {/* Surrounding badges */}
          <span className="absolute left-1/4 top-[24%] sm:top-[10%] md:top-[12%] -translate-x-[78%] sm:-translate-x-[80%] md:-translate-x-[85%] rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#FBC93D] to-[#FF8000] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 text-[11px] sm:text-sm md:text-sm font-medium italic text-white opacity-90 transition hover:shadow-[0_0_15px_rgba(255,193,7,0.6)]" style={{ animation: 'floatY 4.8s ease-in-out infinite', animationDelay: '0.15s' }}>
            Dream with us
          </span>
          <span className="absolute left-30 top-[14%] sm:top:[10%] md:top-[12%] translate-x-[18%] sm:translate-x-[22%] md:translate-x-[26%] rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 text-[11px] sm:text-sm md:text-sm font-medium italic text-white opacity-90 transition hover:shadow-[0_0_15px_rgba(242,50,46,0.6)]" style={{ animation: 'floatY 4.5s ease-in-out infinite', animationDelay: '0.1s' }}>
            Create moments
          </span>

          <span className="absolute left-0 sm:left-0 md:left-0 top-36 -translate-y-[60%] sm:-translate-y-[55%] md:-translate-y-[50%] rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 text-[11px] sm:text-sm md:text-sm font-medium italic text-white opacity-90 transition hover:shadow-[0_0_15px_rgba(74,20,140,0.6)]" style={{ animation: 'floatY 5s ease-in-out infinite', animationDelay: '0.2s' }}>
            Own your spotlight
          </span>
          <span className="absolute right-0 sm:right-0 md:right-0 top-[32%] -translate-y-[40%] sm:-translate-y-[45%] md:-translate-y-[48%] rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 text-[11px] sm:text-sm md:text-sm font-medium italic text-white opacity-90 transition hover:shadow-[0_0_15px_rgba(74,20,140,0.6)]" style={{ animation: 'floatY 4s ease-in-out infinite' }}>
            Capture with us
          </span>

          <span className="absolute left-40 bottom-[8%] sm:bottom-[10%] md:bottom-[12%] -translate-x-[58%] sm:-translate-x-[60%] md:-translate-x-[62%] rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 text-[11px] sm:text-sm md:text-sm font-medium italic text-white opacity-90 transition hover:shadow-[0_0_15px_rgba(242,50,46,0.6)]" style={{ animation: 'floatY 5.2s ease-in-out infinite', animationDelay: '0.3s' }}>
            Make your memories
          </span>
          <span className="absolute left-1/2 bottom-[20%] sm:bottom-[10%] md:bottom-[12%] translate-x-[38%] sm:translate-x-[40%] md:translate-x-[42%] rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#FBC93D] to-[#FF8000] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2 text-[11px] sm:text-sm md:text-sm font-medium italic text-white opacity-90 transition hover:shadow-[0_0_15px_rgba(255,193,7,0.6)]" style={{ animation: 'floatY 5.4s ease-in-out infinite', animationDelay: '0.25s' }}>
            Frame your story
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroMobile;