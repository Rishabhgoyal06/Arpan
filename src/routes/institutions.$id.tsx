import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/arpan/flows";

export const Route = createFileRoute("/institutions/$id")({
  head: () => ({ meta: [
    { title: 'Community profile — ARPAN' },
    { name: "description", content: 'Read a fictional demo community story and find ways to stand alongside.' },
    { property: "og:title", content: 'Community profile — ARPAN' },
    { property: "og:description", content: 'Read a fictional demo community story and find ways to stand alongside.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DetailPage {...{ kind: 'institutions' }} />,
});
