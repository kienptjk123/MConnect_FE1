export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-10 left-10 text-purple-300 text-2xl">
          ✦
        </div>
        <div className="absolute top-20 right-20 text-blue-300 text-xl">✦</div>
        <div className="absolute top-1/3 left-1/4 text-pink-300 text-lg">✦</div>
        <div className="absolute bottom-1/3 right-1/4 text-purple-300 text-xl">
          ✦
        </div>
        <div className="absolute bottom-20 left-20 text-blue-300 text-2xl">
          ✦
        </div>
        <div className="absolute top-1/2 left-10 text-pink-300 text-sm">✦</div>
        <div className="absolute top-1/4 right-10 text-purple-300 text-sm">
          ✦
        </div>
        <div className="absolute bottom-10 right-1/3 text-blue-300 text-lg">
          ✦
        </div>

        {/* Plus signs */}
        <div className="absolute top-1/4 left-1/3 text-orange-300 text-xl">
          +
        </div>
        <div className="absolute top-3/4 right-1/3 text-orange-300 text-lg">
          +
        </div>
        <div className="absolute top-1/2 right-20 text-orange-300 text-sm">
          +
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-orange-300 text-xl">
          +
        </div>

        {/* Circles */}
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-orange-300 rounded-full"></div>
        <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-purple-300 rounded-full"></div>
        <div className="absolute top-1/6 left-2/3 w-4 h-4 bg-pink-300 rounded-full"></div>
        <div className="absolute bottom-1/6 right-2/3 w-3 h-3 bg-blue-300 rounded-full"></div>
        <div className="absolute top-3/4 right-1/6 w-2 h-2 bg-orange-300 rounded-full"></div>

        {/* Triangles */}
        <div className="absolute top-1/5 left-1/5">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-purple-300"></div>
        </div>
        <div className="absolute bottom-1/5 right-1/5">
          <div className="w-0 h-0 border-l-3 border-r-3 border-b-5 border-l-transparent border-r-transparent border-b-pink-300"></div>
        </div>
        <div className="absolute top-2/3 right-1/6">
          <div className="w-0 h-0 border-l-3 border-r-3 border-b-5 border-l-transparent border-r-transparent border-b-blue-300"></div>
        </div>

        {/* Hearts */}
        <div className="absolute top-1/6 right-1/4 text-pink-300 text-lg">
          ♥
        </div>
        <div className="absolute bottom-1/4 left-1/6 text-purple-300 text-sm">
          ♥
        </div>

        {/* Diamonds */}
        <div className="absolute top-2/5 left-1/6 text-blue-300 text-xl">♦</div>
        <div className="absolute bottom-2/5 right-1/6 text-orange-300 text-lg">
          ♦
        </div>

        {/* Additional decorative elements */}
        <div className="absolute top-1/8 left-1/2 text-purple-300 text-sm">
          ◆
        </div>
        <div className="absolute bottom-1/8 left-2/3 text-pink-300 text-lg">
          ◆
        </div>
        <div className="absolute top-5/6 right-1/2 text-blue-300 text-sm">
          ◆
        </div>

        {/* Wavy lines */}
        <div className="absolute top-1/3 left-1/5">
          <svg
            width="30"
            height="15"
            viewBox="0 0 30 15"
            className="text-purple-300"
          >
            <path
              d="M0 7.5 Q7.5 0 15 7.5 T30 7.5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
        <div className="absolute bottom-1/3 right-1/5">
          <svg
            width="25"
            height="12"
            viewBox="0 0 25 12"
            className="text-pink-300"
          >
            <path
              d="M0 6 Q6.25 0 12.5 6 T25 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  );
}
