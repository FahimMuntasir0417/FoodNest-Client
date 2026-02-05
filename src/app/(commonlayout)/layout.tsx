import EcommerceFooter1 from "@/components/ecommerce-footer1";
import { Navbar } from "@/lib/components/common-component/navbar";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Subtle background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(60rem_30rem_at_50%_-10%,hsl(var(--primary)/0.12),transparent_60%)]" />
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <Navbar />
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-14">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t">
        <EcommerceFooter1 />
      </footer>
    </div>
  );
}
