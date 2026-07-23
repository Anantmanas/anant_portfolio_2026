import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },

    // Pass the experimental mapping directly to the underlying TanStack Router configuration
    experimental: {
      v100ModuleNameMapping: true
    }
  },
  vite: {
    resolve: {
      // Cleans up the native path warning shown in your terminal logs
      tsconfigPaths: true
    }
  }
});
