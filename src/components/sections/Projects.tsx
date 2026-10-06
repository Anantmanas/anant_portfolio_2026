import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/lib/projects";
// Project thumbnails are loaded with the section chunk so they don't ship
// with the LCP. Each tile <img> is lazy-decoded by the browser.
import interviewAiImg from "@/assets/project_thumbnails/InterviewAI.png";
import promptEnhanceImg from "@/assets/project_thumbnails/promptenhance.png";
import aiSaasImg from "@/assets/project_thumbnails/ai-saas.png";
import creativeAgencyImg from "@/assets/project_thumbnails/CreativeAgency.jpeg";

const PROJECT_IMAGES: Record<string, string> = {
  "InterviewAI.png": interviewAiImg,
  "promptenhance.png": promptEnhanceImg,
  "ai-saas.png": aiSaasImg,
  "CreativeAgency.jpeg": creativeAgencyImg,
};

export function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const pointerActive = useRef(false);

  useEffect(() => {
    let mounted = true;
    let onMove: ((e: MouseEvent) => void) | null = null;
    let onEnter: (() => void) | null = null;
    let onLeave: (() => void) | null = null;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !sectionRef.current) return;

      // Stagger tiles into view on scroll
      const tiles = sectionRef.current.querySelectorAll<HTMLElement>(".proj-tile");
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Cursor-follow preview. The rAF loop only runs while the pointer is
      // inside the section, and we skip frames that didn't change target
      // (e.g. when the user has stopped moving). This removes the "always-on
      // 60fps cursor chase" cost when nobody is interacting.
      const loop = () => {
        if (!pointerActive.current) {
          rafRef.current = 0;
          return;
        }
        current.current.x += (target.current.x - current.current.x) * 0.15;
        current.current.y += (target.current.y - current.current.y) * 0.15;
        if (previewRef.current) {
          previewRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      const startLoop = () => {
        if (rafRef.current === 0) rafRef.current = requestAnimationFrame(loop);
      };

      onMove = (e: MouseEvent) => {
        target.current.x = e.clientX + 40;
        target.current.y = e.clientY - 100;
      };
      onEnter = () => { pointerActive.current = true; startLoop(); };
      onLeave = () => { pointerActive.current = false; };

      const host = sectionRef.current!;
      host.addEventListener("mousemove", onMove);
      host.addEventListener("mouseenter", onEnter);
      host.addEventListener("mouseleave", onLeave);
    })();
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
      if (onMove && sectionRef.current) sectionRef.current.removeEventListener("mousemove", onMove);
      if (onEnter && sectionRef.current) sectionRef.current.removeEventListener("mouseenter", onEnter);
      if (onLeave && sectionRef.current) sectionRef.current.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Compact boxed grid for consistent rows and columns
  const layoutFor = (_index: number) => "sm:col-span-1 aspect-[5/4]";

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative px-6 py-24 sm:px-10 sm:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex items-end justify-between">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            (SELECTED WORK · {PROJECTS.length})
          </p>
          <p className="hidden font-mono text-xs tracking-widest text-muted-foreground sm:block">
            2021- 2025
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`proj-tile group relative overflow-hidden cursor-pointer border border-border/60 bg-foreground/5 ${layoutFor(i)}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { if (p.url) window.open(p.url, "_blank", "noopener,noreferrer"); }}
            >
              {/* Cover- gradient placeholder (fallback) + screenshot when available */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
              {p.image && (
                <img
                  src={PROJECT_IMAGES[p.image!] ?? ""}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              )}
              {/* Grain overlay for editorial texture */}
              <div
                className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                  backgroundSize: "200px 200px",
                }}
              />
              {/* Hover veil */}
              <div className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/30" />

              {/* Top label row */}
              <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
                <span className="font-mono text-[10px] tracking-widest text-white/70">({p.id})</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-widest text-white/70">{p.year}</span>
                  {p.url && (
                    <span className="font-mono text-[10px] tracking-widest text-white/70 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      LIVE <span className="text-accent">↗</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom title + meta (revealed on hover) */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
                <h3 className="text-display text-3xl sm:text-5xl text-white leading-[0.95]">
                  {p.name}
                </h3>
                <div className="mt-2 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-serif-italic text-white/80 text-sm sm:text-base mt-2">{p.type}</p>
                    <p className="font-mono text-[10px] tracking-widest text-white/60 mt-3">{p.stack.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 max-w-xl text-muted-foreground">
          Each project is a chance to <span className="text-serif-italic text-foreground">learn</span>, experiment and push my limits.
        </p>
      </div>

      {/* Cursor-following high-fidelity preview. Rendered only while a tile
          is hovered; when nothing is hovered, the element is unmounted and
          the rAF loop has stopped, so the cost is literally zero. */}
      {hovered !== null && (
        <div
          ref={previewRef}
          className="pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[16/10] w-[260px] overflow-hidden rounded-sm shadow-2xl sm:block"
          style={{
            transition: "opacity 300ms ease",
            willChange: "transform",
          }}
        >
          <div className={`relative h-full w-full bg-gradient-to-br ${PROJECTS[hovered].gradient}`}>
            {PROJECTS[hovered].image && (
              <img
                src={PROJECT_IMAGES[PROJECTS[hovered].image!] ?? ""}
                alt={PROJECTS[hovered].name}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            )}
            <div
              className="absolute inset-0 opacity-[0.1] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                backgroundSize: "200px 200px",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex justify-between font-mono text-[10px] tracking-widest text-white/70">
                <span>({PROJECTS[hovered].id})</span>
                <span>{PROJECTS[hovered].year}</span>
              </div>
              <div>
                <p className="text-display text-3xl text-white leading-[0.95]">{PROJECTS[hovered].name}</p>
                <p className="text-serif-italic text-white/80 text-sm mt-2">{PROJECTS[hovered].type}</p>
                <p className="font-mono text-[10px] tracking-widest text-white/60 mt-3">
                  {PROJECTS[hovered].stack.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
