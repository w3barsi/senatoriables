import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/$me")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
