import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto dark:bg-white">
        <Header />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
