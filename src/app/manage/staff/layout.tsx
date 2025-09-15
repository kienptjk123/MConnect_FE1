import StaffHeader from "@/app/manage/staff/staff-header";
import StaffSidebar from "@/app/manage/staff/staff-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <StaffHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
