import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="min-h-screen relative flex justify-center items-center">
        <div className="absolute min-h-screen inset-0 top-0 left-0 object-cover">
          <Image
            src="/images/login.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
            priority
            fetchPriority="high"
          />
        </div>

        <div className="absolute flex items-center justify-center w-full">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="min-w-[1100px] rounded-[3rem] flex items-center justify-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
