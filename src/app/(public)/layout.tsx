import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="dark:bg-[#E3EFFB] mx-auto">
        <div className="px-[20px]">
          <Header />
        </div>
        <main className="bg-[#E3EFFB]">{children}</main>
      </div>
      <Footer />
    </>
  );
}
