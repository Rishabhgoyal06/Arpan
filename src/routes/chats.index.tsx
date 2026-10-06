import { createFileRoute } from "@tanstack/react-router";
import { ChatsPage } from "@/components/arpan/personal";

export const Route = createFileRoute("/chats/")({
  head: () => ({ meta: [
    { title: 'Conversations with care — ARPAN' },
    { name: "description", content: 'Community conversations with privacy and safety controls.' },
    { property: "og:title", content: 'Conversations with care — ARPAN' },
    { property: "og:description", content: 'Community conversations with privacy and safety controls.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <ChatsPage {...{}} />,
});
