"use client";

import Link from "next/link";
import {
  ArrowUp,
  Clock,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type FooterLink = { text: string; href: string };
type FooterSection = { title: string; items: FooterLink[] };
type SocialLink = { href: string; title: string; Icon: LucideIcon };

const footerSections: FooterSection[] = [
  {
    title: "Explore",
    items: [
      { text: "Meals", href: "/maels" },
      { text: "Categories", href: "/category" },
      { text: "Providers", href: "/provider" },
      { text: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "Company",
    items: [
      { text: "About", href: "/about" },
      { text: "Blog", href: "/blog" },
      { text: "Help", href: "/help" },
      { text: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { text: "Privacy", href: "/privacy" },
      { text: "Terms", href: "/terms" },
    ],
  },
];

const socialLinks: SocialLink[] = [
  {
    title: "Facebook",
    Icon: Facebook,
    href: "https://www.facebook.com/mohammad.fahim.muntasir",
  },
  {
    title: "LinkedIn",
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/md-fahim-muntasir-aa536b366/",
  },
  {
    title: "WhatsApp",
    Icon: MessageCircle,
    href: "https://wa.me/8801935880417",
  },
  {
    title: "Email",
    Icon: Mail,
    href: "mailto:fahimmuntasirbejoy@gmail.com",
  },
];

export default function EcommerceFooter1({
  className,
}: {
  className?: string;
}) {
  return (
    <footer className={cn("bg-background", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr_1fr]">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                FN
              </span>
              <span className="text-lg font-semibold tracking-tight">
                FoodNest
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              FoodNest connects customers with verified local food providers,
              public menus, transparent order tracking, and role-based
              dashboards.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm underline-offset-4 hover:underline"
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href="mailto:fahimmuntasirbejoy@gmail.com"
                  className="hover:underline"
                >
                  fahimmuntasirbejoy@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <Linkedin className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href="https://www.linkedin.com/in/md-fahim-muntasir-aa536b366/"
                  className="hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  md-fahim-muntasir-aa536b366
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href="https://wa.me/8801935880417"
                  className="hover:underline"
                >
                  WhatsApp: +880 1935 880 417
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Every day, 9:00 AM to 11:00 PM</span>
              </li>
            </ul>

            <ul className="mt-6 flex gap-2">
              {socialLinks.map((link) => (
                <SocialButton key={link.title} link={link} />
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} FoodNest. All rights reserved.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit rounded-md"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="size-4" />
            Back to top
          </Button>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ link }: { link: SocialLink }) {
  const Icon = link.Icon;

  return (
    <li>
      <Button asChild size="icon" variant="outline" className="rounded-md">
        <a
          href={link.href}
          aria-label={link.title}
          target="_blank"
          rel="noreferrer"
        >
          <Icon className="size-4" />
        </a>
      </Button>
    </li>
  );
}
