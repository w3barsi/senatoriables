import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function Container(props: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("container m-auto flex justify-center px-2 xl:px-0", props.className)}
    >
      {props.children}
    </div>
  );
}
