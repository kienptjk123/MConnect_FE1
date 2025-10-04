import MentorHeader from "@/app/manage/mentor/mentor-header";
import MentorSidebar from "@/app/manage/mentor/mentor-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MentorSidebar />
      <SidebarInset className="flex flex-col h-screen">
        <MentorHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
