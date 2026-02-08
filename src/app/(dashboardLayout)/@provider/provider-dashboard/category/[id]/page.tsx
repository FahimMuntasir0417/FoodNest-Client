import { CreateMealFormClient } from "@/lib/components/postModule/CreateMealFormClient";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <CreateMealFormClient categoryId={id} />;
}
