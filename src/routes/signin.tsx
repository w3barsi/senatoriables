import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, type ComponentProps } from "react";
import authClient from "~/lib/auth-client";
import { Button } from "~/lib/components/ui/button";
import { cn } from "~/lib/utils";
import { AUTH_SVG } from "~/utils/svg";

const REDIRECT_URL = "/me";

export const Route = createFileRoute("/signin")({
  component: AuthPage,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
  },
});

function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-card flex flex-col items-center gap-8 rounded-xl border p-10">
        <h1 className="text-xl font-bold">Senatioriables</h1>
        <div className="flex flex-col gap-2">
          <SignInButton provider="google" label="Google" className="" />
          <SignInButton provider="facebook" label="Facebook" className="" />
          <SignInButton provider="twitter" label="Twitter" className="" />
        </div>
      </div>
    </div>
  );
}

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: "google" | "facebook" | "twitter";
  label: string;
}

function SignInButton({ provider, label, className, ...props }: SignInButtonProps) {
  const [clicked, setClicked] = useState(false);
  const Logo = AUTH_SVG[provider];

  return (
    <Button
      onClick={() => {
        setClicked(true);
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        });
      }}
      disabled={clicked}
      type="button"
      size="lg"
      className={cn(
        "bg-background text-foreground cursor-pointer hover:bg-neutral-200 hover:text-black",
        className,
      )}
      {...props}
    >
      <div className="grid w-full grid-cols-5">
        <span className="col-span-1 flex items-center">
          <Logo />
        </span>
        <span className="col-span-4">Sign in with {label}</span>
      </div>
    </Button>
  );
}
