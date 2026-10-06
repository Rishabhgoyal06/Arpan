import { createFileRoute } from "@tanstack/react-router";
import { ChatsPage } from "@/components/arpan/personal";

export const Route = createFileRoute("/chats/$id")({
  head: () => ({ meta: [
    { title: 'Community conversation — ARPAN' },
    { name: "description", content: 'Connect privately within a demo seva or institution community chat.' },
    { property: "og:title", content: 'Community conversation — ARPAN' },
    { property: "og:description", content: 'Connect privately within a demo seva or institution community chat.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <ChatsPage {...{}} />,
});
