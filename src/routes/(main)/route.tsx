import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import authClient from "~/lib/auth-client";
import ThemeToggle from "~/lib/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/(main)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
    return { user: context.user };
  },
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function Header() {
  const { queryClient } = Route.useRouteContext();
  const { user } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div
      className={cn(
        "sticky top-0 z-50 flex w-full justify-center px-2 transition-all",
        !scrolled && "bg-emphasize",
        scrolled && "from-background/70 to-background/10 bg-linear-to-b from-65% pt-4",
      )}
    >
      <header
        className={cn(
          "container flex h-14 w-full items-center justify-between",
          scrolled ? "bg-emphasize rounded-full border pr-4 pl-6" : "",
        )}
      >
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
  );
}
