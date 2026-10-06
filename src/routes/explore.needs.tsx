import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/explore/needs")({
  head: () => ({ meta: [
    { title: 'Explore Needs — ARPAN' },
    { name: "description", content: 'Privacy-safe demo requests, shared in each person’s own words.' },
    { property: "og:title", content: 'Explore Needs — ARPAN' },
    { property: "og:description", content: 'Privacy-safe demo requests, shared in each person’s own words.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'needs' }} />,
});
