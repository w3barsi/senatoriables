import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/vote/$senatorName")({
  component: RouteComponent,
});

function RouteComponent() {
  const { senatorName } = Route.useParams();
  return <div className="h-[2000px]">{senatorName}</div>;
}
