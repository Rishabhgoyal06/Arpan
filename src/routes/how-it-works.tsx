import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/arpan/public";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [
    { title: 'How it works — ARPAN' },
    { name: "description", content: 'Offer, ask, serve or support. Find your way into the ARPAN community.' },
    { property: "og:title", content: 'How it works — ARPAN' },
    { property: "og:description", content: 'Offer, ask, serve or support. Find your way into the ARPAN community.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AboutPage {...{ mode: 'how' }} />,
});
