"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";

export type IslandPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface IslandSection {
  id: string;
  label: string;
}

export interface IslandFont {
  name: string;
  value: string;
}

export interface IslandTheme {
  name: string;
  color: string;
  color2?: string;
}

export interface DynamicIslandProps {
  position?: IslandPosition;
  sections?: IslandSection[];
  defaultSectionLabel?: string;
  sectionIcon?: React.ReactNode;
  fonts?: IslandFont[];
  showFontPicker?: boolean;
  defaultFontIndex?: number;
  themes?: IslandTheme[];
  showThemePicker?: boolean;
  defaultThemeIndex?: number;
  showThemeToggle?: boolean;
  toggleAnimationType?: "none" | "circle-spread" | "round-morph" | "swipe-left" | "swipe-up" | "diag-down-right" | "fade-in-out" | "shrink-grow" | "flip-x-in" | "split-vertical" | "swipe-right" | "swipe-down" | "wave-ripple";
  toggleDuration?: number;
  storageKey?: string;
  disablePersistence?: boolean;
  className?: string;
  modalSelectors?: string[];
  lightBg?: string;
  darkBg?: string;
  onSectionChange?: (section: IslandSection | null) => void;
  onFontChange?: (font: IslandFont) => void;
  onThemeChange?: (theme: IslandTheme) => void;
}

const DEFAULT_FONTS: IslandFont[] = [
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Geist", value: "'Geist', sans-serif" },
  { name: "Outfit", value: "Outfit, sans-serif" },
  { name: "Plus Jakarta", value: "'Plus Jakarta Sans', sans-serif" },
  { name: "Poppins", value: "Poppins, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Mono", value: "'Geist Mono', monospace" },
];

const DEFAULT_THEMES: IslandTheme[] = [
  { name: "Blue", color: "#173eff", color2: "#3758f9" },
  { name: "Midnight", color: "#0f172a", color2: "#1e293b" },
  { name: "Emerald", color: "#10b981", color2: "#34d399" },
  { name: "Violet", color: "#8b5cf6", color2: "#a78bfa" },
  { name: "Crimson", color: "#e11d48", color2: "#fb7185" },
  { name: "Sunset", color: "#f97316", color2: "#fb923c" },
];

const DEFAULT_SECTIONS: IslandSection[] = [{ id: "home", label: "Home" }];

function getPositionClasses(position: IslandPosition): string {
  switch (position) {
    case "top-left":     return "top-4 md:top-6 left-4 md:left-6";
    case "top-center":   return "top-4 md:top-6 left-1/2 -translate-x-1/2";
    case "top-right":    return "top-4 md:top-6 right-4 md:right-6";
    case "bottom-left":  return "bottom-4 md:bottom-6 left-4 md:left-6";
    case "bottom-right": return "bottom-4 md:bottom-6 right-4 md:right-6";
    case "bottom-center":
    default:             return "bottom-4 md:bottom-6 left-1/2 -translate-x-1/2";
  }
}

function getDropdownDirection(position: IslandPosition): "up" | "down" {
  return position.startsWith("top") ? "down" : "up";
}

