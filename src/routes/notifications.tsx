import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/arpan/personal";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [
    { title: 'Gentle updates — ARPAN' },
    { name: "description", content: 'Calm updates from your community, offers and seva.' },
    { property: "og:title", content: 'Gentle updates — ARPAN' },
    { property: "og:description", content: 'Calm updates from your community, offers and seva.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <NotificationsPage {...{}} />,
});
