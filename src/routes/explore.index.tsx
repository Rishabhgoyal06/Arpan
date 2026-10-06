import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/explore/")({
  head: () => ({ meta: [
    { title: 'Explore the community — ARPAN' },
    { name: "description", content: 'Discover seva, needs, offers and institutions with dignity and care.' },
    { property: "og:title", content: 'Explore the community — ARPAN' },
    { property: "og:description", content: 'Discover seva, needs, offers and institutions with dignity and care.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{}} />,
});
