import { createFileRoute } from "@tanstack/react-router";
import { ManifoldApp } from "@/components/console/ManifoldApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ManifoldApp />;
}
