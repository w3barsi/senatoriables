import { createFileRoute } from "@tanstack/react-router";
import { SENATOR_LIST } from "~/lib/senators-list";
import { SenatorCard } from "./-components/senator-cards";

export const Route = createFileRoute("/sandbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h- flex w-full items-center justify-center px-6 py-4">
      <div className="container grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {SENATOR_LIST.map((sen) => (
          <SenatorCard key={sen.id} sen={sen} />
        ))}
      </div>
    </div>
  );
}
