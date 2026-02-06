import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/services/auth.service";

// adjust path
// or whatever you use to get session on server

type Role = "ADMIN" | "PROVIDER" | "CUSTOMER";

export default async function DashboardLayout({
  admin,
  provider,
  customer,
}: {
  admin: React.ReactNode;
  provider: React.ReactNode;
  customer: React.ReactNode;
}) {
  const { data } = await getSession();
  const role = (data?.user?.role as Role) ?? "CUSTOMER";

  // Sidebar component may expect lowercase; map it cleanly
  const userInfo = {
    role: role.toLowerCase() as "admin" | "provider" | "customer",
  };

  const content =
    role === "ADMIN" ? admin : role === "PROVIDER" ? provider : customer;

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{content}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// import { AppSidebar } from "@/components/app-sidebar";
// import { SiteHeader } from "@/components/site-header";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";

// export const iframeHeight = "800px";
// export const description = "A sidebar with a header and a search form.";

// export default function DashboardLayout({
//   admin,
//   provider,
//   customer,
// }: {
//   admin: React.ReactNode;
//   provider: React.ReactNode;
//   customer: React.ReactNode;
// }) {
//   const userInfo = {
//     role: "provider", // change later from session
//   };

//   return (
//     <div className="[--header-height:calc(--spacing(14))]">
//       <SidebarProvider className="flex flex-col">
//         <div className="flex flex-1">
//           {/* fixed prop name: user */}
//           <AppSidebar user={userInfo} />

//           <SidebarInset>
//             <SidebarTrigger className="-ml-1" />
//             <div className="flex flex-1 flex-col gap-4 p-4">
//               {/* fixed: user was undefined; use provider */}
//               {userInfo.role === "admin" ? admin : provider}
//             </div>
//           </SidebarInset>
//         </div>
//       </SidebarProvider>
//     </div>
//   );
// }
