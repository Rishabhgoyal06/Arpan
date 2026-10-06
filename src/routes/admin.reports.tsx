import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/arpan/admin";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [
    { title: 'Reports — ARPAN Community Moderation' },
    { name: "description", content: 'Community review, privacy and safety moderation workspace.' },
    { property: "og:title", content: 'Reports — ARPAN Community Moderation' },
    { property: "og:description", content: 'Community review, privacy and safety moderation workspace.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AdminPage {...{ section: 'Reports' }} />,
});
