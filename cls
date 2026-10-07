[1mdiff --git a/vite.config.ts b/vite.config.ts[m
[1mindex 7ae5b97..75bf44b 100644[m
[1m--- a/vite.config.ts[m
[1m+++ b/vite.config.ts[m
[36m@@ -1,6 +1,6 @@[m
 import { defineConfig } from "@lovable.dev/vite-tanstack-config";[m
 [m
[31m-export default defineConfig({[m
[32m+[m[32mconst lovableConfig = defineConfig({[m
   tanstackStart: {[m
     // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).[m
     // nitro/vite builds from this[m
[36m@@ -14,20 +14,15 @@[m [mexport default defineConfig({[m
     resolve: {[m
       tsconfigPaths: true,[m
     },[m
[31m-    build: {[m
[31m-      rolldownOptions: {[m
[31m-        output: {[m
[31m-          codeSplitting: {[m
[31m-            groups: [[m
[31m-              {[m
[31m-                name: "vendor",[m
[31m-                test: /node_modules/,[m
[31m-                maxSize: 250 * 1024,[m
[31m-              },[m
[31m-            ],[m
[31m-          },[m
[31m-        },[m
[31m-      },[m
[31m-    },[m
   }[m
 });[m
[32m+[m
[32m+[m[32mexport default async (env) => {[m
[32m+[m[32m  const config = await lovableConfig(env);[m
[32m+[m[32m  return {[m
[32m+[m[32m    ...config,[m
[32m+[m[32m    plugins: config.plugins?.filter([m
[32m+[m[32m      (plugin) => !(typeof plugin === "object" && plugin && "name" in plugin && plugin.name === "vite-tsconfig-paths"),[m
[32m+[m[32m    ),[m
[32m+[m[32m  };[m
[32m+[m[32m};[m
