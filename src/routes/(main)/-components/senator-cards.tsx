import { ExternalLink, ExternalLinkIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/lib/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { Badge } from "~/lib/components/ui/badge";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { Senator } from "~/types/senators";

export function SenatorCard({ sen }: { sen: Senator }) {
  return (
    <Card className="hidden w-full overflow-hidden p-4 lg:inline">
      <CardContent className="flex p-0">
        <div className="flex items-center gap-4">
          <Avatar className="size-48 border">
            <AvatarImage src={sen.image} alt={`Photo of ${sen.name}`} />
            <AvatarFallback>
              {sen.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
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

export function SenatorCardAccordion({ sen }: { sen: Senator }) {
  return (
    <Card className="w-full overflow-hidden p-0 lg:hidden">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="flex flex-col items-center py-4 hover:no-underline">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="size-32 border">
                  <AvatarImage src={sen.image} alt={`Photo of ${sen.name}`} />
                  <AvatarFallback>
                    {sen.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-center text-2xl font-bold">{sen.name}</h2>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-6 pb-2">
              <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {sen.party && (
                    <Badge variant="outline" className="text-sm">
                      {sen.party}
                    </Badge>
                  )}
                  {sen.coalition && (
                    <Badge variant="secondary" className="text-sm">
                      {sen.coalition}
                    </Badge>
                  )}
                </div>

                {sen.notablePosition && (
                  <div className="text-center">
                    <h3 className="mb-1 text-sm font-medium">Notable Position</h3>
                    <p className="">{sen.notablePosition}</p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {sen.wikipediaProfile && (
                    <a
                      href={sen.wikipediaProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink size={14} className="mr-2" />
                        Wikipedia
                      </Button>
                    </a>
                  )}

                  {sen.rapplerProfile && (
                    <a
                      href={sen.rapplerProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 bg-red-50 hover:bg-red-100"
                      >
                        <ExternalLink size={14} className="mr-2" />
                        Rappler
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
