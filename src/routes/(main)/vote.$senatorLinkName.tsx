import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useBreakpoint } from "~/hooks/use-media-query";
import { NotFound } from "~/lib/components/NotFound";
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
import { SENATOR_LIST } from "~/lib/senators-list";
import { Senator } from "~/types/senators";
import { VoteOptions } from "~/types/ui";
import { Container } from "../-components/container";
import { VoteButtons } from "../-components/vote-buttons";

type ReasonType = "positive" | "negative" | "uncertain";
type Reason = {
  id: string;
  text: string;
  source: string;
  type: ReasonType;
};

export const Route = createFileRoute("/(main)/vote/$senatorLinkName")({
  component: RouteComponent,
});

function RouteComponent() {
  const { senatorLinkName } = Route.useParams();
  const breakpoint = useBreakpoint("md");
  const sen = SENATOR_LIST.find((s) => s.linkName === senatorLinkName);

  if (!sen) {
    return <NotFound />;
  }

  return (
    <Container className="flex flex-col gap-4 pt-4">
      {breakpoint ? <SenatorCard sen={sen} /> : <SenatorCardAccordion sen={sen} />}
      <VoteCard sen={sen} />
    </Container>
  );
}

function VoteCard({ sen }: { sen: Senator }) {
  const [vote, setVote] = useState<VoteOptions>(null);
  useEffect(() => {
    console.log(vote);
  }, [vote]);

  return (
    <div className="">
      <Card className="w-full">
        <CardContent className="">
          <h3 className="mb-6 text-center text-xl font-medium">How would you vote?</h3>
          <VoteButtons vote={vote} setVote={setVote} />
        </CardContent>
      </Card>
    </div>
  );
}

function SenatorCard({ sen }: { sen: Senator }) {
  return (
    <Card className="w-full overflow-hidden p-4">
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

function SenatorCardAccordion({ sen }: { sen: Senator }) {
  return (
    <Card className="w-full overflow-hidden p-0">
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

// <div>
//   <Avatar className="size-32 border">
//     <AvatarImage src={sen.image} alt={`Photo of ${sen.name}`} />
//     <AvatarFallback>
//       {sen.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")}
//     </AvatarFallback>
//   </Avatar>
// </div>
// <div>
//   <h1 className="text-3xl font-bold">{sen.name}</h1>
//
//   <div className="mb-4 flex flex-wrap gap-2">
//     {sen.party && <Badge variant="outline">{sen.party}</Badge>}
//     {sen.coalition && <Badge variant="secondary">{sen.coalition}</Badge>}
//   </div>
// </div>
