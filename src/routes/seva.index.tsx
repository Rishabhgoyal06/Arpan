import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/seva/")({
  head: () => ({ meta: [
    { title: 'Find Seva — ARPAN' },
    { name: "description", content: 'Discover organised participation, from teaching to community kitchens.' },
    { property: "og:title", content: 'Find Seva — ARPAN' },
    { property: "og:description", content: 'Discover organised participation, from teaching to community kitchens.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'seva', dedicated: true }} />,
});
