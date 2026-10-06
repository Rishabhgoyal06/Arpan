import { createFileRoute } from "@tanstack/react-router";
import { DetailPage } from "@/components/arpan/flows";

export const Route = createFileRoute("/seva/$id")({
  head: () => ({ meta: [
    { title: 'Seva opportunity — ARPAN' },
    { name: "description", content: 'Understand why this seva matters, take Sankalp and participate with care.' },
    { property: "og:title", content: 'Seva opportunity — ARPAN' },
    { property: "og:description", content: 'Understand why this seva matters, take Sankalp and participate with care.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DetailPage {...{ kind: 'seva' }} />,
});
