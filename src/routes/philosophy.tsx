import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/arpan/public";

export const Route = createFileRoute("/philosophy")({
  head: () => ({ meta: [
    { title: 'Our philosophy — ARPAN' },
    { name: "description", content: 'Service as a practice of humility, presence and connection, without hierarchy or recognition.' },
    { property: "og:title", content: 'Our philosophy — ARPAN' },
    { property: "og:description", content: 'Service as a practice of humility, presence and connection, without hierarchy or recognition.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AboutPage {...{ mode: 'philosophy' }} />,
});
