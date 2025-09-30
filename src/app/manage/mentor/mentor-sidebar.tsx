"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useLogoutMutation } from "@/queries/useLogout";
import { useProfileStore } from "@/stores";
import {
  ChevronDown,
  LayoutDashboard,
  List,
  ListChecks,
  LogOut,
  MessageCircle,
  MonitorPlayIcon,
  Settings,
  ShoppingBag,
  User,
  WorkflowIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/manage/mentor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Course",
    url: "/manage/mentor/courses",
    icon: ListChecks,
    children: [
      {
        title: "Category",
        url: "/manage/mentor/courses/category",
        icon: ListChecks,
      },
      {
        title: "Label",
        url: "/manage/mentor/courses/label",
        icon: ListChecks,
      },

      {
        title: "Course",
        url: "/manage/mentor/courses/course",
        icon: ListChecks,
      },
    ],
  },
  {
    title: "Kanban",
    url: "/manage/mentor/kanban",
    icon: ListChecks,
  },
  {
    title: "Single Sessions",
    url: "/manage/mentor/single-session",
    icon: List,
  },
  {
    title: "Work Schedule",
    url: "/manage/mentor/work-schedule",
    icon: MonitorPlayIcon,
  },
  {
    title: "Messages",
    url: "/manage/mentor/message",
    icon: MessageCircle,
  },
  {
    title: "Work Experience Packages",
    url: "/manage/mentor/work-experience-package",
    icon: WorkflowIcon,
  },
];
export default function MentorSidebar() {
  const location = usePathname();
  const logoutMutation = useLogoutMutation();
  const user = useProfileStore();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="dark:bg-[#080808]">
        <div className="flex items-center gap-2 px-3 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
          <Image src="/images/sandboxlogo.png" width={40} height={40} alt="" />
          <span className="truncate font-bold dark:text-white text-gray-900  text-lg group-data-[collapsible=icon]:hidden">
            MConnect
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className=" custom-scrollbar overflow-y-auto dark:bg-[#080808]">
        <SidebarGroup>
          <SidebarGroupContent className="">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location === item.url;
                if (item.children) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger
                          className="ml-1 hover:text-white cursor-pointer"
                          asChild
                        >
                          <SidebarMenuButton
                            isActive={isActive}
                            className="hover:text-white group relative  h-12 rounded-xl transition-all duration-200 
                            hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 hover:shadow-sm
                            data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-400 data-[active=true]:to-blue-500 
                            data-[active=true]:text-white data-[active=true]:shadow-lg 
                            group-data-[collapsible=icon]:justify-center"
                            tooltip={item.title}
                          >
                            <div className="flex hover:text-white items-center gap-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium group-data-[collapsible=icon]:hidden">
                                {item.title}
                              </span>
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub className="m-0 p-0 border-0">
                            {item.children.map((child) => {
                              const isChildActive = location === child.url;
                              return (
                                <SidebarMenuSubItem
                                  key={child.title}
                                  className="w-[165px]"
                                >
                                  <SidebarMenuButton
                                    asChild
                                    isActive={isChildActive}
                                    className="ml-8 h-10 rounded-lg text-sm
                                hover:bg-blue-50 dark:hover:bg-gray-800 
                                data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-gray-700"
                                  >
                                    <Link
                                      href={child.url}
                                      className="flex items-center gap-2 px-2"
                                    >
                                      <child.icon className="h-4 w-4" />
                                      <span>{child.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="group relative hover:text-white h-12 rounded-xl transition-all duration-200 
                  hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 hover:shadow-sm 
                  data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-400 data-[active=true]:to-blue-500 
                  data-[active=true]:text-white data-[active=true]:shadow-lg 
                  group-data-[collapsible=icon]:justify-center"
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon className="h-5 w-5" />
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

      <SidebarFooter className="border-t border-pink-100 bg-white p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group h-14 rounded-xl bg-white shadow-sm border border-pink-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:shadow-md transition-all duration-200 data-[state=open]:bg-gradient-to-r data-[state=open]:from-pink-100 data-[state=open]:to-rose-100 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                >
                  <Avatar className="h-9 w-9 rounded-xl border-2 border-pink-200 transition-all duration-300">
                    <AvatarImage
                      src={
                        user?.profile?.avatar ||
                        "/placeholder.svg?height=32&width=32"
                      }
                      alt="User"
                    />
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white font-semibold text-sm">
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
                  <ChevronDown className="ml-auto size-4 text-blue-500 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-pink-100 shadow-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <div className="flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-pink-50 to-rose-50">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={
                        user?.profile?.avatar ||
                        "/placeholder.svg?height=32&width=32"
                      }
                      alt="User"
                    />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white text-sm">
                      {user?.profile?.name.charAt(2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-gray-900">
                      {" "}
                      {user?.profile?.name}
                    </p>
                    <p className="text-xs text-blue-600">
                      {" "}
                      {user?.profile?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-pink-100" />
                <DropdownMenuItem className="rounded-lg mx-1 my-1 hover:bg-pink-50">
                  <User className="mr-3 h-4 w-4 text-pink-500" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg mx-1 my-1 hover:bg-pink-50">
                  <ShoppingBag className="mr-3 h-4 w-4 text-pink-500" />
                  <span>Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg mx-1 my-1 hover:bg-pink-50">
                  <Settings className="mr-3 h-4 w-4 text-pink-500" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-pink-100" />
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  className="rounded-lg mx-1 cursor-pointer my-1 text-red-600 hover:bg-red-50 hover:text-red-700 "
                >
                  <LogOut className="mr-3 h-4 w-4" />
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
