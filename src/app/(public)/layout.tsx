import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import SmoothScrollProvider from "@/components/smooth-scroll-provider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScrollProvider>
        <div className="light:bg-white mx-auto">
          <Header />
          <main className="bg-white">{children}</main>
        </div>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}
