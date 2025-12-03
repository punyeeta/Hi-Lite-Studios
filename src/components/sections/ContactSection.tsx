import { Mail, Phone, MapPin, Facebook, Globe } from 'lucide-react';

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative w-full bg-linear-to-r from-[#200f59] to-[#3403d3] pt-3 pb-2 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-22">
        {/* Left Column */}
        <div className="text-[#e4e4e4]">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Connect with us
          </h2>

          <div className="space-y-3 font-medium">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0 mt-1 text-white" />
              <p className="text-base md:text-lg leading-relaxed text-[#dddddd]">
                FJGR+FR5 Gaerlan St Cagayan de Oro Misamis Oriental
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 shrink-0 text-white" />
              <p className="text-base md:text-lg text-[#dddddd]">
                09169103229 | 09175613739 | 088 851 1237
              </p>

            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 shrink-0 text-white" />
              <p className="text-base md:text-lg text-[#dddddd]">
                hilitestudiocdo@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-start md:items-end justify-center">
          <div className="flex flex-col items-start space-y-3 font-medium">
            <a
              href="mailto:hilitestudiocdo@gmail.com"
              className="group flex items-center gap-3 text-white hover:text-gray-200 transition-colors"
            >
              <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-base md:text-lg text-[#dddddd] underline-offset-2 group-hover:underline">
                Email
              </span>
            </a>

            <a
              href="https://fb.com/hilitestudio.cdo"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-white hover:text-gray-200 transition-colors hover:scale-[1.02]"
            >
              <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-base md:text-lg text-[#dddddd] underline-offset-2 group-hover:underline">
                Facebook
              </span>
            </a>

            <a
              href="https://hilite.vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-white hover:text-gray-200 transition-colors hover:scale-[1.02]"
            >
              <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-base md:text-lg text-[#dddddd] underline-offset-2 group-hover:underline">
                Website
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;