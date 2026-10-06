import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/arpan/personal";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: 'Your space — ARPAN' },
    { name: "description", content: 'A person, not a role. Manage your demo profile and privacy choices.' },
    { property: "og:title", content: 'Your space — ARPAN' },
    { property: "og:description", content: 'A person, not a role. Manage your demo profile and privacy choices.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <ProfilePage {...{}} />,
});
