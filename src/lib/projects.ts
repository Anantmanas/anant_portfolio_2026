export type Project = {
  id: string;
  name: string;
  type: string;
  year: string;
  stack: string;
  gradient: string;
  image?: string;
  description?: string;
  url?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "01",
    name: "ChatRoom",
    type: "AI-powered chat app",
    year: "2025",
    stack: "MERN Â· Socket.IO Â· Gorq SDK",
    gradient: "from-[#3d1f1f] via-[#1f0d0d] to-black",
    image: "ChatRoom.jpeg",
    url: "https://mernfront-agkd.onrender.com/",
    description:
      "Real-time multi-room chat with streaming LLM responses, RAG over conversation history, and tool-using AI agents.",
  },
  {
    id: "02",
    name: "PromptEnhance",
    type: "Prompt engineering SaaS",
    year: "2025",
    stack: "Next.js Â· Supabase Â· TypeScript",
    gradient: "from-[#1a3a5c] via-[#0d1f33] to-black",
    image: "promptenhance.png",
    url: "https://prompt-enhancer-six.vercel.app/",
    description:
      "Prompt refinement workspace with version diffing, A/B eval, and a feedback-driven optimizer loop.",
  },
  {
    id: "03",
    name: "Creative Agency",
    type: "Animated portfolio",
    year: "2024",
    stack: "React Â· Framer Motion Â· Supabase",
    gradient: "from-[#3d2818] via-[#1a1209] to-black",
    image: "CreativeAgency.jpeg",
    url: "https://www.theskylensstudios.com/",
    description:
      "Award-style agency site with cinematic scroll, animated case studies, and a CMS-backed gallery.",
  },
];

export const SKILLS = [
  { cat: "Frontend", items: ["React.js", "Next.js (App Router, Server Actions)", "Redux", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5", "CSS3"] },
  { cat: "Backend", items: ["Node.js", "Express.js", "REST APIs", "WebSockets", "Socket.io", "Prisma"] },
  { cat: "AI & LLMs", items: ["Gorq SDK", "Claude API", "Gemini", "RAG Pipelines", "AI Agents", "Streaming Responses", "Prompt Engineering"] },
  { cat: "Databases", items: ["MongoDB", "MySQL", "Supabase", "Firebase", "Vector Databases"] },
  { cat: "Auth & Tools", items: ["JWT", "OAuth2", "Git", "Vercel", "Render", "AWS", "Figma"] },
];

export const EXPERIENCE = [
  { role: "Freelance Full Stack Engineer", org: "Self-Employed Â· Remote", date: "Feb 2024 â€” Present" },
  { role: "Software Developer", org: "Radical Minds Technology", date: "Apr 2022 â€” Dec 2023" },
  { role: "UI Developer", org: "SM Web Solutions", date: "Oct 2020 â€” Feb 2022" },
];

export const AWARDS = [
  { year: "2025", title: "Featured Developer", org: "GitHub Trending", note: "PromptEnhance open-source release hit top-10 weekly trending." },
  { year: "2024", title: "Honorable Mention", org: "Awwwards", note: "Creative Agency site â€” motion & typography." },
  { year: "2024", title: "Top 5% Engineer", org: "Toptal Network", note: "Accepted into the top-tier freelance network after multi-stage vetting." },
  { year: "2023", title: "Best Internal Tool", org: "Radical Minds Hackathon", note: "Quality management automation that shipped to 12 clients." },
];

export const FIRST = "Anant";
export const LAST = "Manas";
export const EMAIL = "anantmanas101@gmail.com";
export const LOCATION = "Kanpur, IN";
export const PHONE = "+91 79051 34232";
