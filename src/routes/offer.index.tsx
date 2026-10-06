import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/offer/")({
  head: () => ({ meta: [
    { title: 'Offer what you can — ARPAN' },
    { name: "description", content: 'Everyone has something to offer. Share your skills, resources or time.' },
    { property: "og:title", content: 'Offer what you can — ARPAN' },
    { property: "og:description", content: 'Everyone has something to offer. Share your skills, resources or time.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'offers', dedicated: true }} />,
});
