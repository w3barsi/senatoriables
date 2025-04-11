import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import authClient from "~/lib/auth-client";
import ThemeToggle from "~/lib/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";

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
  const { queryClient } = Route.useRouteContext();
  const { user } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:px-6 2xl:p-0">
      <div className="container pt-2 pb-4">
        <header className="bg-emphasize flex h-14 items-center justify-between rounded-full border pr-3 pl-6 shadow-xs inset-shadow-sm">
          <nav className="flex items-center gap-4">
            <Link to="/">
              <h1 className="font-bold">Senatoriables</h1>
            </Link>
            <Link
              to="/senators"
              className="px-1"
              activeProps={{
                className: "bg-black text-white dark:text-black dark:bg-white ",
              }}
            >
              Senators List
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/$me"
              params={{ me: user!.shortId }}
              className="px-1"
              activeProps={{
                className: "bg-black text-white dark:text-black dark:bg-white ",
              }}
            >
              My Votes
            </Link>

            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger>
                {user?.image ? (
                  <img src={user?.image} className="h-9 rounded-full" />
                ) : (
                  <div className="h-9 rounded-full"></div>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={async () => {
                    await authClient.signOut();
                    await queryClient.invalidateQueries({ queryKey: ["user"] });
                    navigate({ to: "/" });
                  }}
                >
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
