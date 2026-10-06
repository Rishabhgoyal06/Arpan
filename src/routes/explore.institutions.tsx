import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/explore/institutions")({
  head: () => ({ meta: [
    { title: 'Explore Institutions — ARPAN' },
    { name: "description", content: 'Meet community partners and discover multiple ways to support.' },
    { property: "og:title", content: 'Explore Institutions — ARPAN' },
    { property: "og:description", content: 'Meet community partners and discover multiple ways to support.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'institutions' }} />,
});
