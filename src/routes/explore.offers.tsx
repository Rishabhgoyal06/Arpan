import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/explore/offers")({
  head: () => ({ meta: [
    { title: 'Explore Offers — ARPAN' },
    { name: "description", content: 'Connect over shared time, skills, knowledge and resources.' },
    { property: "og:title", content: 'Explore Offers — ARPAN' },
    { property: "og:description", content: 'Connect over shared time, skills, knowledge and resources.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'offers' }} />,
});
