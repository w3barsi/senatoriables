import { createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { Badge } from "~/lib/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { SENATORS_LIST } from "~/lib/senators-list";
import { Senators as Senator } from "~/types/senators";

export const Route = createFileRoute("/sandbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h- flex w-full items-center justify-center pt-4">
      <div className="container grid w-full grid-cols-3 gap-2">
        {SENATORS_LIST.map((sen) => (
          <SenatorCard sen={sen} />
        ))}
      </div>
    </div>
  );
}

function SenatorCard({ sen }: { sen: Senator }) {
  return (
    <div className="group relative h-48 hover:z-1000">
      <div className="flex h-48 w-full items-end justify-center rounded-2xl bg-black p-2 text-white transition-[height,scale] group-hover:top-20 group-hover:h-58 group-hover:scale-105 group-hover:rounded-b-xl">
        Click to set vote!
      </div>
      <Card
        key={sen.id}
        className="absolute top-0 z-20 h-48 w-full cursor-pointer gap-3 transition-transform group-group-hover:z-1000 group-hover:scale-104 group-hover:shadow-lg"
      >
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage
                src={`/placeholder.svg?height=64&width=64`}
                alt={`Photo of ${sen.name}`}
              />
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
                <Badge variant="outline">{sen.party}</Badge>
                <Badge variant="secondary">{sen.coalition}</Badge>
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
    </div>
  );
}
