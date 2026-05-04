import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contacts = [
  {
    title: "Email",
    value: "support@foodnest.app",
    href: "mailto:support@foodnest.app",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+880 1700 000 000",
    href: "tel:+8801700000000",
    icon: Phone,
  },
  {
    title: "Office",
    value: "Banani, Dhaka 1213, Bangladesh",
    href: "https://www.google.com/maps/search/?api=1&query=Banani%20Dhaka%201213%20Bangladesh",
    icon: MapPin,
  },
  {
    title: "Hours",
    value: "Every day, 9:00 AM to 11:00 PM",
    href: null,
    icon: Clock,
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-sm font-medium text-primary">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Get support for ordering, provider setup, or dashboard access.
          </h1>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Send a message with your account email, order ID, provider name, or
            dashboard role so the support team can route the request quickly.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {contacts.map((item) => (
              <Card key={item.title} className="rounded-lg">
                <CardHeader>
                  <item.icon className="size-5 text-primary" />
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {item.href ? (
                    <a href={item.href} className="hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
