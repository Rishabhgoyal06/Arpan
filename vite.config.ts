// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { handleRegistration } from "./src/server/auth";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "dev-auth-api",
        configureServer(server) {
          server.middlewares.use("/api/auth/register", async (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end("Method Not Allowed");
              return;
            }
            let rawBody = "";
            req.on("data", (chunk) => {
              rawBody += chunk;
            });
            req.on("end", async () => {
              try {
                const payload = JSON.parse(rawBody || "{}");
                const result = await handleRegistration(payload);
                res.statusCode = result.error ? ((result as any).status ?? 400) : 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(result));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: err?.message || "Server error" }));
              }
            });
          });
        },
      },
    ],
  },
});
