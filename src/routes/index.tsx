import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/arpan/public";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'ARPAN — Technology as Seva' },
    { name: "description", content: 'Offer yourself. Grow by serving. A reciprocal community to give, ask and serve with dignity.' },
    { property: "og:title", content: 'ARPAN — Technology as Seva' },
    { property: "og:description", content: 'Offer yourself. Grow by serving. A reciprocal community to give, ask and serve with dignity.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Landing {...{}} />,
});
