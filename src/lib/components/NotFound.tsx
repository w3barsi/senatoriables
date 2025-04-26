import { Link } from "@tanstack/react-router";
import { Container } from "~/routes/-components/container";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <Container>
      <div className="space-y-1 p-2">
        <p>The page you are looking for does not exist.</p>
        <p className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={() => window.history.back()}>
            Go back
          </Button>
          <Button asChild variant="secondary">
            <Link to="/">Home</Link>
          </Button>
        </p>
      </div>
    </Container>
  );
}
