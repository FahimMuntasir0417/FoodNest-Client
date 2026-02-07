"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronUp, Clock, LucideIcon, MapPin, Phone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { siFacebook, siInstagram, SimpleIcon, siX } from "simple-icons";
import z from "zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type FooterLink = { text: string; link: string };
type FooterLinksSection = { title: string; items: FooterLink[] };

type SocialLink = { link: string; icon: SimpleIcon };

const LINK_TYPES = {
  NO_LINK: "NO_LINK",
  PHONE_LINK: "PHONE_LINK",
  EMAIL_LINK: "EMAIL_LINK",
} as const;

type LinkTypes = keyof typeof LINK_TYPES;

type ContactLink = {
  icon: LucideIcon;
  text: string;
  type: LinkTypes;
  link?: string;
};

type ContactLinks = {
  contactDetails: ContactLink[];
  socialMedia: SocialLink[];
};

const newsletterFormSchema = z.object({
  email: z.string().email(),
});
type NewsletterFormType = z.infer<typeof newsletterFormSchema>;

export default function EcommerceFooter1({
  className,
}: {
  className?: string;
}) {
  // ✅ No params: use constants inside
  const newsletter = {
    title: "FoodNest",
    description:
      "Join our newsletter to receive exclusive deals, tech tips, product launches, and early access to the latest electronics.",
  };

  const footerLinks: FooterLinksSection[] = [
    {
      title: "Information",
      items: [
        { text: "Terms and Conditions", link: "#" },
        { text: "Privacy Policy", link: "#" },
        { text: "Warranty Policy", link: "#" },
        { text: "Terms of Service", link: "#" },
      ],
    },
    {
      title: "Collections",
      items: [
        { text: "New Arrivals", link: "#" },
        { text: "Best Sellers", link: "#" },
        { text: "Seasonal Edits", link: "#" },
        { text: "Wardrobe Essentials", link: "#" },
      ],
    },
  ];

  const contactLinks: ContactLinks = {
    contactDetails: [
      {
        icon: MapPin,
        text: "support@store.com",
        link: "support@store.com",
        type: "EMAIL_LINK",
      },
      {
        icon: Phone,
        text: "+12345678910",
        link: "+12345678910",
        type: "PHONE_LINK",
      },
      {
        icon: Clock,
        text: "Monday - Friday, 9 am - 9 pm",
        type: "NO_LINK",
      },
    ],
    socialMedia: [
      { icon: siFacebook, link: "#" },
      { icon: siX, link: "#" },
      { icon: siInstagram, link: "#" },
    ],
  };

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container mx-auto space-y-10 px-4 py-10 md:px-6 xl:py-12">
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          <NewsletterSection
            title={newsletter.title}
            description={newsletter.description}
          />
          <FooterLinks sections={footerLinks} />
          <ContactSection links={contactLinks} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Select defaultValue="english">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="français">Français</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4 md:gap-12">
          <Separator className="flex-1" />
          <div className="basis-32 md:basis-40">
            <a href="/" className="block">
              <img
                className="block dark:hidden"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-wordmark-black.svg"
                alt="Logo"
              />
            </a>
            <div className="font-semibold text-neutral-200">
              {" "}
              FooNest ......Commited to better food
            </div>
          </div>
          <Separator className="flex-1" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <p className="text-muted-foreground text-xs md:text-sm">
            Copyright © {new Date().getFullYear()}
          </p>
          <Separator
            orientation="vertical"
            className="hidden h-4 bg-foreground/40 sm:block"
          />
          <p className="text-xs md:text-sm">Powered by FoodNest</p>

          <Button
            size="icon"
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            <ChevronUp />
          </Button>
        </div>
      </div>
    </footer>
  );
}

function NewsletterSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const form = useForm<NewsletterFormType>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: NewsletterFormType) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold leading-none">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Email address"
                className="h-11 rounded-xl"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button className="h-11 w-full rounded-xl">Subscribe</Button>
      </form>
    </div>
  );
}

function FooterLinks({ sections }: { sections: FooterLinksSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="mb-5 text-sm font-medium uppercase text-muted-foreground">
            {section.title}
          </h2>
          <ul className="space-y-3">
            {section.items.map((item) => (
              <li key={item.text}>
                <a
                  href={item.link}
                  className="text-sm underline-offset-4 hover:underline"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function ContactSection({ links }: { links: ContactLinks }) {
  const { socialMedia, contactDetails } = links;

  return (
    <div>
      <h2 className="mb-5 text-sm font-medium uppercase text-muted-foreground">
        Contact
      </h2>

      <div className="space-y-6">
        <ul className="space-y-3">
          {contactDetails.map((item) => {
            const href =
              item.type === "EMAIL_LINK"
                ? `mailto:${item.link}`
                : item.type === "PHONE_LINK"
                  ? `tel:${item.link}`
                  : undefined;

            return (
              <li className="flex items-center gap-3" key={item.text}>
                <item.icon className="size-4 shrink-0" />
                <div className="flex-1">
                  {href ? (
                    <a
                      href={href}
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <p className="text-sm">{item.text}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <ul className="flex flex-wrap gap-3">
          {socialMedia.map(({ icon, link }) => (
            <li key={icon.slug}>
              <Button
                size="icon"
                variant="outline"
                asChild
                className="rounded-xl"
              >
                <a href={link} aria-label={icon.title}>
                  <img
                    className="size-5 dark:hidden"
                    alt={icon.title}
                    src={`https://cdn.simpleicons.org/${icon.slug}/black`}
                  />
                  <img
                    className="hidden size-5 dark:block"
                    alt={icon.title}
                    src={`https://cdn.simpleicons.org/${icon.slug}/white`}
                  />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