export function DynamicIsland({
  position             = "bottom-center",
  sections             = DEFAULT_SECTIONS,
  defaultSectionLabel  = "Home",
  sectionIcon,
  fonts                = DEFAULT_FONTS,
  showFontPicker       = true,
  defaultFontIndex     = 0,
  themes               = DEFAULT_THEMES,
  showThemePicker      = true,
  defaultThemeIndex    = 0,
  showThemeToggle      = true,
  toggleAnimationType  = "diag-down-right",
  toggleDuration       = 400,
  storageKey           = "island",
  disablePersistence   = false,
  className            = "",
  modalSelectors       = ['[data-checkout-modal="true"]', ".modal", '[role="dialog"]'],
  lightBg              = "rgba(255,255,255,0.8)",
  darkBg               = "#111111",
  onSectionChange,
  onFontChange,
  onThemeChange,
}: DynamicIslandProps) {
  const [activeTab, setActiveTab]           = useState<"font" | "theme" | null>(null);
  const [currentFont, setCurrentFont]       = useState<IslandFont>(fonts[defaultFontIndex] ?? fonts[0]);
  const [currentTheme, setCurrentTheme]     = useState<IslandTheme>(themes[defaultThemeIndex] ?? themes[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(defaultSectionLabel);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const islandRef                           = useRef<HTMLDivElement>(null);
  const { scrollYProgress }                 = useScroll();

  const dropDir = getDropdownDirection(position);
  const positionCls = getPositionClasses(position);

  const dropdownBase = dropDir === "up"
    ? "absolute bottom-full mb-3"
    : "absolute top-full mt-3";

  const detectSection = useCallback(() => {
    if (typeof window === "undefined") return;
    let active = defaultSectionLabel;
    let activeObj: IslandSection | null = null;
    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 3) {
        active = sec.label;
        activeObj = sec;
      }
    }
    if (
      sections.length > 0 &&
      window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 50
    ) {
      active = sections[sections.length - 1].label;
      activeObj = sections[sections.length - 1];
    }
    setCurrentSection(active);
    onSectionChange?.(activeObj);
  }, [sections, defaultSectionLabel, onSectionChange]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest * 100);
    detectSection();
  });

  useEffect(() => {
    if (disablePersistence || typeof window === "undefined") return;
    try {
      const sf = localStorage.getItem(`${storageKey}-font`);
      if (sf) {
        const p: IslandFont = JSON.parse(sf);
        const m = fonts.find(f => f.name === p.name);
        if (m) setCurrentFont(m);
      }
      const st = localStorage.getItem(`${storageKey}-theme`);
      if (st) {
        const p: IslandTheme = JSON.parse(st);
        const m = themes.find(t => t.name === p.name);
        if (m) setCurrentTheme(m);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.fontFamily = currentFont.value;
    if (!disablePersistence) localStorage.setItem(`${storageKey}-font`, JSON.stringify(currentFont));
    onFontChange?.(currentFont);
  }, [currentFont, storageKey, disablePersistence, onFontChange]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--island-color", currentTheme.color);
    document.documentElement.style.setProperty("--island-color-2", currentTheme.color2 ?? currentTheme.color);
    if (!disablePersistence) localStorage.setItem(`${storageKey}-theme`, JSON.stringify(currentTheme));
    onThemeChange?.(currentTheme);
  }, [currentTheme, storageKey, disablePersistence, onThemeChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      const has = modalSelectors.some(sel => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const s = window.getComputedStyle(el);
        return s.display !== "none" && s.visibility !== "hidden" && parseFloat(s.opacity) > 0;
      });
      setIsModalOpen(has);
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    check();
    const interval = setInterval(check, 1000);
    return () => { observer.disconnect(); clearInterval(interval); };
  }, [modalSelectors]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) setActiveTab(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (isModalOpen) return null;

  const accentColor = currentTheme.color;

  return (
    <div className={`fixed z-[9998] ${positionCls} ${className}`}>
      <div
        ref={islandRef}
        className="relative flex items-center p-1.5 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        style={{ background: lightBg }}
      >
        <style>{`.dark [data-island-dark]{background:${darkBg}!important}`}</style>
        <div data-island-dark className="absolute inset-0 rounded-full" style={{ background: lightBg, zIndex: -1 }} />

        {showFontPicker && fonts.length > 0 && (
          <div className="relative">
            <button
              id="island-font-btn"
              onClick={() => setActiveTab(activeTab === "font" ? null : "font")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === "font"
                  ? "bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-300 dark:ring-white/10"
                  : "text-zinc-700 dark:text-gray-200 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
              }`}
            >
              {currentFont.name}
            </button>
            <AnimatePresence>
              {activeTab === "font" && (
                <motion.div
                  initial={{ opacity: 0, y: dropDir === "up" ? 10 : -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: dropDir === "up" ? 10 : -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`${dropdownBase} left-0 w-52 bg-white dark:bg-[#111] ring-1 ring-zinc-200 dark:ring-white/10 rounded-[20px] shadow-2xl p-2 flex flex-col z-50`}
                >
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => { setCurrentFont(font); setActiveTab(null); }}
                      className={`flex items-center px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        currentFont.name === font.name
                          ? "font-medium text-white shadow-sm"
                          : "text-zinc-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                      }`}
                      style={currentFont.name === font.name ? { backgroundColor: accentColor } : {}}
                    >
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {showFontPicker && fonts.length > 0 && (
          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-500 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors duration-200"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            {sectionIcon ? (
              <span className="w-4 h-4 flex items-center justify-center">{sectionIcon}</span>
            ) : (
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path strokeWidth="3" stroke="currentColor" fill="none" className="text-zinc-300 dark:text-white/20"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path strokeWidth="3" fill="none" stroke={accentColor}
                  strokeDasharray={`${scrollProgress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            )}
          </div>
          <span className="w-[70px] text-center inline-block truncate">{currentSection}</span>
        </button>

        {showThemePicker && themes.length > 0 && (
          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
        )}

        {showThemePicker && themes.length > 0 && (
          <div className="relative">
            <button
              id="island-theme-btn"
              onClick={() => setActiveTab(activeTab === "theme" ? null : "theme")}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === "theme"
                  ? "bg-zinc-100 dark:bg-[#222] text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-300 dark:ring-white/10"
                  : "text-zinc-700 dark:text-gray-200 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: currentTheme.color }} />
              {currentTheme.name}
            </button>
            <AnimatePresence>
              {activeTab === "theme" && (
                <motion.div
                  initial={{ opacity: 0, y: dropDir === "up" ? 10 : -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: dropDir === "up" ? 10 : -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`${dropdownBase} right-0 w-40 bg-white dark:bg-[#111] border border-zinc-200 dark:border-white/10 rounded-[20px] shadow-2xl p-2 flex flex-col z-50`}
                >
                  {themes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => { setCurrentTheme(theme); setActiveTab(null); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        currentTheme.name === theme.name
                          ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white font-medium"
                          : "text-zinc-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.color }} />
                      {theme.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {showThemeToggle && (
          <>
            {showThemePicker && themes.length > 0 && (
              <div className="w-[1px] h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
            )}
            <ToggleTheme
              animationType={toggleAnimationType}
              duration={toggleDuration}
              className="text-zinc-700 dark:text-gray-200 hover:bg-zinc-100 dark:hover:bg-white/5"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default DynamicIsland;