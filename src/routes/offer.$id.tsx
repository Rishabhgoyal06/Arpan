import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/arpan/flows";

export const Route = createFileRoute("/offer/$id")({
  head: () => ({ meta: [
    { title: 'A community Offer — ARPAN' },
    { name: "description", content: 'Connect over a thoughtful offer of time, knowledge, skills or resources.' },
    { property: "og:title", content: 'A community Offer — ARPAN' },
    { property: "og:description", content: 'Connect over a thoughtful offer of time, knowledge, skills or resources.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DetailPage {...{ kind: 'offers' }} />,
});
