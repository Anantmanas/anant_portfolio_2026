import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const lovableConfig = defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Pass the experimental mapping directly to the underlying TanStack Router configuration
    experimental: {
      v100ModuleNameMapping: true,
    }
  },
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              codeSplitting: {
                groups: [
                  {
                    name: "vendor",
                    test: /node_modules/,
                    maxSize: 250 * 1024,
                  },
                ],
              },
            },
          },
        },
      },
    },
  }
});

export default async (env) => {
  const config = await lovableConfig(env);
  return {
    ...config,
    plugins: config.plugins?.filter(
      (plugin) => !(typeof plugin === "object" && plugin && "name" in plugin && plugin.name === "vite-tsconfig-paths"),
    ),
  };
};
