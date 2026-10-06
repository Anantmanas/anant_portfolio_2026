import { useState, type CSSProperties, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error("Contact request failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const fieldClass = "w-full border-b border-[var(--form-accent)] bg-transparent px-0 py-3 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/70 focus:border-[var(--form-accent)] focus:shadow-[0_2px_0_0_var(--form-accent)]";

  return (
    <section id="contact-form" className="border-t border-[var(--form-accent)] px-6 py-24 sm:px-10 sm:py-32" style={{ "--form-accent": "var(--island-color, var(--accent))" } as CSSProperties}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted-foreground">(START A CONVERSATION)</p>
          <h2 className="mt-5 text-display text-5xl sm:text-6xl">Make it<br />meaningful.</h2>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-muted-foreground">Share the shape of the work. I will reply with a clear next step.</p>
        </div>
        <form onSubmit={handleSubmit} className="border-t border-[var(--form-accent)] pt-2" aria-live="polite">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <label className="block pt-7 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">YOUR NAME<input name="name" required autoComplete="name" placeholder="Name" className={fieldClass} /></label>
            <label className="block pt-7 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">YOUR EMAIL<input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={fieldClass} /></label>
          </div>
          <label className="block pt-7 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">WHAT CAN I HELP WITH?
            <select name="service" required defaultValue="" className={`${fieldClass} cursor-pointer appearance-none rounded-none [color-scheme:light] dark:[color-scheme:dark] [&>option]:bg-background [&>option]:text-foreground`}><option value="" disabled>Select an option</option><option>Portfolio-Website</option><option>Full SaaS web App development</option><option>Contractual Hiring for a Job</option></select>
          </label>
          <label className="block pt-7 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">YOUR MESSAGE
            <textarea name="message" required rows={4} placeholder="A few details about the work, timing, and what success looks like." className={`${fieldClass} resize-y`} />
          </label>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button data-contact-submit type="submit" disabled={status === "sending"} className="group inline-flex min-w-48 items-center justify-between bg-foreground px-5 py-4 font-mono text-xs font-semibold tracking-[0.16em] text-background transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-[var(--form-accent)] hover:shadow-[0_12px_28px_color-mix(in_srgb,var(--form-accent),transparent_65%)] focus-visible:-translate-y-1 focus-visible:bg-[var(--form-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--form-accent)] disabled:cursor-wait disabled:opacity-60">
              {status === "sending" ? "SENDING..." : "SEND MESSAGE"}<span className="text-lg transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </button>
            {status === "sent" && <p className="font-mono text-xs tracking-wide text-foreground">Thankyou for Contacting me!</p>}
            {status === "error" && <p className="font-mono text-xs tracking-wide text-red-600 dark:text-red-400">Could not send. Please try again.</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
