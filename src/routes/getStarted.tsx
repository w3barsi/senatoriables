import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/getStarted")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }

    throw redirect({ to: "/$me", params: { me: context.user.shortId } });

    // `context.queryClient` is also available in our loaders
    // https://tanstack.com/start/latest/docs/framework/react/examples/start-basic-react-query
    // https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
  },
});

function RouteComponent() {
  return <div>Hello "/me"!</div>;
}
