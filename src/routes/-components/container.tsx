import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Container(props: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(["container m-auto flex w-full justify-center", props.className])}>
      {props.children}
    </div>
  );
}
