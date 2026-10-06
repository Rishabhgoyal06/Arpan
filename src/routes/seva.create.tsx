import { createFileRoute } from "@tanstack/react-router";
import { CreationFlow } from "@/components/arpan/flows";

export const Route = createFileRoute("/seva/create")({
  head: () => ({ meta: [
    { title: 'Host a Seva — ARPAN' },
    { name: "description", content: 'Bring people together with a human story, safety and a shared intention.' },
    { property: "og:title", content: 'Host a Seva — ARPAN' },
    { property: "og:description", content: 'Bring people together with a human story, safety and a shared intention.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <CreationFlow {...{ type: 'seva' }} />,
});
