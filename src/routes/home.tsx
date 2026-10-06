import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/arpan/discovery";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [
    { title: 'Your community — ARPAN' },
    { name: "description", content: 'Choose what feels possible today: offer, ask, serve or support a community.' },
    { property: "og:title", content: 'Your community — ARPAN' },
    { property: "og:description", content: 'Choose what feels possible today: offer, ask, serve or support a community.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HomePage {...{}} />,
});
