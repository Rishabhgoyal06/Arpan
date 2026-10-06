import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/institutions/")({
  head: () => ({ meta: [
    { title: 'Community partners — ARPAN' },
    { name: "description", content: 'Meet fictional demo institutions and offer time, skills or resources.' },
    { property: "og:title", content: 'Community partners — ARPAN' },
    { property: "og:description", content: 'Meet fictional demo institutions and offer time, skills or resources.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'institutions', dedicated: true }} />,
});
