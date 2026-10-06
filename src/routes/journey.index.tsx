import { createFileRoute } from "@tanstack/react-router";
import { JourneyPage } from "@/components/arpan/personal";

export const Route = createFileRoute("/journey/")({
  head: () => ({ meta: [
    { title: 'Your Seva Journey — ARPAN' },
    { name: "description", content: 'Sankalp, seva, reflection, and offer and release. No points or comparisons.' },
    { property: "og:title", content: 'Your Seva Journey — ARPAN' },
    { property: "og:description", content: 'Sankalp, seva, reflection, and offer and release. No points or comparisons.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <JourneyPage {...{}} />,
});
