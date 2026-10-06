import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/arpan/admin";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [
    { title: 'Users — ARPAN Demo Moderation' },
    { name: "description", content: 'Frontend-only community review, privacy and safety moderation. No production verification.' },
    { property: "og:title", content: 'Users — ARPAN Demo Moderation' },
    { property: "og:description", content: 'Frontend-only community review, privacy and safety moderation. No production verification.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AdminPage {...{ section: 'Users' }} />,
});
