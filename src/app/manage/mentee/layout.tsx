import MenteeSidebar from "@/app/manage/mentee/mentee-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MenteeSidebar />
      <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-pink-50 transition-colors" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
