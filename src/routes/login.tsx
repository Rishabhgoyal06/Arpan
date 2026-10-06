import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/arpan/public";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: 'Welcome back — ARPAN' },
    { name: "description", content: 'Sign in to your ARPAN community account.' },
    { property: "og:title", content: 'Welcome back — ARPAN' },
    { property: "og:description", content: 'Sign in to your ARPAN community account.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage {...{}} />,
});
