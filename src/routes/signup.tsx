import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/arpan/public";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [
    { title: 'Begin your journey — ARPAN' },
    { name: "description", content: 'Join the ARPAN community. Offer, ask, serve, and support with dignity.' },
    { property: "og:title", content: 'Begin your journey — ARPAN' },
    { property: "og:description", content: 'Join the ARPAN community. Offer, ask, serve, and support with dignity.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage {...{ signup: true }} />,
});
