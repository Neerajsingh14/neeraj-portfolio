export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string
  );

export const mailConfigured = () =>
  !!process.env.RESEND_API_KEY && !!process.env.CONTACT_TO_EMAIL;

export type MailInput = {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

// html na ho to simple text ko bhi saaf card me lapet deta hai (jaise test email)
function plainWrap(subject: string, text: string) {
  const body = esc(text).replace(/\r?\n/g, "<br>");
  return `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0f172a;padding:22px 28px;color:#ffffff;font-size:18px;font-weight:bold;">${esc(subject)}</td></tr>
<tr><td style="height:4px;background:#22d3ee;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:26px 28px;font-size:15px;line-height:1.7;color:#1e293b;">${body}</td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendMail(
  o: MailInput
): Promise<{ ok: boolean; error?: string }> {
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
        html: o.html ?? plainWrap(o.subject, o.text),
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