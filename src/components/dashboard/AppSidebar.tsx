"use client"

import * as React from "react"
import {
  Ship,
  LayoutDashboard,
  Database,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Kelola Data",
      url: "/dashboard/kelola-data",
      icon: Database,
    },
    {
      title: "Rekap Data",
      url: "/dashboard/rekap-data",
      icon: FileText,
    },
    {
      title: "Kelola User",
      url: "/dashboard/kelola-user",
      icon: Users,
    },
  ],
  footer: [
    {
      title: "Pengaturan",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Keluar",
      url: "/logout",
      icon: LogOut,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/10" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-primary/5">
        <div className="flex items-center gap-3 px-4 w-full">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Ship className="h-5 w-5" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-primary leading-none">KAKAP OPS</span>
            <span className="text-[10px] text-muted-foreground uppercase font-medium mt-1">Operational Area</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                render={<Link href={item.url} />}
                isActive={pathname === item.url}
                tooltip={item.title}
                className="h-11 transition-all hover:bg-primary/5"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-primary/5 py-4">
        <SidebarMenu>
          {data.footer.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                render={<Link href={item.url} />}
                tooltip={item.title}
                className={`h-11 transition-all ${item.title === 'Keluar' ? 'text-red-500 hover:bg-red-50' : 'hover:bg-primary/5'}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
