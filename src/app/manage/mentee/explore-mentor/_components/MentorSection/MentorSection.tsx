import Image from "next/image";

export default function MentorSection() {
  return (
    <div className=" py-8">
      <div className="">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-200 text-blue-700 px-6 py-2 rounded-full text-sm font-medium mb-4 uppercase tracking-wide">
            EXAM PREPARATION
          </div>
          <h1 className="text-5xl font-bold text-[#17254E] mb-2">
            Annual Exam Preparation
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-7xl mx-auto">
          <div className="flex gap-4">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-[4rem] shadow-2xl p-8 text-white relative h-80 w-[40%] flex items-center">
              <div className="z-10 relative flex-1 pr-4">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Start From Today
                </h2>
                <p className="text-lg mb-6 leading-relaxed text-white/90 font-medium">
                  Join Our Training Courses &<br />
                  Build Your Skill.
                </p>
                <button className="bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 text-base shadow-lg">
                  Join Now
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute right-10 top-3 bottom-0 w-1/2 flex items-center justify-center">
                <div className=" w-full h-full flex items-center justify-center">
                  <Image
                    src="/images/image-mentor1.png"
                    alt="Professional mentor 1"
                    className="object-contain w-full h-full scale-125"
                    fill
                  />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1676D4] rounded-[4rem] p-8 text-white relative h-80 w-[60%] shadow-2xl flex items-center">
              <div className="z-10 relative flex-1 pr-4">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Start From Today
                </h2>
                <p className="text-lg mb-6 leading-relaxed text-white/90 font-medium">
                  Join Our Training Courses &<br />
                  Build Your Skill.
                </p>
                <button className="bg-slate-800 hover:cursor-pointer hover:bg-slate-900 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 text-base shadow-lg">
                  Join Now
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute right-6 top-0 bottom-0 w-1/2 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/images/image-mentor2.png"
                    alt="Professional mentor 2"
                    className="object-contain max-w-full max-h-full"
                    fill
                  />
                </div>
              </div>
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-40 h-40 border border-white/30 rounded-full"></div>
                <div className="absolute bottom-4 right-8 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 right-16 w-24 h-24 border border-white/25 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Card 3 - Bottom Left */}
            <div className="bg-[#1676D4] w-[60%] rounded-[4rem] p-8 text-white relative overflow-hidden shadow-2xl h-80 flex items-center">
              <div className="z-10 relative flex-1 pr-4">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Start From Today
                </h2>
                <p className="text-lg mb-6 leading-relaxed text-white/90 font-medium">
                  Join Our Training Courses &<br />
                  Build Your Skill.
                </p>
                <button className="bg-slate-800 hover:cursor-pointer hover:bg-slate-900 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 text-base shadow-lg">
                  Join Now
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute right-18 top-10 bottom-0 w-1/2 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/images/image-mentor3.png"
                    alt="Professional mentor 3"
                    className="object-contain max-w-full max-h-full scale-140"
                    fill
                  />
                </div>
              </div>
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-40 h-40 border border-white/30 rounded-full"></div>
                <div className="absolute bottom-4 right-8 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 right-16 w-24 h-24 border border-white/25 rounded-full"></div>
              </div>
            </div>

            {/* Card 4 - Bottom Right */}
            <div className="w-[40%] bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 shadow-2xl rounded-[4rem] p-8 text-white relative overflow-hidden h-80 flex items-center">
              <div className="z-10 relative flex-1 pr-4">
                <h2 className="text-2xl font-semibold mb-3 text-white">
                  Start From Today
                </h2>
                <p className="text-lg mb-6 leading-relaxed text-white/90 font-medium">
                  Join Our Training Courses &<br />
                  Build Your Skill.
                </p>
                <button className="bg-blue-500 hover:cursor-pointer hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 text-base shadow-lg">
                  Join Now
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute right-0 top-5 bottom-0 w-1/2 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/images/image-mentor4.png"
                    alt="Professional mentor 4"
                    className="object-contain max-w-full max-h-full"
                    fill
                  />
                </div>
              </div>
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-40 h-40 border border-white/30 rounded-full"></div>
                <div className="absolute bottom-4 right-8 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 right-16 w-24 h-24 border border-white/25 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
