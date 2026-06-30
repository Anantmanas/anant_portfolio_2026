import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { GrainOverlay } from "../components/GrainOverlay";
import { SmoothCursor } from "../components/ui/smooth-cursor";
import { DynamicIsland } from "../components/ui/dynamic-island";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Creative Developer Portfolio" },
      { name: "description", content: "Portfolio of a creative developer crafting tailor-made web experiences." },
      { property: "og:title", content: "Creative Developer Portfolio" },
      { property: "og:description", content: "Portfolio of a creative developer crafting tailor-made web experiences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/" || pathname === "";
  const isWork = pathname.startsWith("/work");

  const homeSections = [
    { id: "top",        label: "Intro" },
    { id: "manifesto",  label: "Manifesto" },
    { id: "info",       label: "About" },
    { id: "work",       label: "Work" },
    { id: "skills",     label: "Skills" },
    { id: "awards",     label: "Awards" },
    { id: "experience", label: "Experience" },
    { id: "contact",    label: "Contact" },
  ];
  const workSections = [
    { id: "projects", label: "Projects" },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <GrainOverlay />
        <DynamicIsland
          position="bottom-center"
          defaultSectionLabel={isHome ? "Intro" : isWork ? "Projects" : "Page"}
          storageKey="portfolio-island"
          lightBg="rgba(15,15,15,0.7)"
          darkBg="#0a0a0a"
          sections={isWork ? workSections : homeSections}
          fonts={[
            { name: "Inter",  value: "Inter, sans-serif" },
            { name: "Serif",  value: "'Instrument Serif', serif" },
            { name: "Mono",   value: "'JetBrains Mono', monospace" },
          ]}
          themes={[
            { name: "Crimson", color: "#cb0c11", color2: "#6f0000" },
            { name: "Midnight", color: "#0f172a", color2: "#1e293b" },
            { name: "Emerald",  color: "#10b981", color2: "#34d399" },
            { name: "Violet",   color: "#8b5cf6", color2: "#a78bfa" },
            { name: "Sunset",   color: "#f97316", color2: "#fb923c" },
          ]}
          showThemeToggle
          toggleAnimationType="diag-down-right"
          toggleDuration={500}
        />
        <SmoothCursor
          size={18}
          showTrail
          trailLength={5}
          rotateOnMove
          scaleOnClick
          glowEffect
          hideOnLeave={false}
          darkColor="#ffffff"
          lightColor="#0a0a0a"
          springConfig={{ damping: 45, stiffness: 400, mass: 1, restDelta: 0.001 }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
