"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { siFacebook, siInstagram, siX, type SimpleIcon } from "simple-icons";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type FooterLink = { text: string; href: string };
type FooterSection = { title: string; items: FooterLink[] };
type SocialLink = { href: string; icon: SimpleIcon };

const newsletterSchema = z.object({
  email: z.email("Enter a valid email address."),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

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
  { icon: siFacebook, href: "https://www.facebook.com/" },
  { icon: siInstagram, href: "https://www.instagram.com/" },
  { icon: siX, href: "https://x.com/" },
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
            <NewsletterForm />
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
                <a href="mailto:support@foodnest.app" className="hover:underline">
                  support@foodnest.app
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href="tel:+8801700000000" className="hover:underline">
                  +880 1700 000 000
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Every day, 9:00 AM to 11:00 PM</span>
              </li>
            </ul>

            <ul className="mt-6 flex gap-2">
              {socialLinks.map(({ icon, href }) => (
                <li key={icon.slug}>
                  <Button
                    asChild
                    size="icon"
                    variant="outline"
                    className="rounded-md"
                  >
                    <a href={href} aria-label={icon.title}>
                      <img
                        className="size-4 dark:hidden"
                        alt=""
                        src={`https://cdn.simpleicons.org/${icon.slug}/1f2937`}
                      />
                      <img
                        className="hidden size-4 dark:block"
                        alt=""
                        src={`https://cdn.simpleicons.org/${icon.slug}/f8fafc`}
                      />
                    </a>
                  </Button>
                </li>
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

function NewsletterForm() {
  const [success, setSuccess] = React.useState(false);
  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  function onSubmit() {
    setSuccess(false);
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setSuccess(true);
        form.reset();
        resolve();
      }, 500);
    });
  }

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              type="email"
              autoComplete="email"
              placeholder="Email address"
              aria-invalid={fieldState.invalid}
              disabled={form.formState.isSubmitting}
              className="h-10 rounded-md"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Button
        type="submit"
        className="h-10 w-full rounded-md"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
      </Button>
      {success ? (
        <p className="text-sm font-medium text-primary">
          Subscription saved for FoodNest updates.
        </p>
      ) : null}
    </form>
  );
}
