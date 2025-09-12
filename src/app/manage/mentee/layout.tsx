import MenteeHeader from "@/app/manage/mentee/mentee-header";
import MenteeSidebar from "@/app/manage/mentee/mentee-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MenteeSidebar />
      <SidebarInset>
        <MenteeHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
