import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PROJECTS, FIRST, LAST, EMAIL, LOCATION } from "@/lib/projects";
import chatRoomImg from "@/assets/project_thumbnails/ChatRoom.jpeg";
import promptEnhanceImg from "@/assets/project_thumbnails/promptenhance.png";
import creativeAgencyImg from "@/assets/project_thumbnails/CreativeAgency.jpeg";

const PROJECT_IMAGES: Record<string, string> = {
  "ChatRoom.jpeg": chatRoomImg,
  "promptenhance.png": promptEnhanceImg,
  "CreativeAgency.jpeg": creativeAgencyImg,
};

export const Route = createFileRoute("/work")({
  component: Work,
  head: () => ({
    meta: [
      { title: `Work · ${FIRST} ${LAST}` },
      { name: "description", content: `Selected projects by ${FIRST} ${LAST} — ${PROJECTS.length} case studies spanning AI, full-stack, and creative web.` },
    ],
  }),
});

const noiseSvg =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function WorkHeader() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: gsap } = await import("gsap");
      if (!mounted || !titleRef.current) return;
      const letters = titleRef.current.querySelectorAll<HTMLElement>(".w-letter-inner");
      gsap.fromTo(
        letters,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.03 },
      );
    })();
    return () => { mounted = false; };
  }, []);

  const word = "WORK";
  return (
    <header className="relative min-h-[60vh] w-full overflow-hidden px-6 sm:px-10 pt-28 pb-10 flex flex-col justify-between border-b border-border">
      <div className="flex items-center justify-between font-mono text-xs tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">← {FIRST} {LAST}</Link>
        <span>({PROJECTS.length})</span>
      </div>

      <div>
        <p className="font-mono text-xs tracking-widest text-muted-foreground mb-6">(SELECTED PROJECTS)</p>
        <h1 ref={titleRef} className="text-display text-[18vw] sm:text-[14vw] leading-[0.88] flex">
          {Array.from(word).map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden align-baseline mr-[0.05em]" style={{ lineHeight: 0.88 }}>
              <span className="w-letter-inner inline-block" style={{ willChange: "transform, opacity" }}>
                {ch}
              </span>
            </span>
          ))}
          <span className="inline-block overflow-hidden align-baseline" style={{ lineHeight: 0.88 }}>
            <span className="w-letter-inner inline-block text-muted-foreground">.</span>
          </span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground">
          Three case studies — <span className="text-serif-italic text-foreground">AI tooling</span>, real-time apps, and editorial front-ends, shipped between 2024 and 2025.
        </p>
      </div>
    </header>
  );
}

function WorkGrid() {
  const [hovered, setHovered] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let mounted = true;
    let onMove: ((e: MouseEvent) => void) | null = null;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !sectionRef.current) return;
      const tiles = sectionRef.current.querySelectorAll<HTMLElement>(".w-tile");
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
        },
      );

      const loop = () => {
        current.current.x += (target.current.x - current.current.x) * 0.15;
        current.current.y += (target.current.y - current.current.y) * 0.15;
        if (previewRef.current) {
          previewRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      onMove = (e: MouseEvent) => {
        target.current.x = e.clientX + 40;
        target.current.y = e.clientY - 110;
      };
      window.addEventListener("mousemove", onMove);
    })();
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
      if (onMove) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const layoutFor = (i: number) => {
    const mod = i % 4;
    if (mod === 0) return "sm:col-span-2 aspect-[16/9]";
    if (mod === 1) return "sm:col-span-1 aspect-[4/5]";
    if (mod === 2) return "sm:col-span-1 aspect-[4/5]";
    return "sm:col-span-2 aspect-[21/9]";
  };

  return (
    <section ref={sectionRef} id="projects" className="relative px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`w-tile group relative overflow-hidden cursor-pointer border border-border/60 bg-foreground/5 ${layoutFor(i)}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
              {p.image && (
                <img
                  src={PROJECT_IMAGES[p.image!] ?? ""}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
                />
              )}
              <div
                className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: noiseSvg, backgroundSize: "200px 200px" }}
              />
              <div className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/30" />

              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
                <span className="font-mono text-[10px] tracking-widest text-white/70">({p.id})</span>
                <span className="font-mono text-[10px] tracking-widest text-white/70">{p.year}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <h3 className="text-display text-3xl sm:text-5xl text-white leading-[0.95]">
                  {p.name}
                </h3>
                <div className="mt-2 grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-serif-italic text-white/80 text-sm sm:text-base mt-2">{p.type}</p>
                    <p className="font-mono text-[10px] tracking-widest text-white/60 mt-3">{p.stack.toUpperCase()}</p>
                    {p.description && (
                      <p className="text-white/70 text-xs mt-4 max-w-md leading-relaxed">{p.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <Link to="/" className="group inline-flex items-center gap-3 font-mono text-xs tracking-widest">
            <span className="text-accent transition-transform group-hover:-translate-x-1">←</span>
            BACK HOME
          </Link>
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            ({PROJECTS.length}) · 2021 — 2025
          </p>
        </div>
      </div>

      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-80 w-60 overflow-hidden rounded-sm shadow-2xl sm:block"
        style={{
          opacity: hovered !== null ? 1 : 0,
          transition: "opacity 300ms ease",
          willChange: "transform, opacity",
        }}
      >
        {hovered !== null && (
          <div className={`relative h-full w-full bg-gradient-to-br ${PROJECTS[hovered].gradient}`}>
            {PROJECTS[hovered].image && (
              <img
                src={PROJECT_IMAGES[PROJECTS[hovered].image!] ?? ""}
                alt={PROJECTS[hovered].name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div
              className="absolute inset-0 opacity-[0.1] mix-blend-overlay"
              style={{ backgroundImage: noiseSvg, backgroundSize: "200px 200px" }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex justify-between font-mono text-[10px] tracking-widest text-white/70">
                <span>({PROJECTS[hovered].id})</span>
                <span>{PROJECTS[hovered].year}</span>
              </div>
              <div>
                <p className="text-display text-3xl text-white leading-[0.95]">{PROJECTS[hovered].name}</p>
                <p className="text-serif-italic text-white/80 text-sm mt-2">{PROJECTS[hovered].type}</p>
                <p className="font-mono text-[10px] tracking-widest text-white/60 mt-3">{PROJECTS[hovered].stack.toUpperCase()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function WorkFooter() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = () => {
      const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Kolkata", hour12: false };
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(new Date()));
    };
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="border-t border-border px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">© 2026 {FIRST.toUpperCase()} {LAST.toUpperCase()}</Link>
        <span>{LOCATION.toUpperCase()} — {time} IST</span>
        <Link to={`mailto:${EMAIL}`} className="hover:text-foreground transition-colors">{EMAIL}</Link>
      </div>
    </footer>
  );
}

function Work() {
  useEffect(() => {
    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let raf = 0;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({ duration: 1.2, smoothWheel: true }) as never;
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    })();
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);

  return (
    <main className="relative bg-background text-foreground min-h-svh">
      <WorkHeader />
      <WorkGrid />
      <WorkFooter />
    </main>
  );
}