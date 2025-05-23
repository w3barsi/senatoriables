import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { SENATOR_LIST } from "~/lib/senators-list";
import { Container } from "../-components/container";
import { InstructionCard, SenatorCard } from "../-components/senator-cards";

export const Route = createFileRoute("/(main)/senators")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSenators = SENATOR_LIST.filter(
    (senator) =>
      senator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      senator.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
      senator.coalition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      senator.notablePosition.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <Container className="pt-2">
      <div className="flex w-full flex-col justify-center">
        <div className="flex justify-end gap-2 pb-4">
          <Label className="text-nowrap" htmlFor="search">
            Search Senators
          </Label>
          <Input
            id="search"
            className="max-w-xl"
            placeholder="Search senators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          <InstructionCard />
          {filteredSenators.map((sen) => (
            <SenatorCard key={sen.id} sen={sen} me={user.shortId} />
          ))}
        </div>
      </div>
    </Container>
  );
}
