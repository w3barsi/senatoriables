import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/$me")({
  component: RouteComponent,
});

function RouteComponent() {
  const { me } = Route.useParams();
  return <div>{me}</div>;
}
