import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="light:bg-white mx-auto">
        <div className="px-[20px]">
          <Header />
        </div>
        <main className="bg-white">{children}</main>
      </div>
      <Footer />
    </>
  );
}
