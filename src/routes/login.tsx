import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/arpan/public";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: 'Welcome back — ARPAN' },
    { name: "description", content: 'Enter the ARPAN demo community. No real authentication or accounts.' },
    { property: "og:title", content: 'Welcome back — ARPAN' },
    { property: "og:description", content: 'Enter the ARPAN demo community. No real authentication or accounts.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthPage {...{}} />,
});
