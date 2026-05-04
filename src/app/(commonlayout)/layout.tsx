import EcommerceFooter1 from "@/components/ecommerce-footer1";
import { Navbar } from "@/lib/components/common-component/navbar";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Navbar />
      </header>

      <main className="w-full">{children}</main>

      <footer className="border-t">
        <EcommerceFooter1 />
      </footer>
    </div>
  );
}
