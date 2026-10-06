import { createFileRoute } from "@tanstack/react-router";
import { CreationFlow } from "@/components/arpan/flows";

export const Route = createFileRoute("/support/$id")({
  head: () => ({ meta: [
    { title: 'Support a Community — ARPAN' },
    { name: "description", content: 'Explore non-financial and demo financial support, with anonymity choices.' },
    { property: "og:title", content: 'Support a Community — ARPAN' },
    { property: "og:description", content: 'Explore non-financial and demo financial support, with anonymity choices.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CreationFlow {...{ type: 'support' }} />,
});
