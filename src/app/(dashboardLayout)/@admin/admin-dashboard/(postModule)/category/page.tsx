import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoriesTable } from "@/lib/components/meal/categories-table";
import { categoryService } from "@/services";

export default async function Page() {
  const { data, error } = await categoryService.getAll();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-destructive">Failed to load categories</p>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = Array.isArray(data) ? data : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage categories and create meals under them.
        </p>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
}
