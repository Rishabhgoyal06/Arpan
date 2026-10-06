import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    ["/explore", "/explore/"],
    ["/explore/needs", "/explore/needs"],
    ["/offer/create", "/offer/create"],
    ["/ask/create", "/ask/create"],
    ["/seva/seva-1", "/seva/$id"],
    ["/institutions/institutions-1", "/institutions/$id"],
    ["/support/institutions-1", "/support/$id"],
    ["/chats/kitchen", "/chats/$id"],
    ["/journey/reflection/seva-2", "/journey/reflection/$id"],
    ["/admin/needs", "/admin/needs"],
  ])("matches %s to its content leaf", (path, expected) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(path).at(-1)?.routeId).toBe(expected);
  });
});
