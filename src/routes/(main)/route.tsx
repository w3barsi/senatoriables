import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import ThemeToggle from "~/lib/components/ThemeToggle";

export const Route = createFileRoute("/(main)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="container p-4">
        <header className="bg-emphasize flex h-14 items-center justify-between rounded-full border pr-3 pl-6 shadow-xs inset-shadow-sm">
          <h1 className="font-bold">Senatoriables</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user?.image ? (
              <img src={user?.image} className="h-9 rounded-full" />
            ) : (
              <div></div>
            )}
          </div>
        </header>
      </div>
      <Outlet />
    </div>
  );
}
