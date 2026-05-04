import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChefHat,
  Clock,
  MessageSquare,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MealListingCard } from "@/components/meals/meal-listing-card";
import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import {
  averageRating,
  fallbackMealImage,
  formatMoney,
  mealImage,
} from "@/lib/foodnest-data";
import type { Category, Provider } from "@/types";
import type { Meal } from "@/types/meal/meal";
import type { Review } from "@/services/reviews.service";

type HomeProps = {
  meals: Meal[];
  categories: Category[];
  providers: Provider[];
  reviews: Review[];
};

const featureCards = [
  {
    title: "Verified kitchens",
    description:
      "Provider profiles, contact details, and menu availability are visible before checkout.",
    icon: ShieldCheck,
  },
  {
    title: "Role-based dashboards",
    description:
      "Customers, providers, and admins each get workflows focused on the tasks they own.",
    icon: BadgeCheck,
  },
  {
    title: "Trackable orders",
    description:
      "Order totals, delivery details, statuses, and item histories stay organized in one place.",
    icon: PackageCheck,
  },
];

const serviceSteps = [
  {
    title: "Browse",
    description: "Search meals by cuisine, category, availability, and price.",
    icon: ShoppingBag,
  },
  {
    title: "Order",
    description:
      "Review details, add meals to cart, and place delivery orders.",
    icon: Truck,
  },
  {
    title: "Manage",
    description:
      "Use the dashboard to review orders, menus, users, and reports.",
    icon: Store,
  },
];

const orderJourney = [
  {
    title: "Order placed",
    description:
      "Customers can review meals, quantities, totals, and delivery details.",
    icon: ShoppingBag,
  },
  {
    title: "Kitchen update",
    description:
      "Providers can move orders through preparation and delivery states.",
    icon: ChefHat,
  },
  {
    title: "Delivery tracked",
    description:
      "The customer dashboard keeps order status and history easy to scan.",
    icon: Truck,
  },
];

const providerTools = [
  {
    title: "Menu control",
    description:
      "Create meals, assign categories, update prices, and manage availability.",
    icon: Store,
  },
  {
    title: "Order handling",
    description:
      "Review incoming orders and update status from one focused workflow.",
    icon: PackageCheck,
  },
  {
    title: "Profile visibility",
    description:
      "Shop details, contact information, and locations are visible to customers.",
    icon: BadgeCheck,
  },
];

const promiseItems = [
  {
    title: "Verified providers",
    description:
      "Provider profiles and dashboard access are tied to authenticated users.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent pricing",
    description:
      "Meal cards show price, provider, category, and availability before checkout.",
    icon: ShoppingBag,
  },
  {
    title: "Order history",
    description:
      "Customers and admins can review order records after checkout.",
    icon: Clock,
  },
  {
    title: "Support-ready pages",
    description:
      "Help, contact, privacy, and terms pages are available from the public site.",
    icon: MessageSquare,
  },
];

const faqItems = [
  {
    question: "Can customers view meals without logging in?",
    answer:
      "Yes. Meal listings, detail pages, categories, providers, reviews, and public content are available before authentication.",
  },
  {
    question: "What can providers manage?",
    answer:
      "Providers can create meals under categories, review incoming orders, and update order statuses from their dashboard.",
  },
  {
    question: "How does FoodNest keep admin work organized?",
    answer:
      "Admins can monitor users, meals, categories, orders, revenue signals, and platform activity from dedicated dashboard pages.",
  },
];

const fallbackSlides: HeroSlide[] = [
  {
    id: "foodnest-kitchen-network",
    title: "Fresh meals near you",
    description:
      "FoodNest brings local providers, category browsing, and order tracking into one responsive food ordering experience.",
    imageUrl: fallbackMealImage(),
    href: "/maels",
    meta: "Live menu browsing",
    price: null,
  },
];

const allowedImageHosts = new Set([
  "images.foodhub.com",
  "images.unsplash.com",
  "res.cloudinary.com",
  "i.ibb.co",
  "images.pexels.com",
  "cdn.pixabay.com",
]);

