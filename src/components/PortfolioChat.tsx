import { useState, useCallback, useRef, useEffect, type FormEvent } from "react";
import { MessageCircle, X, ArrowLeft, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = { role: "assistant" | "user"; content: string };
type ActiveView = "chat" | "form" | "success";

/**
 * PortfolioChat – floating widget that routes LLM actions to UI behaviours.
 *
 * State machine:
 *   - isOpen: controls FAB / widget visibility.
 *   - activeView: 'chat' | 'form' | 'success' – determines which UI is shown.
 *   - formEmail / formMessage: contact form fields.
 *
 * Action interceptor parses streamed LLM chunks for tokens like:
 *   [ACTION: DOWNLOAD_RESUME]
 *   [ACTION: SCROLL_TO_PROJECTS]
 *   [ACTION: OPEN_CONTACT_FORM]
 * It sanitises the text before rendering.
 */
const PortfolioChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the newest message.
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, activeView, isOpen]);

  // ----- ACTION PIPELINE -----
  const ACTION_REGEX = /\[ACTION: (DOWNLOAD_RESUME|SCROLL_TO_PROJECTS|OPEN_CONTACT_FORM)\]/g;

  const handleActionToken = useCallback((token: string) => {
    switch (token) {
      case "DOWNLOAD_RESUME": {
        const anchor = document.createElement("a");
        anchor.href = "/Anant_Manas_Resume.pdf";
        anchor.download = "Anant_Manas_Resume.pdf";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        break;
      }
      case "SCROLL_TO_PROJECTS":
        document
          .getElementById("projects-section")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "OPEN_CONTACT_FORM":
        setActiveView("form");
        break;
      default:
        break;
    }
  }, []);

  const sanitizeAndDispatch = (raw: string) => {
    const tokens = raw.match(ACTION_REGEX);
    if (tokens) {
      tokens.forEach((t) => {
        const name = t.replace("[ACTION: ", "").replace("]", "").trim();
        handleActionToken(name);
      });
    }
    return raw.replace(ACTION_REGEX, "").trim();
  };

  // ----- SIMULATED LLM RESPONSE -----
  const simulateLLMResponse = async (prompt: string) => {
    const simulated = `${prompt}\n[ACTION: OPEN_CONTACT_FORM]`;
    const cleaned = sanitizeAndDispatch(simulated);
    setMessages((prev) => [...prev, { role: "assistant", content: cleaned }]);
  };

  const handleUserMessage = async (msg: string) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setDraft("");
    await simulateLLMResponse(msg);
  };

  // ----- FORM SUBMIT -----
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formEmail || !formMessage) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "anantmanas101@gmail.com",
          sender: formEmail,
          message: formMessage,
        }),
      });
      if (res.ok) setActiveView("success");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* FAB trigger */}
      <Button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        size="icon"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-[9999] h-12 w-12 rounded-full bg-zinc-800 text-foreground shadow-lg hover:bg-zinc-700"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9999] flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-foreground shadow-2xl"
          style={{ width: 380, height: 540 }}
          role="dialog"
          aria-label="Portfolio assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 p-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold">
                AM
              </div>
              <div className="text-sm">
                <div className="font-medium">Anant Assistant</div>
                <div className="text-xs text-zinc-400">Active Router</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {activeView === "form" && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setActiveView("chat")}
                  aria-label="Back to chat"
                  className="h-8 w-8 text-zinc-300 hover:bg-zinc-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                aria-label="Close widget"
                className="h-8 w-8 text-zinc-300 hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden">
            {activeView === "chat" && (
              <div className="flex h-full flex-col">
                <div
                  ref={messagesRef}
                  className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
                >
                  {messages.length === 0 && (
                    <p className="text-sm text-zinc-500">
                      Ask about Anant's work, request the resume, or open the contact form.
                    </p>
                  )}
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={
                        m.role === "user"
                          ? "ml-auto max-w-[80%] rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
                          : "mr-auto max-w-[80%] rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                      }
                    >
                      <div className="mb-0.5 text-[10px] uppercase tracking-wide text-zinc-400">
                        {m.role === "user" ? "You" : "Assistant"}
                      </div>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex items-center gap-2 border-t border-zinc-800 p-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUserMessage(draft);
                  }}
                >
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message…"
                    className="bg-zinc-900 text-foreground placeholder:text-zinc-500"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    aria-label="Send message"
                    className="h-9 w-9 shrink-0"
                    disabled={!draft.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}

            {activeView === "form" && (
              <form
                className="flex h-full flex-col gap-3 p-4"
                onSubmit={handleFormSubmit}
              >
                <label className="flex flex-col gap-1 text-xs text-zinc-300">
                  Your e-mail
                  <Input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="bg-zinc-900 text-foreground"
                  />
                </label>
                <label className="flex flex-1 flex-col gap-1 text-xs text-zinc-300">
                  Message
                  <textarea
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-zinc-900 px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </label>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-auto"
                >
                  {isSubmitting ? "Sending…" : "Send"}
                </Button>
              </form>
            )}

            {activeView === "success" && (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
                <p className="text-lg font-medium">
                  Message dispatched! Anant will contact you soon.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveView("chat")}
                >
                  Back to chat
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioChat;
