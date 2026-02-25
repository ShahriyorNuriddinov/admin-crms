import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import MainProvider from "@/provider/mainProvider";
import SideBar from "@/components/sidebar";
import Header from "@/components/header";

import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Admin CRM",
  description: "Admin Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <MainProvider>
          <SidebarProvider defaultOpen={true}>
            {/* SIDEBAR */}
            <Sidebar collapsible="icon">
              <SideBar />
            </Sidebar>

            {/* CONTENT */}
            <SidebarInset>
              <Header />
              <div className="p-4">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </MainProvider>
      </body>
    </html>
  );
}
