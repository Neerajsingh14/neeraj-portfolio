const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string
  );

export const mailConfigured = () =>
  !!process.env.RESEND_API_KEY && !!process.env.CONTACT_TO_EMAIL;

export async function sendMail(o: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return { ok: false, error: "RESEND_API_KEY ya CONTACT_TO_EMAIL set nahi hai" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: o.replyTo,
        subject: o.subject,
        text: o.text,
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(o.text)}</div>`,
      }),
    });

    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      return { ok: false, error: j.message || `Resend error ${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error: Resend tak nahi pahunch paya" };
  }
}