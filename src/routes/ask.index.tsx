import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/arpan/discovery";

export const Route = createFileRoute("/ask/")({
  head: () => ({ meta: [
    { title: 'Ask with dignity — ARPAN' },
    { name: "description", content: 'Needing support is part of being human. Share only what feels comfortable.' },
    { property: "og:title", content: 'Ask with dignity — ARPAN' },
    { property: "og:description", content: 'Needing support is part of being human. Share only what feels comfortable.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Discovery {...{ kind: 'needs', dedicated: true }} />,
});
