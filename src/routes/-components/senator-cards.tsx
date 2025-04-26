import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { Badge } from "~/lib/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LinkCard,
} from "~/lib/components/ui/card";
import { Senator } from "~/types/senators";

export function SenatorCard({ sen }: { sen: Senator }) {
  return (
    <LinkCard
      linkOptions={{
        to: "/vote/$senatorLinkName",
        params: {
          senatorLinkName: sen.linkName,
        },
      }}
      className="row-span-2 grid grid-rows-subgrid gap-3 py-4 transition-colors hover:border hover:border-neutral-500/50"
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

export function OldSenatorCard({ sen }: { sen: Senator }) {
  return (
    <Link
      to="/vote/$senatorLinkName"
      params={{ senatorLinkName: sen.linkName }}
      className="group relative h-48 transition-[z-index] transition-discrete hover:z-1000"
    >
      <div className="flex h-48 w-full items-end justify-center rounded-2xl bg-black p-2 text-white transition-[height,scale] group-hover:top-20 group-hover:h-58 group-hover:scale-105 group-hover:rounded-b-xl">
        Click to set vote!
      </div>
      <Card className="absolute top-0 z-20 h-48 w-full gap-3 transition-transform group-group-hover:z-1000 group-hover:scale-104 group-hover:shadow-lg">
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
                {sen.coalition ? (
                  <Badge variant="secondary">{sen.coalition}</Badge>
                ) : null}
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
      </Card>
    </Link>
  );
}

export function InstructionCard() {
  return (
    <Card className="row-span-2 h-48 w-full gap-3 border-2 border-dashed border-black/50 transition-transform group-group-hover:z-1000 group-hover:scale-104 group-hover:shadow-lg dark:border-white/50">
      <CardContent className="flex h-full items-center justify-center">
        <h1 className="text-xl font-bold">Click on a card to cast a vote!</h1>
      </CardContent>
    </Card>
  );
}
