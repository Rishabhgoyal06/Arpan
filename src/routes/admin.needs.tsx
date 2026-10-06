import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/arpan/admin";

export const Route = createFileRoute("/admin/needs")({
  head: () => ({ meta: [
    { title: 'Need verification — ARPAN Community Moderation' },
    { name: "description", content: 'Community review, privacy and safety moderation workspace.' },
    { property: "og:title", content: 'Need verification — ARPAN Community Moderation' },
    { property: "og:description", content: 'Community review, privacy and safety moderation workspace.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AdminPage {...{ section: 'Need verification' }} />,
});
