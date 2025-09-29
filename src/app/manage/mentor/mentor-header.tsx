import NotificationDropdown from "@/app/manage/mentor/notifications/_components/NotificationDropdown/NotificationDropdown";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function MentorHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 bg-white dark:bg-[#080808] border-b border-pink-100">
      <div className="flex items-center gap-4 px-6">
        <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-pink-50 dark:text-white transition-colors" />
        <div className="h-6 w-px bg-pink-200" />
        <div></div>
      </div>
      <div className="ml-auto flex items-center gap-3 px-6">
        <NotificationDropdown />
        <ModeToggle />
      </div>
    </header>
  );
}
