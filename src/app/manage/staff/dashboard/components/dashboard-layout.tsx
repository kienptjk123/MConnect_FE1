// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import {
//   LayoutDashboard,
//   Users,
//   UserCheck,
//   FileText,
//   CreditCard,
//   Wallet,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navigation = [
//   { name: "Dashboard", icon: LayoutDashboard, current: true },
//   { name: "Mentee Management", icon: Users, current: false },
//   { name: "Mentor Management", icon: UserCheck, current: false },
//   { name: "Mentor Application", icon: FileText, current: false },
//   { name: "Withdraw", icon: Wallet, current: false },
//   { name: "Payment & Order", icon: CreditCard, current: false },
// ];

// interface DashboardLayoutProps {
//   children: React.ReactNode;
// }

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Main content */}
//       <div className="flex flex-1 flex-col lg:pl-64">
//         <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="lg:hidden"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="h-5 w-5" />
//           </Button>

//           <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
//             <div className="flex flex-1 items-center">
//               <h1 className="text-xl font-semibold text-foreground">
//                 Dashboard
//               </h1>
//             </div>
//           </div>
//         </div>

//         <main className="flex-1 overflow-y-auto">
//           <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function SidebarContent({ onClose }: { onClose?: () => void }) {
//   return (
//     <>
//       <div className="flex h-16 shrink-0 items-center px-6">
//         <div className="flex items-center gap-2">
//           <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
//             <span className="text-primary-foreground font-bold text-sm">R</span>
//           </div>
//           <span className="text-lg font-semibold text-sidebar-foreground">
//             ReConnect
//           </span>
//         </div>
//         {onClose && (
//           <Button
//             variant="ghost"
//             size="sm"
//             className="ml-auto lg:hidden"
//             onClick={onClose}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         )}
//       </div>

//       <ScrollArea className="flex-1 px-3">
//         <nav className="space-y-1 py-4">
//           {navigation.map((item) => (
//             <Button
//               key={item.name}
//               variant={item.current ? "secondary" : "ghost"}
//               className={cn(
//                 "w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
//                 item.current && "bg-sidebar-accent text-sidebar-foreground"
//               )}
//             >
//               <item.icon className="h-4 w-4" />
//               {item.name}
//             </Button>
//           ))}
//         </nav>
//       </ScrollArea>

//       <div className="p-3">
//         <Separator className="mb-3" />
//         <div className="space-y-1">
//           <Button
//             variant="ghost"
//             className="w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
//           >
//             <Settings className="h-4 w-4" />
//             Settings
//           </Button>
//           <Button
//             variant="ghost"
//             className="w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
//           >
//             <LogOut className="h-4 w-4" />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }
