import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import profileImg from "@/assets/profile.jpg";
import chatRoomImg from "@/assets/project_thumbnails/ChatRoom.jpeg";
import promptEnhanceImg from "@/assets/project_thumbnails/promptenhance.png";
import creativeAgencyImg from "@/assets/project_thumbnails/CreativeAgency.jpeg";
import { WebGLLiquid } from "@/components/WebGLLiquid";
import {
  PROJECTS,
  SKILLS,
  EXPERIENCE,
  AWARDS,
  FIRST,
  LAST,
  EMAIL,
  LOCATION,
  PHONE,
} from "@/lib/projects";

function SplitLetters({
  text,
  className,
  italic = false,
  period = false,
  accentColor,
  delay = 0,
}: {
  text: string;
  className?: string;
  italic?: boolean;
  period?: boolean;
  accentColor?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: gsap } = await import("gsap");
      if (!mounted || !ref.current) return;
      const letters = ref.current.querySelectorAll<HTMLElement>(".letter-inner");
      gsap.fromTo(
        letters,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          stagger: 0.035,
          delay,
        },
      );
    })();
    return () => { mounted = false; };
  }, [delay]);

  const chars = Array.from(text);
  return (
    <span ref={ref} className={className} style={accentColor ? { color: accentColor } : undefined}>
      {chars.map((ch, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline"
          style={{ lineHeight: 0.9 }}
        >
          <span
            className={`letter-inner inline-block ${italic ? "text-serif-italic normal-case" : ""}`}
            style={{ willChange: "transform, opacity" }}
          >
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
      {period && (
        <span className="inline-block overflow-hidden align-baseline" style={{ lineHeight: 0.9 }}>
          <span className="letter-inner inline-block text-muted-foreground">.</span>
        </span>
      )}
    </span>
  );
}

function SplitWords({
  text,
  className,
  italicWords = [],
  delay = 0,
}: {
  text: string;
  className?: string;
  italicWords?: string[];
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: gsap } = await import("gsap");
      if (!mounted || !ref.current) return;
      const words = ref.current.querySelectorAll<HTMLElement>(".word-inner");
      gsap.fromTo(
        words,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.04,
          delay,
        },
      );
    })();
    return () => { mounted = false; };
  }, [delay]);

  const tokens = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {tokens.map((w, i) => {
        const isItalic = italicWords.some((iw) => w.toLowerCase().includes(iw.toLowerCase()));
        return (
          <span key={i} className="inline-block overflow-hidden align-baseline mr-[0.25em]" style={{ lineHeight: 1.1 }}>
            <span className={`word-inner inline-block ${isItalic ? "text-serif-italic" : ""}`}>
              {w}
            </span>
          </span>
        );
      })}
    </p>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});

const SECTIONS = [
  { id: "top", label: "Intro", href: "#top" },
  { id: "manifesto", label: "Manifesto", href: "#manifesto" },
  { id: "info", label: "About", href: "#info" },
  { id: "work", label: "Projects", href: "/work" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "awards", label: "Awards", href: "#awards" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "contact", label: "Contact", href: "#contact" },
];

function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => { setDone(true); setTimeout(onDone, 800); }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{ transform: done ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div className="flex items-baseline gap-3 px-6">
        <span className="text-display text-[12vw] sm:text-[8vw] leading-none">{FIRST}</span>
        <span className="text-serif-italic text-[12vw] sm:text-[8vw] leading-none">{LAST}<span className="text-muted-foreground">.</span></span>
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-xs tracking-widest text-muted-foreground tabular-nums">
        {String(count).padStart(3, "0")}
      </div>
      <div className="absolute bottom-8 left-8 font-mono text-xs tracking-widest text-muted-foreground">
        LOADING ASSETS
      </div>
    </div>
  );
}

function SideScrollMenu() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      let current = 0;
      let pct = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh * 0.4) {
          current = i;
          const h = rect.height || 1;
          pct = Math.min(1, Math.max(0, (vh * 0.4 - rect.top) / h));
        }
      });
      setActive(current);
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 sm:flex">
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {SECTIONS.map((s, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <a
              key={s.id}
              href={s.href}
              className="group flex items-center gap-3"
            >
              <span
                className={`font-mono text-[11px] tracking-widest transition-all duration-500 ${
                  isActive ? "opacity-100 text-foreground" : "opacity-0 group-hover:opacity-60 text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              <span className="relative block h-[2px] w-8 overflow-hidden bg-foreground/15">
                <span
                  className="absolute inset-y-0 left-0 bg-foreground transition-all duration-300"
                  style={{
                    width: isActive ? `${progress * 100}%` : isPast ? "100%" : "0%",
                  }}
                />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <WebGLLiquid
      id="top"
      colorDeep="#0b0100"
      colorMid="#6f0000"
      colorHighlight="#cb0c11"
      opacity={0.95}
      speed={1}
      flowStrength={1}
      grain={0.05}
      className="px-6 sm:px-10"
    >
      <div className="relative z-10 flex min-h-svh flex-col justify-between pt-28 pb-10">
        <SplitWords
          text="Quiet creator, bringing ideas to life, through code, motion and AI."
          className="max-w-md text-base sm:text-lg leading-snug"
          italicWords={["bringing"]}
          delay={0.9}
        />

        <h1 className="text-display text-[18vw] sm:text-[13vw] flex flex-wrap items-baseline gap-x-[0.18em]">
          <SplitLetters text={FIRST} className="" />
          <SplitLetters text={LAST} italic accentColor="#cfeee5" period />
        </h1>

        <div className="mt-8 flex flex-col gap-4 border-t border-foreground/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-xs tracking-[0.2em] text-foreground/80">→ V1.0</div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs tracking-[0.2em] text-foreground/80">
            <a href="https://linkedin.com/in/anant-manas" target="_blank" rel="noreferrer" className="hover:text-foreground">LINKEDIN</a>
            <span className="text-foreground/30">/</span>
            <a href="https://github.com/Anantmanas" target="_blank" rel="noreferrer" className="hover:text-foreground">GITHUB</a>
            <span className="text-foreground/30">/</span>
            <a href={`mailto:${EMAIL}`} className="hover:text-foreground">EMAIL</a>
          </div>
          <nav className="flex gap-6 font-mono text-xs tracking-[0.2em] text-foreground/80">
            <Link to="/work" className="hover:text-foreground">WORK</Link>
            <a href="#info" className="hover:text-foreground">INFO</a>
            <a href="#contact" className="hover:text-foreground">CONTACT</a>
          </nav>
        </div>
      </div>
    </WebGLLiquid>
  );
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !ref.current) return;
      const words = ref.current.querySelectorAll<HTMLElement>("[data-word]");
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        },
      );
    })();
    return () => { mounted = false; };
  }, []);

  const line1 = "As a creative developer, I craft tailor-made AI-powered experiences, blending technical precision and emotion.".split(" ");

  return (
    <section id="manifesto" ref={ref} className="px-6 py-32 sm:px-10 sm:py-48">
      <div className="mx-auto max-w-6xl">
        <p className="text-display text-[8vw] sm:text-[4.8vw] leading-[1.05]">
          {line1.map((w, i) => (
            <span key={i} data-word className="inline-block mr-[0.25em]">
              {/creative|emotion\.?/i.test(w) ? <span className="text-serif-italic lowercase">{w}</span> : w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="info" className="px-6 py-24 sm:px-10 sm:py-32 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-[1fr_1.2fr] sm:gap-20">
        <div className="relative">
          <img src={profileImg} alt="Portrait" width={768} height={960} loading="lazy" className="w-full grayscale aspect-[4/5] object-cover" />
          <div className="absolute -bottom-3 left-0 font-mono text-[10px] tracking-widest text-muted-foreground">[ FIG. 01 — PORTRAIT ]</div>
        </div>
        <div className="flex flex-col justify-between gap-10">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">(ABOUT)</p>
          <p className="text-2xl leading-snug sm:text-3xl">
            My name is <span className="text-serif-italic">{FIRST}</span>. A Full Stack Engineer with 3+ years building AI-powered web applications on the MERN stack — RAG pipelines, AI agents, streaming responses, and polished React / Next.js frontends, shipped remote-first from {LOCATION}.
          </p>
          <a href="#contact" className="group inline-flex items-center gap-3 self-start font-mono text-xs tracking-widest">
            <span>CONTACT</span>
            <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const PROJECT_IMAGES: Record<string, string> = {
  "ChatRoom.jpeg": chatRoomImg,
  "promptenhance.png": promptEnhanceImg,
  "CreativeAgency.jpeg": creativeAgencyImg,
};

function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
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
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
        },
      );

      // Smooth cursor follow for the preview
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
        target.current.y = e.clientY - 100;
      };
      window.addEventListener("mousemove", onMove);
    })();
    return () => {
      mounted = false;
      cancelAnimationFrame(rafRef.current);
      if (onMove) window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Editorial grid: alternating sizes for visual rhythm
  const layoutFor = (i: number) => {
    const mod = i % 4;
    if (mod === 0) return "sm:col-span-2 aspect-[16/9]";   // full width, wide
    if (mod === 1) return "sm:col-span-1 aspect-[4/5]";    // half, tall
    if (mod === 2) return "sm:col-span-1 aspect-[4/5]";    // half, tall
    return "sm:col-span-2 aspect-[21/9]";                   // full width, ultrawide
  };

  return (
    <section ref={sectionRef} id="work" className="relative px-6 py-24 sm:px-10 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex items-end justify-between">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">(SELECTED WORK · {PROJECTS.length})</p>
          <p className="hidden font-mono text-xs tracking-widest text-muted-foreground sm:block">2021 — 2025</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`proj-tile group relative overflow-hidden cursor-pointer border border-border/60 bg-foreground/5 ${layoutFor(i)}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Cover — gradient placeholder (fallback) + screenshot when available */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
              {p.image && (
                <img
                  src={PROJECT_IMAGES[p.image!] ?? ""}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105"
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
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
                <span className="font-mono text-[10px] tracking-widest text-white/70">({p.id})</span>
                <span className="font-mono text-[10px] tracking-widest text-white/70">{p.year}</span>
              </div>

              {/* Bottom title + meta (revealed on hover) */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
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

      {/* Cursor-following high-fidelity preview */}
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
                <p className="font-mono text-[10px] tracking-widest text-white/60 mt-3">{PROJECTS[hovered].stack.toUpperCase()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Skills() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="skills" className="px-6 py-24 sm:px-10 sm:py-32 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-16 sm:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-12">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">(SKILLS)</p>
          <h2 className="text-display text-3xl leading-tight sm:text-5xl">
            Full Stack Engineer, specialized in AI-powered web apps, passionate about elegant interfaces and <span className="text-serif-italic">design</span>.
          </h2>
          <a href="#contact" className="group inline-flex w-fit items-center gap-3 font-mono text-xs tracking-widest">
            CONTACT ME <span className="text-accent transition-transform group-hover:translate-x-1">✦</span>
          </a>
        </div>
        <ul>
          {SKILLS.map((s, i) => (
            <li key={s.cat} className="border-b border-border">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-6 text-left">
                <span className="text-display text-2xl sm:text-4xl">{s.cat}</span>
                <span className="font-mono text-2xl text-muted-foreground">{open === i ? "−" : "+"}</span>
              </button>
              <div className="grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                <div className="min-h-0 overflow-hidden">
                  <ul className="flex flex-col gap-1 pb-6 pl-1">
                    {s.items.map((it) => (
                      <li key={it} className="text-serif-italic text-xl text-muted-foreground sm:text-2xl">{it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Awards() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>(".award-row");
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
        },
      );
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section ref={ref} id="awards" className="px-6 py-24 sm:px-10 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex items-end justify-between">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">(AWARDS · RECOGNITION)</p>
          <p className="hidden font-mono text-xs tracking-widest text-muted-foreground sm:block">2023 — 2025</p>
        </div>
        <ul className="border-t border-border">
          {AWARDS.map((a) => (
            <li
              key={`${a.year}-${a.title}`}
              className="award-row grid grid-cols-1 gap-3 border-b border-border py-8 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-8"
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums">{a.year}</span>
              <div className="min-w-0">
                <h3 className="text-display text-2xl leading-tight sm:text-4xl">
                  {a.title} <span className="text-serif-italic text-muted-foreground">— {a.org}</span>
                </h3>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">{a.note}</p>
              </div>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground sm:text-right">★ RECOGNISED</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="px-6 py-24 sm:px-10 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <p className="mb-16 font-mono text-xs tracking-widest text-muted-foreground">(EXPERIENCE)</p>
        <ul>
          {EXPERIENCE.map((a) => (
            <li key={a.role} className="grid grid-cols-1 items-baseline gap-2 border-b border-border py-8 sm:grid-cols-[1.2fr_1fr_auto] sm:gap-8">
              <span className="text-display text-2xl sm:text-4xl">{a.role}</span>
              <span className="text-serif-italic text-muted-foreground">{a.org}</span>
              <span className="font-mono text-xs tracking-widest text-muted-foreground sm:text-right tabular-nums">{a.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32 border-t border-border">
      {/* Ambient decorative asset — Untitled1 (organic blob, top-right) */}
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -top-20 -right-20 h-[420px] w-[420px] opacity-[0.08] mix-blend-multiply dark:mix-blend-screen"
      >
        <defs>
          <filter id="contact-blob-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.85  0 0 0 0 1  0 0 0 0.5 0" />
          </filter>
        </defs>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          d="M200,40 C290,40 360,110 360,200 C360,290 290,360 200,360 C110,360 40,290 40,200 C40,110 110,40 200,40 Z M200,80 C270,80 320,130 320,200 C320,270 270,320 200,320 C130,320 80,270 80,200 C80,130 130,80 200,80 Z M200,120 C250,120 280,150 280,200 C280,250 250,280 200,280 C150,280 120,250 120,200 C120,150 150,120 200,120 Z"
        />
        <rect width="400" height="400" filter="url(#contact-blob-noise)" opacity="0.4" />
      </svg>

      {/* Ambient decorative asset — Untitled2 (concentric arcs, bottom-left) */}
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] opacity-[0.06] mix-blend-multiply dark:mix-blend-screen"
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.4">
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx="200" cy="200" r={20 + i * 18} opacity={1 - i * 0.04} />
          ))}
        </g>
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="mb-16 font-mono text-xs tracking-widest text-muted-foreground">(CONTACT)</p>
        <div className="grid gap-12 sm:grid-cols-2">
          <p className="text-2xl leading-snug">
            Open to <span className="text-serif-italic">remote</span> full-time roles and freelance engagements worldwide.
          </p>
          <p className="text-2xl leading-snug text-muted-foreground">
            <span className="text-serif-italic text-foreground">Open</span> to interesting collaborations — let's build AI-powered products that ship and scale.
          </p>
        </div>

        {/* Humble secondary CTA — quiet call-out */}
        <p className="mt-10 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Currently considering new projects and full-time roles <span className="text-serif-italic text-foreground">starting Q3 2026</span>. Happy to chat through scope, timing, or ideas.
        </p>

        <a href={`mailto:${EMAIL}`} className="mt-16 block text-display text-[8vw] sm:text-[6vw] leading-none transition-colors hover:text-accent break-all">
          {EMAIL.split("@")[0]}<span className="text-serif-italic">@</span>{EMAIL.split("@")[1]}
        </a>
        <p className="mt-6 font-mono text-xs tracking-widest text-muted-foreground">{PHONE} · {LOCATION}</p>
      </div>
    </section>
  );
}

function Footer() {
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
        <span>© 2026 {FIRST.toUpperCase()} {LAST.toUpperCase()}</span>
        <span>{LOCATION.toUpperCase()} — {time} IST</span>
        <span>V1.0</span>
      </div>
    </footer>
  );
}

function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let raf = 0;
    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({ duration: 1.2, smoothWheel: true }) as never;
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    })();
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); };
  }, [loading]);

  return (
    <main className="relative bg-background text-foreground">
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <SideScrollMenu />
      <Hero />
      <Manifesto />
      <About />
      <Projects />
      <Skills />
      <Awards />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
