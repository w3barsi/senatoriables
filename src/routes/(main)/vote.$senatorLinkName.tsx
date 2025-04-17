import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/vote/$senatorLinkName")({
  component: RouteComponent,
});

function RouteComponent() {
  const { senatorLinkName } = Route.useParams();
  return <div className="h-[2000px]">{senatorLinkName}</div>;
}
