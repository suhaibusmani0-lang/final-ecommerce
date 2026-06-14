"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { AdminSideBarMenu } from "@/lib/AdminSideBarMenu";

export const AppSideBar = () => {
  const menuItems = Object.values(AdminSideBarMenu);
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader className="border-b h-30 p-0">
        <div className="flex justify-between items-center px-4">
          <Image
            src="/assets/images/logo-black1.png"
            alt="logo"
            width={200}
            height={100}
            className="block dark:hidden"
          />
          <Image
            src="/assets/images/logo-white.png"
            alt="logo"
            width={200}
            height={100}
            className="hidden dark:block"
          />
          <Button onClick={toggleSidebar} type="button" size="icon" className="md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
          {menuItems.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                  <span>{menu.icon}</span>
                  <span>{menu.title}</span>
                  {menu.submenu?.length > 0 && (
                    <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </div>
              </CollapsibleTrigger>

              {menu.submenu?.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub >
                    {menu.submenu.map((subMenuItem, subMenuIndex) => (
                      <SidebarMenuSubItem key={subMenuIndex} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
                        <SidebarMenuSubButton asChild className="py-2">
                          <Link href={subMenuItem.url}  className="py-2">{subMenuItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
