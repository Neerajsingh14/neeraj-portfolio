import { esc } from "./mail";

type ContactMail = {
  name: string;
  email: string;
  reason: string;
  message: string;
  siteUrl: string;
};

export function contactEmail(m: ContactMail) {
  const when =
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) + " IST";

  const cleanName = m.name.replace(/[\r\n]+/g, " ").trim().slice(0, 80);
  const cleanReason = m.reason.replace(/[\r\n]+/g, " ").trim().slice(0, 60);
  const subject = `New message from ${cleanName} (${cleanReason})`;

  const initial = esc((cleanName.charAt(0) || "?").toUpperCase());
  const name = esc(cleanName);
  const email = esc(m.email);
  const reason = esc(cleanReason);
  const body = esc(m.message).replace(/\r?\n/g, "<br>");
  const replyHref = `mailto:${email}?subject=${encodeURIComponent("Re: your message")}`;
  const inboxHref = m.siteUrl ? `${esc(m.siteUrl)}/admin/messages` : "";

  const inboxBtn = inboxHref
    ? `<td style="padding-left:10px;"><a href="${inboxHref}" style="display:inline-block;padding:13px 22px;border:1px solid #cbd5e1;border-radius:10px;color:#0f172a;font-size:14px;font-weight:bold;text-decoration:none;">Open inbox</a></td>`
    : "";

  const row = (label: string, value: string) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:110px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#64748b;">${label}</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a;">${value}</td></tr>`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#eef2f7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${name} sent you a message (${reason}) from your portfolio.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">

<tr><td style="background:#0f172a;padding:30px 32px;">
<div style="font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#22d3ee;">Portfolio contact form</div>
<div style="margin-top:10px;font-size:26px;font-weight:bold;line-height:1.25;color:#ffffff;">You have a new message</div>
</td></tr>
<tr><td style="height:4px;background:#22d3ee;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:30px 32px 6px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td width="56" height="56" align="center" valign="middle" style="width:56px;height:56px;background:#0ea5e9;border-radius:28px;color:#ffffff;font-size:24px;font-weight:bold;">${initial}</td>
<td style="padding-left:16px;">
<div style="font-size:19px;font-weight:bold;color:#0f172a;">${name}</div>
<div style="margin-top:3px;font-size:14px;"><a href="mailto:${email}" style="color:#0369a1;text-decoration:none;">${email}</a></div>
</td>
</tr></table>
</td></tr>

<tr><td style="padding:18px 32px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;">
${row("Reason", `<span style="display:inline-block;padding:4px 12px;background:#e0f2fe;color:#0369a1;border-radius:999px;font-size:13px;font-weight:bold;">${reason}</span>`)}
${row("Received", when)}
</table>
</td></tr>

<tr><td style="padding:24px 32px 0;">
<div style="font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Message</div>
<div style="margin-top:10px;background:#f8fafc;border-left:4px solid #22d3ee;border-radius:8px;padding:18px 20px;font-size:15px;line-height:1.75;color:#1e293b;">${body}</div>
</td></tr>

<tr><td style="padding:28px 32px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td><a href="${replyHref}" style="display:inline-block;padding:13px 26px;background:#0f172a;border-radius:10px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Reply to ${name}</a></td>
${inboxBtn}
</tr></table>
</td></tr>

<tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 32px;font-size:12px;line-height:1.7;color:#64748b;">
Sent from your portfolio contact form. Just hit Reply on this email to answer ${name} directly.
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    "NEW PORTFOLIO MESSAGE",
    "---------------------",
    `From:     ${cleanName}`,
    `Email:    ${m.email}`,
    `Reason:   ${cleanReason}`,
    `Received: ${when}`,
    "",
    "Message:",
    m.message,
    "",
    `Reply: mailto:${m.email}`,
    m.siteUrl ? `Inbox: ${m.siteUrl}/admin/messages` : "",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");

  return { subject, html, text };
}