import { ExternalLinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { Senator } from "~/types/senators";

export function MeSenatorCard({ sen }: { sen: Senator }) {
  return (
    <Card className="hidden w-full overflow-hidden p-4 lg:inline">
      <CardContent className="flex p-0">
        <div className="relative flex items-center gap-4">
          <Avatar className="size-48 border">
            <AvatarImage src={sen.image} alt={`Photo of ${sen.name}`} />
            <AvatarFallback>
              {sen.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="bg-background absolute right-0 bottom-0 flex size-12 items-center justify-center rounded-full border border-neutral-800 p-1 font-bold">
            {sen.id}
          </span>
        </div>

        <div className="flex h-full w-full flex-col px-6 lg:flex-row lg:items-center">
          <div className="w-full">
            <h1 className="mb-2 text-3xl font-bold">{sen.name}</h1>

            <div className="mb-4 flex flex-wrap gap-2">
              {sen.party && <Badge variant="outline">{sen.party}</Badge>}
              {sen.coalition && <Badge variant="secondary">{sen.coalition}</Badge>}
            </div>

            {sen.notablePosition && (
              <div className="mb-4">
                <h2 className="mb-1 text-lg font-semibold">Notable Position</h2>
                <p>{sen.notablePosition}</p>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-2 lg:flex-col">
            {sen.wikipediaProfile && (
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={sen.wikipediaProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLinkIcon size={16} className="mr-2" />
                  Wikipedia Profile
                </a>
              </Button>
            )}

            {sen.rapplerProfile && (
              <Button
                variant="outline"
                className="w-full border-red-200 bg-red-50 hover:bg-red-100/70"
                asChild
              >
                <a
                  href={sen.rapplerProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLinkIcon size={16} className="mr-2" />
                  Rappler Profile
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
