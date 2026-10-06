import { createFileRoute } from "@tanstack/react-router";
import { CreationFlow } from "@/components/arpan/flows";

export const Route = createFileRoute("/offer/create")({
  head: () => ({ meta: [
    { title: 'Create an Offer — ARPAN' },
    { name: "description", content: 'A guided way to share what you have, with privacy and care.' },
    { property: "og:title", content: 'Create an Offer — ARPAN' },
    { property: "og:description", content: 'A guided way to share what you have, with privacy and care.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CreationFlow {...{ type: 'offer' }} />,
});
