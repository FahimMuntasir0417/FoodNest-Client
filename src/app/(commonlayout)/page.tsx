import { Help1 } from "@/components/help1";
import { HeroFood } from "@/components/ui/hero-food";
import { HowItWorks } from "@/components/ui/how-it-works";
import { MealsCarousel } from "@/components/ui/meals-carousel";
import { mealsService } from "@/services";
import { DiscountTimerSection } from "./../../components/ui/discountSection";

export default async function Page() {
  const { data, error } = await mealsService.getAll();

  // ...your error/empty handling

  const meals = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.items)
      ? (data as any).items
      : Array.isArray((data as any)?.data)
        ? (data as any).data
        : [];

  return (
    <div>
      <HeroFood />
      <DiscountTimerSection testHours={50} />
      <MealsCarousel meals={meals} />
      <Help1 />
      <HowItWorks />
    </div>
  );
}
