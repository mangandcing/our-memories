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

export function pagePublishedEmail(params: {
  customerName: string
  pageTitle: string
  pageUrl: string
  expiryDate: string
}): string {
  const { customerName, pageTitle, pageUrl, expiryDate } = params

  const content = `
<h2 style="margin:0 0 8px;font-size:22px;color:#1a1a2e;">Your Page is Live! 🎉</h2>
<p style="margin:0 0 24px;font-size:15px;color:#555555;">Congratulations, ${customerName}! <strong>${pageTitle}</strong> has been published and is now live for the world to see.</p>

<div style="text-align:center;margin:28px 0;">
<a href="${pageUrl}" style="display:inline-block;background:#d4af37;color:#1a1a2e;font-size:15px;font-weight:700;padding:16px 40px;border-radius:6px;text-decoration:none;letter-spacing:0.5px;">View Your Live Page →</a>
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf7;border:1px solid #eeeeea;border-radius:8px;margin:0 0 28px;">
<tr><td style="padding:20px 24px;">
<p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;">Page URL</p>
<p style="margin:0 0 14px;font-size:14px;"><a href="${pageUrl}" style="color:#d4af37;text-decoration:none;">${pageUrl}</a></p>
<p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;border-top:1px solid #eeeeea;padding-top:14px;">Active Until</p>
<p style="margin:0;font-size:14px;font-weight:600;color:#1a1a2e;">${expiryDate}</p>
</td></tr>
</table>

<h3 style="margin:0 0 12px;font-size:15px;color:#1a1a2e;">Share Your Memory</h3>
<p style="margin:0 0 8px;font-size:14px;color:#555555;">Your page comes with a QR code — you can find it on the page itself. Share your link on:</p>
<ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#555555;line-height:1.8;">
<li><strong>Facebook</strong> — paste the link in your post or story</li>
<li><strong>Instagram</strong> — add the link to your bio or share as a story sticker</li>
<li><strong>WhatsApp / Viber</strong> — send directly to family and friends</li>
</ul>

<p style="margin:0;font-size:13px;color:#888888;border-top:1px solid #eeeeea;padding-top:20px;">Questions or need changes? Contact us on <a href="https://t.me/ourmemories" style="color:#d4af37;text-decoration:none;">Telegram</a>.</p>
`

  return layout(content)
}