function buildSlides(meals: Meal[]): HeroSlide[] {
  const slides = meals.slice(0, 4).map((meal) => ({
    id: meal.id,
    title: meal.title,
    description:
      meal.description?.trim() ||
      `${meal.cuisine || "Fresh"} meal from ${meal.provider?.shopName || "a FoodNest provider"}.`,
    imageUrl: mealImage(meal),
    href: `/maels/${meal.id}`,
    meta: `${meal.category?.name || "Featured"} menu`,
    price: meal.price,
  }));

  return slides.length ? slides : fallbackSlides;
}

function providerLogoUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    return allowedImageHosts.has(parsed.hostname) ? url : null;
  } catch {
    return null;
  }
}

export function FoodNestHome({
  meals,
  categories,
  providers,
  reviews,
}: HomeProps) {
  const availableMeals = meals.filter((meal) => meal.isAvailable);
  const featuredMeals = (availableMeals.length ? availableMeals : meals).slice(
    0,
    8,
  );
  const topRated = meals
    .map((meal) => ({ meal, rating: averageRating(meal.reviews) }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? reviews.reduce((sum, review) => sum + Number(review.rating ?? 0), 0) /
      totalReviews
    : 0;
  const lowestPrice = meals.length
    ? Math.min(...meals.map((meal) => Number(meal.price ?? 0)))
    : 0;
  const carouselMeals = (availableMeals.length ? availableMeals : meals).slice(
    0,
    10,
  );
  const discountMeals = featuredMeals.slice(0, 3);

  return (
    <div className="bg-background text-foreground">
      <HeroCarousel slides={buildSlides(meals)} />

      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 md:px-6">
          <Stat label="Meals listed" value={String(meals.length)} />
          <Stat label="Available now" value={String(availableMeals.length)} />
          <Stat label="Verified providers" value={String(providers.length)} />
          <Stat
            label="Starting price"
            value={lowestPrice ? formatMoney(lowestPrice) : "Updated daily"}
          />
        </div>
      </section>

      <DiscountSection meals={discountMeals} />

      <MenuCarouselSection meals={carouselMeals} />

      <TrackOrderSection />

      <ProviderToolsSection providers={providers} />

      <FoodNestPromiseSection />

      <Section
        eyebrow="Platform features"
        title="Built for repeat ordering and operations"
        description="FoodNest keeps the public menu, provider workflow, customer history, and admin controls aligned across one application."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="h-full rounded-lg">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Featured menu"
        title="Explore meals ready for ordering"
        description="Every card uses live meal information from the API, including image, title, description, pricing, provider, and rating signals."
        action={
          <Button asChild variant="outline" className="rounded-md">
            <Link href="/maels">
              View all meals
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      >
        {featuredMeals.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredMeals.map((meal) => (
              <MealListingCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <EmptyPanel
            title="Meals are being updated"
            description="The public API did not return meals for this request. Categories, providers, and dashboard pages remain available."
          />
        )}
      </Section>

      <Section
        eyebrow="Categories"
        title="Browse by menu structure"
        description="Categories help customers move from a broad appetite to a specific meal without guessing provider names."
      >
        {categories.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/maels?category=${encodeURIComponent(category.id)}`}
                className="rounded-lg border bg-card p-4 shadow-sm transition hover:border-primary hover:bg-primary/5"
              >
                <p className="font-semibold">{category.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Slug: {category.slug}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyPanel
            title="Categories are not available"
            description="The app will show category links here as soon as the API returns them."
          />
        )}
      </Section>

      <Section
        eyebrow="How it works"
        title="A short path from discovery to delivery"
        description="The primary flow is intentionally direct, while dashboards handle the operational detail behind each order."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {serviceSteps.map((step, index) => (
            <Card key={step.title} className="rounded-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
                    {index + 1}
                  </span>
                  <step.icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-base">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {step.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Provider network"
        title="Local providers customers can compare"
        description="Provider cards surface shop names, locations, and contacts so customers know who prepares their meals."
      >
        {providers.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {providers.slice(0, 3).map((provider) => (
              <Card key={provider.id} className="rounded-lg">
                <CardHeader>
                  <CardTitle className="text-base">
                    {provider.shopName || "FoodNest provider"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>{provider.address || "Address managed by provider"}</p>
                  <p>{provider.phone || "Phone available after selection"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyPanel
            title="Provider list is not available"
            description="Provider profiles appear here when the API returns provider records."
          />
        )}
      </Section>

      <Section
        eyebrow="Ratings"
        title="Customer feedback stays visible"
        description="Reviews and ratings help customers compare meals before placing an order."
      >
        <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Star className="size-5" />
              </div>
              <CardTitle className="text-base">Average rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {avgRating ? avgRating.toFixed(1) : "New"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on {totalReviews} customer review
                {totalReviews === 1 ? "" : "s"}.
              </p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            {topRated.map(({ meal, rating }) => (
              <Card key={meal.id} className="rounded-lg">
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-base">
                    {meal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    {rating ? `${rating.toFixed(1)} out of 5` : "No rating yet"}
                  </p>
                  <Link
                    href={`/maels/${meal.id}`}
                    className="mt-3 inline-flex items-center gap-2 font-medium text-primary hover:underline"
                  >
                    View meal
                    <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Insights"
        title="FoodNest content for customers and providers"
        description="Operational guidance and ordering tips make the platform useful beyond the checkout moment."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Choosing meals by category",
              href: "/blog#category-browsing",
              icon: ChefHat,
            },
            {
              title: "How providers keep menus current",
              href: "/blog#provider-operations",
              icon: Store,
            },
            {
              title: "Reading order status updates",
              href: "/blog#order-tracking",
              icon: Clock,
            },
          ].map((post) => (
            <Link
              key={post.title}
              href={post.href}
              className="rounded-lg border bg-card p-5 shadow-sm transition hover:border-primary hover:bg-primary/5"
            >
              <post.icon className="size-5 text-primary" />
              <p className="mt-4 font-semibold">{post.title}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Read article
                <ArrowRight className="size-4" />
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="FAQ"
        title="Answers before checkout"
        description="These are the questions customers and providers need answered before relying on the platform."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {faqItems.map((item) => (
            <Card key={item.question} className="rounded-lg">
              <CardHeader>
                <MessageSquare className="size-5 text-primary" />
                <CardTitle className="text-base">{item.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {item.answer}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <section className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-sm font-medium text-primary">
              Ready for dinner planning
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Start with the live FoodNest menu.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-md">
              <Link href="/maels">Explore meals</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-md">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DiscountSection({ meals }: { meals: Meal[] }) {
  const discounts = [25, 20, 15];

  return (
    <section className="border-y border-emerald-800/40 bg-white text-black dark:bg-[#00121A] dark:text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-white/70">Limited deals</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
            Save on featured FoodNest meals today.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/75 md:text-base">
            Highlight seasonal offers, launch deals, and value meals without
            sending customers away from the live menu.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="rounded-md">
              <Link href="/maels">
                Browse deals
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-md border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/category">View categories</Link>
            </Button>
          </div>
        </div>

        {meals.length ? (
          <div className="grid gap-3">
            {meals.map((meal, index) => {
              const discount = discounts[index] ?? 10;
              const discountedPrice = Number(meal.price) * (1 - discount / 100);

              return (
                <Link
                  key={meal.id}
                  href={`/maels/${meal.id}`}
                  className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.08] p-3 transition hover:bg-white/[0.12] sm:grid-cols-[96px_1fr_auto] sm:items-center"
                >
                  <div className="relative aspect-square overflow-hidden rounded-md bg-white/10">
                    <Image
                      src={mealImage(meal)}
                      alt={meal.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{meal.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-white/70">
                      {meal.description || "Featured FoodNest meal"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold">{discount}% off</p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatMoney(discountedPrice)}
                    </p>
                    <p className="text-xs text-white/55">
                      was {formatMoney(meal.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.08] p-6">
            <p className="font-semibold">Discount meals are loading</p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Deals will appear here as soon as the meal API returns featured
              items.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function MenuCarouselSection({ meals }: { meals: Meal[] }) {
  return (
    <Section
      eyebrow="Menu carousel"
      title="Swipe through popular picks"
      description="A horizontal meal carousel gives customers a fast way to compare images, prices, categories, and providers."
      action={
        <Button asChild variant="outline" className="rounded-md">
          <Link href="/maels">
            Full menu
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      }
    >
      {meals.length ? (
        <div className="flex snap-x gap-4 overflow-x-auto pb-3">
          {meals.map((meal) => (
            <Link
              key={meal.id}
              href={`/maels/${meal.id}`}
              className="min-w-[260px] snap-start overflow-hidden rounded-lg border bg-card shadow-sm transition hover:border-primary hover:bg-primary/5 sm:min-w-[320px]"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={mealImage(meal)}
                  alt={meal.title}
                  fill
                  sizes="(max-width: 640px) 260px, 320px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-1 font-semibold">{meal.title}</p>
                  <p className="shrink-0 text-sm font-semibold text-primary">
                    {formatMoney(meal.price)}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {meal.description || "Fresh meal from a verified provider."}
                </p>
                <p className="text-xs font-medium text-muted-foreground">
                  {meal.category?.name || "Featured"} by{" "}
                  {meal.provider?.shopName || "FoodNest provider"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyPanel
          title="Carousel meals are not available"
          description="The carousel will show live meal cards when the API returns meal records."
        />
      )}
    </Section>
  );
}

function TrackOrderSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-7 max-w-2xl">
          <p className="text-sm font-medium text-primary">Track Order</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
            Keep every order state visible.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            Customers, providers, and admins can follow the same order from
            checkout through kitchen updates and delivery.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {orderJourney.map((item) => (
            <div key={item.title} className="rounded-lg border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <p className="mt-4 font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-md">
            <Link href="/customer-dashboard/customer-order">
              Track my order
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-md">
            <Link href="/order-item">View cart</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProviderToolsSection({ providers }: { providers: Provider[] }) {
  return (
    <Section
      eyebrow="Provider tools"
      title="Give kitchens a focused operations area"
      description="The provider dashboard is designed for meal management, order review, and profile visibility."
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-3">
          {providerTools.map((tool) => (
            <div
              key={tool.title}
              className="flex gap-4 rounded-lg border bg-card p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <tool.icon className="size-5" />
              </div>
              <div>
                <p className="font-semibold">{tool.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">
                Provider spotlight
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                Active local kitchens
              </h3>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-md">
              <Link href="/provider">See all</Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            {providers.slice(0, 3).map((provider) => {
              const logoUrl = providerLogoUrl(provider.logoUrl);

              return (
                <Link
                  key={provider.id}
                  href="/provider"
                  className="flex items-center gap-3 rounded-md border p-3 transition hover:border-primary hover:bg-primary/5"
                >
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-sm font-semibold">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={provider.shopName || "Provider"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <Store className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {provider.shopName || "FoodNest provider"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {provider.address || "Location managed by provider"}
                    </p>
                  </div>
                </Link>
              );
            })}
            {!providers.length ? (
              <p className="rounded-md border p-4 text-sm leading-6 text-muted-foreground">
                Provider profiles will appear here when the API returns active
                kitchens.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}

function FoodNestPromiseSection() {
  return (
    <Section
      eyebrow="FoodNest promise"
      title="A reliable ordering surface for customers and teams"
      description="These platform signals help customers make decisions and help operators keep the experience consistent."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promiseItems.map((item) => (
          <div key={item.title} className="rounded-lg border bg-card p-5">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </div>
            <p className="mt-4 font-semibold">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Section({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
