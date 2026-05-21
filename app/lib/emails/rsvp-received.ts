function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f4f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
<tr><td style="background:#1a1a2e;padding:28px 40px;border-radius:10px 10px 0 0;text-align:center;">
<div style="font-size:24px;font-weight:700;color:#d4af37;letter-spacing:1px;">Our Memories</div>
<div style="font-size:11px;color:#8888aa;text-transform:uppercase;letter-spacing:3px;margin-top:4px;">our-memories.store</div>
</td></tr>
<tr><td style="background:#ffffff;padding:40px;">${content}</td></tr>
<tr><td style="background:#fafaf7;padding:20px 40px;border-radius:0 0 10px 10px;border-top:1px solid #eeeeea;text-align:center;">
<p style="margin:0;font-size:12px;color:#999999;">© 2025 Our Memories &nbsp;·&nbsp; <a href="https://our-memories.store" style="color:#d4af37;text-decoration:none;">our-memories.store</a></p>
<p style="margin:6px 0 0;font-size:11px;color:#bbbbbb;">Need help? <a href="https://t.me/ourmemories" style="color:#d4af37;text-decoration:none;">Contact us on Telegram</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export function rsvpReceivedEmail(params: {
  ownerName: string
  pageTitle: string
  guestName: string
  status: 'attending' | 'not_attending' | 'maybe'
  partySize: number
  message: string | null
  rsvpListUrl: string
  attendingCount: number
}): string {
  const { ownerName, pageTitle, guestName, status, partySize, message, rsvpListUrl, attendingCount } = params

  const statusLabel = status === 'attending' ? 'Attending ✓' : status === 'not_attending' ? 'Not Attending' : 'Maybe'
  const statusColor = status === 'attending' ? '#2d7a3a' : status === 'not_attending' ? '#cc4444' : '#cc7733'
  const statusBg = status === 'attending' ? '#f0faf2' : status === 'not_attending' ? '#fdf0f0' : '#fff8f0'
  const statusBorder = status === 'attending' ? '#b8e8c0' : status === 'not_attending' ? '#f0c8c8' : '#f0d9c0'

  const content = `
<h2 style="margin:0 0 8px;font-size:22px;color:#1a1a2e;">New RSVP Received</h2>
<p style="margin:0 0 24px;font-size:15px;color:#555555;">Someone just responded to your page <strong>${pageTitle}</strong>.</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf7;border:1px solid #eeeeea;border-radius:8px;margin:0 0 16px;">
<tr><td style="padding:20px 24px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
<tr>
  <td style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;">Guest Name</td>
  <td style="text-align:right;font-size:15px;font-weight:600;color:#1a1a2e;padding-bottom:10px;">${guestName}</td>
</tr>
<tr>
  <td style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;padding-bottom:10px;border-top:1px solid #eeeeea;padding-top:10px;">Party Size</td>
  <td style="text-align:right;font-size:14px;font-weight:600;color:#1a1a2e;border-top:1px solid #eeeeea;padding-top:10px;">${partySize} ${partySize === 1 ? 'person' : 'people'}</td>
</tr>
</table>
</td></tr>
</table>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${statusBg};border:1px solid ${statusBorder};border-radius:8px;margin:0 0 24px;">
<tr><td style="padding:14px 24px;text-align:center;">
<span style="font-size:16px;font-weight:700;color:${statusColor};">${statusLabel}</span>
</td></tr>
</table>

${message ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf7;border:1px solid #eeeeea;border-radius:8px;margin:0 0 24px;">
<tr><td style="padding:16px 24px;">
<p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Message from guest</p>
<p style="margin:0;font-size:14px;color:#555555;font-style:italic;">"${message}"</p>
</td></tr>
</table>` : ''}

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1a1a2e;border-radius:8px;margin:0 0 28px;">
<tr><td style="padding:16px 24px;text-align:center;">
<p style="margin:0;font-size:13px;color:#8888aa;text-transform:uppercase;letter-spacing:1px;">Total attending so far</p>
<p style="margin:4px 0 0;font-size:28px;font-weight:700;color:#d4af37;">${attendingCount}</p>
</td></tr>
</table>

<div style="text-align:center;margin:0 0 24px;">
<a href="${rsvpListUrl}" style="display:inline-block;background:#d4af37;color:#1a1a2e;font-size:14px;font-weight:700;padding:14px 36px;border-radius:6px;text-decoration:none;letter-spacing:0.5px;">View All RSVPs →</a>
</div>
`

  return layout(content)
}
