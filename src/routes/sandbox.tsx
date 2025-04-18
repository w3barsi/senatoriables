import { createFileRoute, redirect } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { Badge } from "~/lib/components/ui/badge";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkCard,
} from "~/lib/components/ui/card";
import { SENATOR_LIST } from "~/lib/senators-list";
import { Senator } from "~/types/senators";
import { OldSenatorCard } from "./-components/senator-cards";

export const Route = createFileRoute("/sandbox")({
  component: RouteComponent,
  beforeLoad: () => {
    if (import.meta.env.MODE !== "development") {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex w-full items-center justify-center px-6 py-4">
      <div className="container grid grid-cols-3 gap-2">
        {SENATOR_LIST.map((sen) => (
          <OldSenatorCard key={sen.id} sen={sen} />
        ))}
      </div>
    </div>
  );
}

export function SenatorCard({ sen }: { sen: Senator }) {
  return (
    <LinkCard
      linkOptions={{ to: "/" }}
      className="relative row-span-2 grid grid-rows-subgrid gap-3 py-4 transition-colors hover:border hover:border-black"
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={sen.image} alt={`Photo of ${sen.name}`} />
            <AvatarFallback>
              {sen.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{sen.name}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {sen.party ? <Badge variant="outline">{sen.party}</Badge> : null}
              {sen.coalition ? <Badge variant="secondary">{sen.coalition}</Badge> : null}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">
          <span className="font-medium">Notable Position:</span>{" "}
          {sen.notablePosition ? sen.notablePosition : "N/A"}
        </CardDescription>
      </CardContent>
    </LinkCard>
  );
}
