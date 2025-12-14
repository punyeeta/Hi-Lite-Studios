import { useNavigate } from 'react-router-dom';
import StarYellow from '@/assets/images/StarYellow.png';
import Logo from '@/assets/Logo.svg';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-white overflow-hidden pt-4 pb-10">
      <div className="absolute left-0 top-6 pointer-events-none">
        <img
          src={StarYellow}
          alt="Abstract geometric graphic"
          className="w-full object-contain"
        />
      </div>
      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-2 md:flex-row md:items-start md:px-4">
         <div className="relative flex w-full flex-col justify-start pl-0 pr-2 md:w-1/2 md:px-0">

           {/* Foreground Text */}
          <div className="relative z-10 mb-6 mt-8 pl-6 md:pl-20">
            <p className="mb-2 text-2xl font-medium text-black">Welcome,</p>
            <h1 className="text-9xl font-black bg-linear-to-r from-[#291471] to-[#4E26D7] bg-clip-text text-transparent md:text-7xl">
              <span className="block">This is Hi-</span>
              <span className="block">Lite Studio.</span>
            </h1>
            <p className="mt-3 text-xl text-black md:text-2xl">
              where vision and storytelling unite.
            </p>
          </div>

              {/* Button Cluster */}
              <div className="hidden lg:block relative z-10 mx-auto mt-4 h-[280px] w-full max-w-xl">
            <div className="absolute right-2 top-16 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-6 py-3 font-medium italic text-white transition hover:shadow-[0_0_15px_rgba(74,20,140,0.6)] opacity-80 w-fit" style={{ animation: 'floatY 4s ease-in-out infinite' }}>
              Capture with us
            </div>

            <div className="absolute left-2 bottom-16 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-6 py-3 font-medium italic text-white transition hover:shadow-[0_0_15px_rgba(74,20,140,0.6)] opacity-80 w-fit" style={{ animation: 'floatY 5s ease-in-out infinite', animationDelay: '0.2s' }}>
              Own your spotlight
            </div>
            
            <button
              onClick={() => navigate('/appointment')}
              className="cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-8 py-5 text-xl font-semibold italic text-white shadow-lg transition hover:shadow-[0_0_25px_rgba(242,50,46,0.7)] hover:scale-[1.02] w-fit">
              <span className="relative z-10">Book Appointment</span>
              <span className="absolute inset-0 rounded-2xl p-1 pointer-events-none border-sweep-mask"></span>
            </button>

            <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-5 py-2.5 font-medium italic text-white transition hover:shadow-[0_0_15px_rgba(242,50,46,0.6)] opacity-80 w-fit" style={{ animation: 'floatY 4.5s ease-in-out infinite', animationDelay: '0.1s' }}>
              Create moments
            </div>

            <div className="absolute left-40 bottom-0 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-4 py-2.5 font-medium italic text-white transition hover:shadow-[0_0_15px_rgba(242,50,46,0.6)] opacity-80 w-fit" style={{ animation: 'floatY 5.2s ease-in-out infinite', animationDelay: '0.3s' }}>
              Make your memories
            </div>

            <div className="absolute left-8 top-12 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#FBC93D] to-[#FF8000] px-5 py-2 font-medium italic text-white transition hover:shadow-[0_0_15px_rgba(255,193,7,0.6)] opacity-80 w-fit" style={{ animation: 'floatY 4.8s ease-in-out infinite', animationDelay: '0.15s' }}>
              Dream with us
            </div>

            <div className="absolute right-8 bottom-10 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#FBC93D] to-[#FF8000] px-4 py-2 font-medium italic text-white transition hover:shadow-[0_0_15px_rgba(255,193,7,0.6)] opacity-80 w-fit" style={{ animation: 'floatY 5.4s ease-in-out infinite', animationDelay: '0.25s' }}>
              Frame your story
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex w-full justify-center md:w-1/2">
          <div className="w-full max-w-lg px-2 md:px-0">
            <img
              src={Logo}
              alt="Hi-Lite Studio Logo"
              className="w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Button Cluster */}
      <div className="block md:hidden relative z-10 mx-auto mt-4 mb-3 w-full max-w-[520px] px-3">
        <div className="relative w-full">
          {/* Top row */}
          <div className="flex justify-center gap-3 mb-3">
            <span className="rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-4 py-2 text-sm font-medium italic text-white opacity-80" style={{ animation: 'floatY 4.5s ease-in-out infinite', animationDelay: '0.1s' }}>
              Create moments
            </span>
            <span className="rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-4 py-2 text-sm font-medium italic text-white opacity-80" style={{ animation: 'floatY 4s ease-in-out infinite' }}>
              Capture with us
            </span>
          </div>
          {/* Middle CTA */}
          <div className="flex justify-center mb-3">
            <button
              onClick={() => navigate('/appointment')}
              className="rounded-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-7 py-4 text-lg font-semibold italic text-white shadow-lg transition hover:shadow-[0_0_25px_rgba(242,50,46,0.7)] hover:scale-[1.02]">
              <span className="relative z-10">Book Appointment</span>
              <span className="absolute inset-0 rounded-2xl p-1 pointer-events-none border-sweep-mask"></span>
            </button>
          </div>
          {/* Bottom row */}
          <div className="flex justify-center gap-3">
            <span className="rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-4 py-2 text-sm font-medium italic text-white opacity-80" style={{ animation: 'floatY 5s ease-in-out infinite', animationDelay: '0.2s' }}>
              Own your spotlight
            </span>
            <span className="rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#FBC93D] to-[#FF8000] px-4 py-2 text-sm font-medium italic text-white opacity-80" style={{ animation: 'floatY 5.4s ease-in-out infinite', animationDelay: '0.25s' }}>
              Frame your story
            </span>
            <span className="rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-4 py-2 text-sm font-medium italic text-white opacity-80" style={{ animation: 'floatY 5.2s ease-in-out infinite', animationDelay: '0.3s' }}>
              Make your memories
            </span>
          </div>
        </div>
      </div>

      {/* Button Cluster - medium screens */}
      <div className="hidden md:block lg:hidden relative z-10 mx-auto mt-4 mb-2 w-full max-w-xl">
        <div className="relative h-[260px] w-full">
          <div className="absolute right-4 top-14 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-5 py-2.5 text-base font-medium italic text-white opacity-80 w-fit" style={{ animation: 'floatY 4s ease-in-out infinite' }}>
            Capture with us
          </div>
          <div className="absolute left-4 bottom-14 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#291471] to-[#4E26D7] px-5 py-2.5 text-base font-medium italic text-white opacity-80 w-fit" style={{ animation: 'floatY 5s ease-in-out infinite', animationDelay: '0.2s' }}>
            Own your spotlight
          </div>
          <button
            onClick={() => navigate('/appointment')}
            className="cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-7 py-4 text-lg font-semibold italic text-white shadow-lg transition hover:shadow-[0_0_25px_rgba(242,50,46,0.7)] hover:scale-[1.02] w-fit">
            <span className="relative z-10">Book Appointment</span>
            <span className="absolute inset-0 rounded-2xl p-1 pointer-events-none border-sweep-mask"></span>
          </button>
          <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-5 py-2.5 text-base font-medium italic text-white opacity-80 w-fit" style={{ animation: 'floatY 4.5s ease-in-out infinite', animationDelay: '0.1s' }}>
            Create moments
          </div>
          <div className="absolute left-40 bottom-2 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#F2322E] to-[#AA1815] px-4 py-2.5 text-base font-medium italic text-white opacity-80 w-fit" style={{ animation: 'floatY 5.2s ease-in-out infinite', animationDelay: '0.3s' }}>
            Make your memories
          </div>
          <div className="absolute left-8 top-10 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#FBC93D] to-[#FF8000] px-5 py-2 text-base font-medium italic text-white opacity-80 w-fit" style={{ animation: 'floatY 4.8s ease-in-out infinite', animationDelay: '0.15s' }}>
            Dream with us
          </div>
          <div className="absolute right-8 bottom-8 rounded-ee-2xl rounded-tl-2xl bg-linear-to-r from-[#FBC93D] to-[#FF8000] px-4 py-2 text-base font-medium italic text-white opacity-80 w-fit" style={{ animation: 'floatY 5.4s ease-in-out infinite', animationDelay: '0.25s' }}>
            Frame your story
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;