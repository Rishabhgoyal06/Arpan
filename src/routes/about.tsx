import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/arpan/public";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: 'About ARPAN — A place for all of us' },
    { name: "description", content: 'Learn about ARPAN, a community rooted in dignity, reciprocity, privacy and seva.' },
    { property: "og:title", content: 'About ARPAN — A place for all of us' },
    { property: "og:description", content: 'Learn about ARPAN, a community rooted in dignity, reciprocity, privacy and seva.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AboutPage {...{}} />,
});
