"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProfileStore } from "@/stores";
import {
  CalendarCheck,
  ChevronDown,
  FolderDot,
  LayoutDashboard,
  ListVideo,
  LogOut,
  MessageCircle,
  MonitorPlayIcon,
  ShoppingBag,
  User,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/manage/mentee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Explore Courses",
    url: "/manage/mentee/explore-courses",
    icon: MonitorPlayIcon,
  },
  {
    title: "Explore Mentors",
    url: "/manage/mentee/explore-mentor",
    icon: User2,
  },
  {
    title: "Work Experience Packages",
    url: "/manage/mentee/explore-work-exp-pkg",
    icon: ShoppingBag,
  },
  {
    title: "My Courses",
    url: "/manage/mentee/my-courses",
    icon: ListVideo,
  },
  {
    title: "My Projects",
    url: "/manage/mentee/my-projects",
    icon: FolderDot,
  },
  {
    title: "My Schedules",
    url: "/manage/mentee/my-schedules",
    icon: CalendarCheck,
  },
  {
    title: "Messages",
    url: "/manage/mentee/message",
    icon: MessageCircle,
  },
];

export default function MenteeSidebar() {
  const location = usePathname();
  const user = useProfileStore();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="dark:bg-[#080808] bg-white">
        <div className="flex items-center gap-2 px-3 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
          <Image src="/images/sandboxlogo.png" width={40} height={40} alt="" />
          <span className="truncate font-bold dark:text-white text-gray-900  text-lg group-data-[collapsible=icon]:hidden">
            MConnect
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar overflow-y-auto dark:bg-[#080808] bg-white">
        <SidebarGroup>
          <SidebarGroupContent className="">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="group relative hover:text-white h-12 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:bg-blue-400 hover:shadow-sm data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-400 data-[active=true]:to-blue-500 data-[active=true]:text-white data-[active=true]:shadow-lg group-data-[collapsible=icon]:justify-center"
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                      >
                        <div className="relative flex items-center justify-center">
                          <item.icon className="h-5 w-5 transition-transform " />
                        </div>
                        <span className="font-medium group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-pink-100 light:bg-white p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group h-14 rounded-xl light:bg-white shadow-sm border border-blue-300 hover:bg-gradient-to-r hover:bg-blue-100 hover:shadow-md transition-all duration-200 data-[state=open]:bg-gradient-to-r data-[state=open]:bg-blue-200 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                >
                  <Avatar className="h-9 w-9 rounded-xl border-2 border-blue-300 transition-all duration-300">
                    <AvatarImage
                      src={
                        user?.profile?.avatar ||
                        "/placeholder.svg?height=32&width=32"
                      }
                      alt="User"
                    />
                    <AvatarFallback className="rounded-xl bg-blue-500 text-white font-semibold text-sm">
                      {user?.profile?.name.charAt(2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold light:text-gray-900">
                      {user?.profile?.name}
                    </span>
                    <span className="truncate text-xs light:text-blue-600">
                      {user?.profile?.email}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-blue-500 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-blue-100 shadow-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <div className="flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-blue-100">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={
                        user?.profile?.avatar ||
                        "/placeholder.svg?height=32&width=32"
                      }
                      alt="User"
                    />
                    <AvatarFallback className="rounded-xl bg-blue-500 text-white font-semibold text-sm">
                      {user?.profile?.name.charAt(2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-gray-900">
                      {user?.profile?.name}
                    </span>
                    <span className="truncate text-xs text-blue-600">
                      {user?.profile?.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-blue-100" />
                <DropdownMenuItem
                  asChild
                  className="rounded-lg mx-1 my-1 hover:bg-blue-50"
                >
                  <Link href="/manage/mentee/profile" className="flex gap-2">
                    <User className="mr-3 h-4 w-4 text-blue-500" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="rounded-lg mx-1 my-1 hover:bg-blue-50"
                >
                  <Link href="/manage/mentee/order" className="flex gap-2">
                    <ShoppingBag className="mr-3 h-4 w-4 text-blue-500" />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-blue-100" />
                <DropdownMenuItem className="rounded-lg mx-1 cursor-pointer my-1  hover:bg-red-50 hover:text-blue-600 ">
                  <LogOut className="mr-3 h-4 w-4 text-blue-500" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
