import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/explore/seva")({
  head: () => ({ meta: [
    { title: 'Explore Seva — ARPAN' },
    { name: "description", content: 'Find a meaningful way to show up alongside others.' },
    { property: "og:title", content: 'Explore Seva — ARPAN' },
    { property: "og:description", content: 'Find a meaningful way to show up alongside others.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'seva' }} />,
});
