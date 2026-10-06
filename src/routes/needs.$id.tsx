import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/arpan/flows";

export const Route = createFileRoute("/needs/$id")({
  head: () => ({ meta: [
    { title: 'A community request — ARPAN' },
    { name: "description", content: 'Meet a privacy-safe need and offer what feels possible.' },
    { property: "og:title", content: 'A community request — ARPAN' },
    { property: "og:description", content: 'Meet a privacy-safe need and offer what feels possible.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DetailPage {...{ kind: 'needs' }} />,
});
