import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/features/users/components/profile-form";
import { formatDateTime } from "@/lib/foodnest-data";
import { usersService } from "@/services/user.service";

export default async function Page() {
  const { data, error } = await usersService.getMe();

  if (error || !data) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-destructive">Failed to load profile</p>
            <p className="text-muted-foreground">{error?.message}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-primary">Dashboard profile</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review access details and update your visible account information.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Summary title="Role" value={data.role} badge />
            <Summary title="Status" value={data.status} badge />
            <Summary
              title="Email Verified"
              value={data.emailVerified ? "Yes" : "No"}
              badge
            />
          </div>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-base">Account details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Detail label="Email" value={data.email} />
              <Detail label="Created" value={formatDateTime(data.createdAt)} />
              <Detail label="Updated" value={formatDateTime(data.updatedAt)} />
              <Detail label="User ID" value={data.id} mono />
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">Edit profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultValues={{
                name: data.name,
                phone: data.phone ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Summary({
  title,
  value,
  badge,
}: {
  title: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badge ? (
          <Badge variant="outline">{value}</Badge>
        ) : (
          <p className="text-xl font-semibold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-muted-foreground">{label}</p>
      <p className={mono ? "mt-1 break-all font-mono text-xs" : "mt-1 font-medium"}>
        {value}
      </p>
    </div>
  );
}
