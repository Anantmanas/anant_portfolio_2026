import { createFileRoute } from "@tanstack/react-router";

// Local Vite dev does not inject unprefixed secrets into process.env.
// Node loads .env here; deployed environments continue to use their own secret binding.
if (typeof process !== "undefined" && typeof process.loadEnvFile === "function") {
  process.loadEnvFile();
}

const recipient = "anantmanas101@gmail.com";
const allowedServices = new Set(["Portfolio-Website", "Full SaaS web App development", "Contractual Hiring for a Job"]);

type ContactPayload = { name?: unknown; email?: unknown; sender?: unknown; service?: unknown; message?: unknown };

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { name, email, sender, service, message } = (await request.json()) as ContactPayload;
        const senderEmail = typeof email === "string" ? email : sender;
        const senderName = typeof name === "string" ? name : "Portfolio visitor";
        const enquiryType = typeof service === "string" ? service : "Portfolio enquiry";
        if (typeof senderEmail !== "string" || typeof message !== "string" || (typeof service === "string" && !allowedServices.has(service))) return Response.json({ error: "Invalid contact request." }, { status: 400 });
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) return Response.json({ error: "Email service is not configured." }, { status: 503 });
        const safe = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
        const requestHeaders = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
        const notification = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>", to: [recipient], reply_to: senderEmail, subject: `New ${enquiryType} enquiry from ${senderName}`,
            html: `<!doctype html><html><body style="margin:0;background:#09090b;color:#f4f4f5;font-family:Arial,sans-serif"><main style="max-width:640px;margin:0 auto;padding:48px 24px"><p style="margin:0 0 32px;color:#a1a1aa;font:12px monospace;letter-spacing:2px">ANANT MANAS — CONTACT</p><section style="border:1px solid #3f3f46;padding:32px"><h1 style="margin:0 0 20px;font-size:32px">Thankyou for Contacting me!</h1><p style="color:#d4d4d8">A new project enquiry has arrived.</p><hr style="border:0;border-top:1px solid #3f3f46;margin:28px 0" /><p><strong>From:</strong> ${safe(senderName)} (${safe(senderEmail)})</p><p><strong>Service:</strong> ${safe(enquiryType)}</p><p style="white-space:pre-wrap"><strong>Message:</strong><br />${safe(message)}</p></section></main></body></html>`,
          }),
        });
        if (!notification.ok) return Response.json({ error: "Unable to send message." }, { status: 502 });
        const autoResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({
            from: "Anant Manas <onboarding@resend.dev>", to: [senderEmail], subject: "Thankyou for Contacting me!",
            html: `<!doctype html><html><body style="margin:0;background:#09090b;color:#f4f4f5;font-family:Arial,sans-serif"><main style="max-width:640px;margin:0 auto;padding:48px 24px"><p style="margin:0 0 32px;color:#a1a1aa;font:12px monospace;letter-spacing:2px">ANANT MANAS — PORTFOLIO</p><section style="border:1px solid #3f3f46;padding:32px"><h1 style="margin:0 0 20px;font-size:32px">Thankyou for Contacting me!</h1><p style="color:#d4d4d8;line-height:1.6">Hi ${safe(senderName)}, I received your ${safe(enquiryType)} enquiry and will get back to you shortly.</p></section></main></body></html>`,
          }),
        });
        if (!autoResponse.ok) return Response.json({ error: "Unable to send confirmation." }, { status: 502 });
        return Response.json({ ok: true });
      },
    },
  },
});
