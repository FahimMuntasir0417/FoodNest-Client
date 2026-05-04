import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ChartPoint = {
  label: string;
  value: number;
};

export function MetricCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function BarChart({
  title,
  points,
}: {
  title: string;
  points: ChartPoint[];
}) {
  const max = Math.max(1, ...points.map((point) => point.value));

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {points.map((point) => (
          <div key={point.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{point.label}</span>
              <span className="font-medium">{point.value}</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.max(4, (point.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function LineChart({
  title,
  points,
}: {
  title: string;
  points: ChartPoint[];
}) {
  const max = Math.max(1, ...points.map((point) => point.value));
  const chartPoints = points.map((point, index) => {
    const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
    const y = 100 - (point.value / max) * 86;
    return `${x},${Math.max(10, y)}`;
  });

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          viewBox="0 0 100 110"
          role="img"
          aria-label={title}
          className="h-44 w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <polyline
            points={chartPoints.join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary"
            vectorEffect="non-scaling-stroke"
          />
          {chartPoints.map((point, index) => {
            const [x, y] = point.split(",").map(Number);
            const titleText = `${points[index]?.label ?? "Point"}: ${
              points[index]?.value ?? 0
            }`;

            return (
              <circle
                key={point}
                cx={x}
                cy={y}
                r="2.5"
                className="fill-primary"
              >
                <title>{titleText}</title>
              </circle>
            );
          })}
        </svg>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          {points.slice(-3).map((point) => (
            <div key={point.label} className="rounded-md border p-2">
              <p className="truncate">{point.label}</p>
              <p className="mt-1 font-medium text-foreground">{point.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DonutChart({
  title,
  primary,
  secondary,
}: {
  title: string;
  primary: ChartPoint;
  secondary: ChartPoint;
}) {
  const total = Math.max(1, primary.value + secondary.value);
  const percent = Math.round((primary.value / total) * 100);

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-5">
        <div
          className="grid size-28 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--primary) ${percent}%, var(--muted) ${percent}% 100%)`,
          }}
        >
          <div className="grid size-16 place-items-center rounded-full bg-card text-lg font-semibold">
            {percent}%
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">{primary.label}:</span>{" "}
            {primary.value}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">{secondary.label}:</span>{" "}
            {secondary.value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
