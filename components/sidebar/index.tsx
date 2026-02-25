"use client";

import { SidebarType } from "@/types";
import { other_links, sidebarLinks } from "@/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { LogOut } from "lucide-react";
import Cookie from "js-cookie";
import { notificationApi } from "@/shared/generics/notification";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const notify = notificationApi();
  const { state } = useSidebar();

  useEffect(() => {
    const token = Cookie.get("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("user");
    notify("LogOut");
    router.replace("/login");
  };

  return (
    <>
      <SidebarContent className=" flex-col justify-between">
        <div>
          <SidebarGroup>
            <div className="text-xs my-4 text-muted-foreground  mt-2">
              {state === "collapsed" ? "CRM" : "Admin CRM"}
            </div>

            <SidebarMenu>
              {sidebarLinks.map((link: SidebarType) => (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.path}
                    tooltip={link.name}
                  >
                    <Link href={link.path}>
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Boshqalar</SidebarGroupLabel>

            <SidebarMenu>
              {other_links.map((link: SidebarType) => (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.path}
                    tooltip={link.name}
                  >
                    <Link href={link.path}>
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </div>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Chiqish">
                <LogOut className="h-4 w-4" />
                <span>Chiqish</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </>
  );
};

export default SideBar;
