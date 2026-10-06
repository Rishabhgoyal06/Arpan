import { createFileRoute } from "@tanstack/react-router";
import { CreationFlow } from "@/components/arpan/flows";

export const Route = createFileRoute("/ask/create")({
  head: () => ({ meta: [
    { title: 'Create a Need — ARPAN' },
    { name: "description", content: 'A respectful request journey with privacy choices and consent.' },
    { property: "og:title", content: 'Create a Need — ARPAN' },
    { property: "og:description", content: 'A respectful request journey with privacy choices and consent.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CreationFlow {...{ type: 'ask' }} />,
});
