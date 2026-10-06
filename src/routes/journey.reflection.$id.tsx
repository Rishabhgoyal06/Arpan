import { createFileRoute } from "@tanstack/react-router";
import { ReflectionPage } from "@/components/arpan/personal";

export const Route = createFileRoute("/journey/reflection/$id")({
  head: () => ({ meta: [
    { title: 'A private reflection — ARPAN' },
    { name: "description", content: 'A quiet space to notice what stayed with you and let go of the result.' },
    { property: "og:title", content: 'A private reflection — ARPAN' },
    { property: "og:description", content: 'A quiet space to notice what stayed with you and let go of the result.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <ReflectionPage {...{}} />,
});
